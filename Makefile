# Define paths for SSL files
SSL_DIR := ./ssl
KEY_FILE := $(SSL_DIR)/localhost.key
CRT_FILE := $(SSL_DIR)/localhost.crt

# Default target
all: ssl install env

# Generate SSL certificates
ssl:
	@echo "Generating SSL certificates..."
	mkdir -p $(SSL_DIR)
	openssl req -x509 -newkey rsa:4096 -nodes -out $(CRT_FILE) -keyout $(KEY_FILE) -days 365 -subj "/CN=localhost"
	@echo "SSL certificates generated."

# Install dependencies
install:
	@echo "Installing dependencies..."
	npm install
	@echo "Dependencies installed."

# Configure environment
env:
	@echo "Configuring environment..."
	@if [ ! -f .env ]; then \
		echo "Creating .env file..."; \
		echo "VITE_APP_ENV=development" > .env; \
	fi
	@echo "Environment configured."

# Clean SSL files
clean:
	@echo "Cleaning SSL files..."
	rm -rf $(SSL_DIR)
	@echo "SSL files cleaned."

# Help target
help:
	@echo "Available targets:"
	@echo "  all      - Run all tasks (default)"
	@echo "  ssl      - Generate SSL certificates"
	@echo "  install  - Install dependencies"
	@echo "  env      - Configure environment"
	@echo "  clean    - Remove SSL files"
