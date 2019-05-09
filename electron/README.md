# Build system

The wallet can be compiled as an Electron (http://electron.atom.io/) app. By doing so it works as a light wallet
compatible with osx, linux and windows.

## Requirements

A recent version of Go (golang) and NPM 3 or higher. The installation of Go and NPM depends on the operating system.

### Go installation

You can find more information at [Golang 1.10+ Installation/Setup](https://github.com/skycoin/skycoin/blob/develop/INSTALLATION.md)

### NPM installation

Node and npm installation is system dependent.

#### Linux

```sh
sudo apt-get install npm
sudo apt-get install nodejs-legacy
sudo npm cache clean -f

sudo npm install -g n
sudo n stable

node -v
npm -v
```

## Prerequisites

### Node dependencies

To install the Node dependencies and be able to start the compilation process, you must run `npm install` on the
`./electron` and `./electron/src` folders of this repository.

### Aditional dependencies

Before building the application, the `dist` folder must be updated. To update it you can run, from the root of the repository,
the following command:

```sh
make build-for-electron
```

Additionally, it is necessary to compile the content server first. You can do it by running, from the `./electron` folder, the
following command:

```sh
build-server.sh
```

After that, a folder called `server` will be created and it will be possible to build the Electron wallet.

## Building

You can build the application for each one of the compatible operating system by running, from the root directory of this
repository, the following commands: `make build-electron-win`, `build-electron-linux` and `build-electron-mac`.

Final results are placed in the `release/` folder.

## Compiling on Mac

Use brew to install required packages.

To build app for Windows on macOS:

```sh
brew install wine --without-x11
brew install mono
```

To build app for Linux on macOS:

```sh
brew install gnu-tar graphicsmagick xz
```

### Code signing

Set the `CSC_IDENTITY_AUTO_DISCOVERY` environment variable to false if you don't want to do code signing,
otherwise, you can create a certificate in login.keychain for testing purpose.

Create new certificate:

> Keychain Access -> Certificate Assistant -> Create a Certificate...

Set certificate name and select `Code Signing` as `Certificate Type`.

Once you generated the certificate, you can use it by setting your environment variable:

```sh
export CSC_NAME="Certificate Name"
```

Now, when you run electron-builder, it will choose the name and sign the app with the certificate.

## Compiling on Linux

To build app in distributable format for Linux:

```sh
sudo apt-get install --no-install-recommends -y icnsutils graphicsmagick xz-utils
```

To build app for Windows on Linux:

* Install Wine (1.8+ is required):

```sh
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:ubuntu-wine/ppa -y
sudo apt-get update
sudo apt-get install --no-install-recommends -y wine1.8
```

* Install Mono (4.2+ is required):

```sh
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
echo "deb http://download.mono-project.com/repo/debian wheezy main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list
sudo apt-get update
sudo apt-get install --no-install-recommends -y mono-devel ca-certificates-mono
```

To build app in 32 bit from a machine with 64 bit:

```sh
sudo apt-get install --no-install-recommends -y gcc-multilib g++-multilib
```
