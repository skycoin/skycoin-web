#!/bin/bash

set -e -o pipefail

echo "start to build wallets..."

# build gui dist
echo "build dist..."
make build

pushd "electron" >/dev/null
if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then ./build-electron-release.sh "linux/amd64"; fi
if [[ "$TRAVIS_OS_NAME" == "osx" ]]; then ./build-electron-release.sh "darwin/amd64"; fi
ls release/
popd >/dev/null
