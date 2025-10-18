package main

import (
	"embed"
	
	"github.com/0pcom/skycoin-web/cmd"
)

//go:embed all:dist
var distFS embed.FS

func main() {
	cmd.SetDistFS(distFS)
	cmd.Execute()
}
