.PHONY: all db stop-db backend frontend setup clean help

# Cores para o terminal
CYAN := \033[36m
RESET := \033[0m

# Target padrão: exibe a ajuda
help:
	@echo "Comandos disponíveis no projeto Farol das Artes:"
	@echo "  $(CYAN)make db$(RESET)       - Sobe o banco de dados (Postgres) e o pgAdmin via Docker Compose"
	@echo "  $(CYAN)make stop-db$(RESET)  - Derruba os containers do banco de dados"
	@echo "  $(CYAN)make backend$(RESET)  - Inicia o servidor backend em Go (modo de desenvolvimento)"
	@echo "  $(CYAN)make frontend$(RESET) - Inicia o frontend React/Vite"
	@echo "  $(CYAN)make setup$(RESET)    - Instala todas as dependências do projeto (Go e NPM)"
	@echo "  $(CYAN)make clean$(RESET)    - Remove os containers e limpa o node_modules"

db:
	docker compose up -d --build --force-recreate --remove-orphans

stop-db:
	docker compose down

backend:
	cd backend && go run main.go

frontend:
	cd frontend && npm run dev

setup:
	cd backend && go mod tidy
	cd frontend && npm install

clean: stop-db
	cd frontend && rm -rf node_modules package-lock.json
	@echo "Limpeza concluída."