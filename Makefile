.DEFAULT_GOAL := help
.PHONY: lint check help

build:
	npm run build

lint: ## runs lint
	npm run lint

unit-test: ## runs unit tests
	npm run test

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
	-disable-networking

stop-docker: ## stops docker container
	docker stop skycoin-backend

e2e-test: ## runs e2e tests
	npm run e2e-docker

check: run-docker lint unit-test e2e-test stop-docker ## runs linter, unit tests, e2e tests

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
