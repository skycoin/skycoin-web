#!/bin/bash

set -e -o pipefail


if [[ -n "$1" ]]; then
  OSARCH="$@"
else
  OSARCH="linux/amd64 windows/amd64 darwin/amd64"
fi

# Get build version from package.json
APP_VERSION=`grep version package.json | sed 's/[,\", ]//g' | awk '{split($0,a,":");print a[2]}'`

# package name
PKG_NAME=`grep name package.json | sed 's/[,\", ]//g' | awk '{split($0,s,":");print s[2]}'`

# product name
PDT_NAME=`grep productName package.json | awk '{split($0,s,":");print s[2]}' | sed 's/^[ \t]*//;s/[,\"]//g'`
PDT_NAME_LOWER=`grep productName package.json | awk '{split($0,s,":");print s[2]}' | sed 's/^[ \t]*//;s/[,\"]//g' | awk '{print tolower}'`


if [[ "$OSARCH" == *"darwin/amd64"* ]]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    ./build-server.sh "darwin/amd64"
    npm run dist-mac
  else
    echo "Can not run build script in $OSTYPE"
  fi
fi

if [[ "$OSARCH" == *"windows"* ]]; then
  if [[ "$OSARCH" == *"windows/amd64"* ]]; then
    ./build-server.sh "windows/amd64"
    npm run dist-win64
  elif [[ "$OSARCH" == *"windows/386"* ]]; then
    ./build-server.sh "windows/386"
    npm run dist-win32
  else
    ./build-server.sh "windows/amd64 windows/386"
    npm run dist-win
  fi
fi

if [[ "$OSARCH" == *"linux/amd64"* ]]; then
  ./build-server.sh "linux/amd64"
  npm run dist-linux
fi

pushd "release" >/dev/null

# rename linux AppImage file
IMG="${PKG_NAME}-${APP_VERSION}-x86_64.AppImage"
DEST_IMG="${PKG_NAME}-${APP_VERSION}-gui-electron-linux-x64.AppImage"
if [[ -e "$IMG" ]]; then
  mv "$IMG" "$DEST_IMG"
  chmod +x "$DEST_IMG"
fi

# rename windows setup file
EXE="${PDT_NAME} Setup ${APP_VERSION}.exe"
if [[ -e "$EXE" ]]; then
  mv "$EXE" "${PKG_NAME}-${APP_VERSION}-gui-electron-win-setup.exe"
fi

# rename dmg file
DMG="${PDT_NAME_LOWER}-${APP_VERSION}.dmg"
if [[ -e "$DMG" ]]; then
  mv "$DMG" "${PKG_NAME}-${APP_VERSION}-gui-electron-osx.dmg"
fi

# delete mac folder
if [[ -d "mac" ]]; then
  rm -rf mac
fi

SNAP="${PKG_NAME}_${APP_VERSION}_amd64.snap"
if [[ -e "$SNAP" ]]; then
  rm -f "$SNAP"
fi

# delete app zip file
MZIP="${PDT_NAME_LOWER}-${APP_VERSION}-mac.zip"
if [[ -e "$MZIP" ]]; then
  rm "$MZIP"
fi

# clean unpacked folders
rm -rf *-unpacked

# delete blockmap and electron-builder.yaml
rm -f *.blockmap
rm -f *.yaml

popd >/dev/null
