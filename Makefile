.PHONY: help build up down restart logs ps clean migrate seed

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## View logs from all services
	docker-compose logs -f

logs-app: ## View logs from app service only
	docker-compose logs -f app

ps: ## List running containers
	docker-compose ps

clean: ## Stop and remove all containers, networks, and volumes
	docker-compose down -v

migrate: ## Run database migrations
	npm run migration:run

migrate-generate: ## Generate a new migration
	@read -p "Enter migration name: " name; \
	npm run migration:generate -- src/infrastructures/database/migrations/$$name

migrate-create: ## Create a blank migration
	@read -p "Enter migration name: " name; \
	npm run migration:create -- src/infrastructures/database/migrations/$$name

migrate-revert: ## Revert the last migration
	npm run migration:revert

schema-drop: ## Drop schema database
	npm run schema:drop

dev: ## Start development server locally
	npm run start:dev

install: ## Install dependencies
	npm install

lint: ## Run linter
	npm run lint

format: ## Format code
	npm run format
