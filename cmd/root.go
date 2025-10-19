package cmd

import (
	"embed"
	"fmt"
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
	// API endpoint for configuration
	http.HandleFunc("/api/config", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		fmt.Fprintf(w, `{"nodeUrl":"%s"}`, nodeURL)
	})
	
	// Serve static files
	http.Handle("/", fileServer)

	addr := fmt.Sprintf("%s:%d", host, port)
	fmt.Printf("Skycoin Web Wallet starting...\n")
	fmt.Printf("Server listening on http://%s\n", addr)
	fmt.Printf("Node URL: %s\n", nodeURL)
	fmt.Printf("Open your browser and navigate to the address above\n")
	fmt.Printf("Press Ctrl+C to stop the server\n\n")

	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
