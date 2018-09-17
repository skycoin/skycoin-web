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

func main() {
	flag.StringVar(&path, "path", "-1", "contents path")
	flag.StringVar(&port, "port", "-1", "server port")
	flag.Parse()

	if path != "-1" && port != "-1" {
		handler := http.FileServer(http.Dir(path))
		s := &http.Server{
			Addr:         walletHost + ":" + port,
			Handler:      handler,
			ReadTimeout:  serverReadTimeout,
			WriteTimeout: serverWriteTimeout,
			IdleTimeout:  serverIdleTimeout,
		}

		if err := s.ListenAndServe(); err != nil {
			panic(err)
		}
	}
}
