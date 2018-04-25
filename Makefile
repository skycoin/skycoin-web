.DEFAULT_GOAL := help
.PHONY: lint check help

lint: ## runs lint
	npm run lint

test: ## runs unit tests
	npm run test

check: lint test ## runs linter and unit tests

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
