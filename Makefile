.DEFAULT_GOAL := help
.PHONY: lint check help

lint: ## runs lint
	npm run lint

unit_test: ## runs unit tests
	npm run test

e2e_test: ## runs e2e tests
	npm run e2e

check: lint unit_test e2e_test ## runs linter, unit tests and e2e tests

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
