# Skycoin web client

The Skycoin web client provides a lite browser wallet, which can be ran from the browser, using a full node exposing selected back-end functions.

## Prerequisites

The Skycoin web interface requires Node 6.9.0 or higher, together with NPM 3 or higher.

## Installation

This project is generated using Angular CLI, therefore it is adviced to first run `npm install -g @angular/cli`.

Dependencies are managed with Yarn, to install yarn run `npm install -g yarn`.

To install all Angular, Angular CLI and all other libraries, you will then have to run `yarn`.

You will only have to run this again, if any dependencies have been changed in the `package.json` file.

## Compiling new target files

To compile new target files, you will have to run: `npm run build`

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. 

## Back-end

As this is a lite client, it requires a back-end to retrieve the blockchain state and inject new transactions. For this
purpose a full node has been set up at `http://128.199.57.221`. At the moment this requires a mapping API, but in the
future any node can do this.
