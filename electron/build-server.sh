#!/bin/bash

if [[ -n "$1" ]]; then
  OSARCH="$@"
else
  OSARCH="linux/amd64 windows/amd64 windows/386 darwin/amd64"
fi

if [[ "$OSARCH" == *"windows/386"* ]]; then
  echo "Compiling for win_ia32"
  env GOOS=windows GOARCH=386 go build -o ./server/win_ia32/server.exe
fi

if [[ "$OSARCH" == *"windows/amd64"* ]]; then
  echo "Compiling for win_x64"
  env GOOS=windows GOARCH=amd64 go build -o ./server/win_x64/server.exe
fi

if [[ "$OSARCH" == *"linux/amd64"* ]]; then
  echo "Compiling for linux_x64"
  env GOOS=linux GOARCH=amd64 go build -o ./server/linux_x64/server
fi

if [[ "$OSARCH" == *"darwin/amd64"* ]]; then
  echo "Compiling for mac_x64"
  env GOOS=darwin GOARCH=amd64 go build -o ./server/mac_x64/server
fi
