package cmd

import (
	"embed"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/spf13/cobra"
)

var distFS embed.FS

func SetDistFS(fs embed.FS) {
	distFS = fs
}

var (
	port    int
	host    string
	nodeURL string
	version = "dev"
)

var rootCmd = &cobra.Command{
	Use:   "skycoin-web",
	Short: "Skycoin Web Wallet",
	Long:  `A lightweight web-based wallet for Skycoin and other supported cryptocurrencies.`,
	Run: func(cmd *cobra.Command, args []string) {
		serve()
	},
}

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the web server",
	Long:  `Start the embedded web server to serve the wallet interface.`,
	Run: func(cmd *cobra.Command, args []string) {
		serve()
	},
}

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print version information",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("skycoin-web version %s\n", version)
	},
}

func init() {
	rootCmd.PersistentFlags().IntVarP(&port, "port", "p", 8001, "Port to serve on")
	rootCmd.PersistentFlags().StringVarP(&host, "host", "H", "127.0.0.1", "Host to bind to")
	rootCmd.PersistentFlags().StringVarP(&nodeURL, "node-url", "n", "https://node.skycoin.com", "Skycoin node URL to connect to")

	rootCmd.AddCommand(serveCmd)
	rootCmd.AddCommand(versionCmd)
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func serve() {
	// Get the embedded dist directory
	distSub, err := fs.Sub(distFS, "dist")
	if err != nil {
		log.Fatalf("Failed to get dist subdirectory: %v", err)
	}

	// Create file server
	fileServer := http.FileServer(http.FS(distSub))

	// Setup routes
	// Proxy all /api/* requests to the configured node
	http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers first (before any WriteHeader call)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token")

		// Handle OPTIONS preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Build target URL: nodeURL + request path
		targetURL := nodeURL + r.URL.Path
		if r.URL.RawQuery != "" {
			targetURL += "?" + r.URL.RawQuery
		}

		log.Printf("[PROXY] %s %s -> %s", r.Method, r.URL.Path, targetURL)

		// Create proxy request
		proxyReq, err := http.NewRequest(r.Method, targetURL, r.Body)
		if err != nil {
			log.Printf("[PROXY] Failed to create request: %v", err)
			http.Error(w, "Failed to create proxy request", http.StatusInternalServerError)
			return
		}

		// Copy headers from original request
		for name, values := range r.Header {
			// Skip headers that would cause CSRF issues
			if name == "Referer" || name == "Origin" {
				continue
			}
			for _, value := range values {
				proxyReq.Header.Add(name, value)
			}
		}

		// Set appropriate Referer and Origin for the node
		proxyReq.Header.Set("Referer", nodeURL+"/")
		proxyReq.Header.Set("Origin", nodeURL)

		// Execute request to node
		client := &http.Client{}
		resp, err := client.Do(proxyReq)
		if err != nil {
			log.Printf("[PROXY] Request failed: %v", err)
			http.Error(w, fmt.Sprintf("Failed to proxy request to node: %v", err), http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()

		log.Printf("[PROXY] Response: %d", resp.StatusCode)

		// Copy response headers (except CORS which we already set)
		for name, values := range resp.Header {
			if name != "Access-Control-Allow-Origin" && name != "Access-Control-Allow-Methods" && name != "Access-Control-Allow-Headers" {
				for _, value := range values {
					w.Header().Add(name, value)
				}
			}
		}

		// Copy status code and body
		w.WriteHeader(resp.StatusCode)
		io.Copy(w, resp.Body)
	})
	
	// Serve static files with logging
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Log all non-API requests
		if r.URL.Path != "/" && r.URL.Path != "/favicon.ico" {
			log.Printf("[STATIC] %s %s", r.Method, r.URL.Path)
		}
		
		// Set correct MIME type for WASM files
		if len(r.URL.Path) > 5 && r.URL.Path[len(r.URL.Path)-5:] == ".wasm" {
			w.Header().Set("Content-Type", "application/wasm")
		}
		
		fileServer.ServeHTTP(w, r)
	})

	addr := fmt.Sprintf("%s:%d", host, port)
	fmt.Printf("Skycoin Web Wallet starting...\n")
	fmt.Printf("Server listening on http://%s\n", addr)
	fmt.Printf("Proxying to node: %s\n", nodeURL)
	fmt.Printf("Open your browser and navigate to the address above\n")
	fmt.Printf("Press Ctrl+C to stop the server\n\n")

	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
