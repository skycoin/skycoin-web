# Skycoin Web Wallet - Go Edition

A modernized, self-contained web wallet for Skycoin with embedded GUI.

## Features

- Single binary with embedded web interface  
- Built with Go 1.25+ and Angular 12
- No external dependencies - everything embedded
- Cross-platform support (Linux, macOS, Windows)
- Simple CLI built with Cobra

## Quick Start

```bash
# Run the wallet server
./skycoin-web

# Or specify custom host/port
./skycoin-web --host 0.0.0.0 --port 8080

# View help
./skycoin-web --help
```

## Building from Source

### Prerequisites
- Node.js 16+ and npm
- Go 1.25+

### Build Steps

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Build the web interface
npm run build

# 3. Build the Go binary
go build -o skycoin-web .

# 4. Run it!
./skycoin-web
```

## CLI Commands

- `skycoin-web` - Start the web server (default)
- `skycoin-web serve` - Explicitly start the server
- `skycoin-web version` - Show version information
- `skycoin-web --help` - Show all available options

## Development

### Frontend Development
```bash
npm start  # Runs dev server on http://localhost:4200
```

### Backend Development  
```bash
go run . --port 8001
```

## Recent Modernization

This wallet has been upgraded from Angular 5 → Angular 12:

- ✅ Updated all dependencies and fixed 200+ vulnerabilities
- ✅ Migrated to modern Angular Material imports
- ✅ Added webpack 5 polyfills for crypto libraries
- ✅ Replaced node-sass with dart-sass
- ✅ Fixed all TypeScript compilation errors
- ✅ Created single-binary distribution with Go

## License

MIT

## Contributing

Contributions welcome! This is a fork maintained at github.com/0pcom/skycoin-web

Original project: github.com/skycoin/skycoin-web
