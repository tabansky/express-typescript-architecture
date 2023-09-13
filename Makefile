SHELL := /bin/bash
#-- Docker
up: ## Up the container images
	docker-compose up -d

down: ## Down the container images
	docker-compose down -v

# clean: ## Clean the images
# 	docker rmi -f ${APP_NAME}

# remove: ## Remove the volumes
# 	docker volume rm -f ${APP_NAME}

#-- Database
db: ## Start the local database MariaDB
	docker-compose up -d mariadb
