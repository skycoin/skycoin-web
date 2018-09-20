#!/bin/bash

echo "Compiling for win_ia32"
env GOOS=windows GOARCH=386 go build -o ./server/win_ia32/server.exe
echo "Compiling for win_x64"
env GOOS=windows GOARCH=amd64 go build -o ./server/win_x64/server.exe
echo "Compiling for linux_x64"
env GOOS=linux GOARCH=amd64 go build -o ./server/linux_x64/server
echo "Compiling for mac_x64"
env GOOS=darwin GOARCH=amd64 go build -o ./server/mac_x64/server
