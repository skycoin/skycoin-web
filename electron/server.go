/*
Lite wallet backend service

Serves precompiled angular website from the ./dist folder.

This must be run from the same folder as ./dist.
*/

package main

import (
	"flag"
	"net/http"
	"time"
)

const (
	walletHost = "127.0.0.1"

	// https://blog.cloudflare.com/the-complete-guide-to-golang-net-http-timeouts/
	// timeout for requests
	serverReadTimeout  = time.Second * 10
	serverWriteTimeout = time.Second * 60
	serverIdleTimeout  = time.Second * 120
)

var (
	path string
	port string
)

// ContentSecurityPolicy csp header in http response
const ContentSecurityPolicy = "default-src 'self'" +
	"; script-src 'self' 'unsafe-eval'" +
	"; connect-src *" +
	"; img-src 'self' 'unsafe-inline' data:" +
	"; style-src 'self' 'unsafe-inline'" +
	"; object-src	'none'" +
	"; form-action 'none'" +
	"; frame-ancestors 'none'" +
	"; block-all-mixed-content" +
	"; base-uri 'self'"

// CSPHandler enables CSP
func CSPHandler(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy", ContentSecurityPolicy)
		handler.ServeHTTP(w, r)
	})
}

func main() {
	flag.StringVar(&path, "path", "-1", "contents path")
	flag.StringVar(&port, "port", "-1", "server port")
	flag.Parse()

	if path != "-1" && port != "-1" {
		handler := http.FileServer(http.Dir(path))
		s := &http.Server{
			Addr:         walletHost + ":" + port,
			Handler:      CSPHandler(handler),
			ReadTimeout:  serverReadTimeout,
			WriteTimeout: serverWriteTimeout,
			IdleTimeout:  serverIdleTimeout,
		}

		if err := s.ListenAndServe(); err != nil {
			panic(err)
		}
	}
}
