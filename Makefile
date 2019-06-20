.DEFAULT_GOAL := help
.PHONY: lint check help

build:
	npm run build

build-for-electron: ## compiles a version to be used with Electron
	npm run build-for-local-fs

build-for-local-fs: ## compiles a version to be used from the local file system
	npm run build-for-local-fs

lint: ## runs lint
	npm run lint

unit-test: ## runs unit tests
	npm run test

cipher-test:
	npm run cipher-test

cipher-test-extensive:
	npm run cipher-test-extensive

run-docker: ## runs docker container
	docker volume create skycoin-data
	docker volume create skycoin-wallet
	chmod 777 $(PWD)/e2e/test-fixtures/blockchain-180.db
	
	docker run -d --rm \
	-v skycoin-data:/data \
	-v skycoin-wallet:/wallet \
	-v $(PWD)/e2e/:/project-root \
	--name skycoin-backend \
	-p 6000:6000 \
	-p 6420:6420 \
	skycoin/skycoin:develop \
	-web-interface-addr 172.17.0.2 \
	-db-path=project-root/test-fixtures/blockchain-180.db \
	-disable-networking \
	-disable-csrf

stop-docker: ## stops docker container
	docker stop skycoin-backend

e2e-test: ## runs e2e tests using a node running in Docker
	npm run e2e-docker

e2e-prod-test: ## runs e2e prod tests using a node running in Docker
	npm run e2e-docker-prod

check: run-docker lint unit-test cipher-test e2e-test e2e-prod-test stop-docker ## runs linter, unit tests, e2e tests

prepare-electron-requirements: ## Creates the necessary files to be able to package the wallet with Electron
	cd electron; ./build-server.sh

build-electron-win: ## creates an Electron wallet for Windows, from the contents of the dist folder
	cd electron; npm run dist-win

build-electron-linux: ## creates an Electron wallet for Linux, from the contents of the dist folder
	cd electron; npm run dist-linux

build-electron-mac: ## creates an Electron wallet for Mac, from the contents of the dist folder
	cd electron; npm run dist-mac

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
