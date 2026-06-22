# 🎨 Farol das Artes

<p align="center">
  <img alt="Disciplina" src="https://img.shields.io/badge/SCC0219-Introdu%C3%A7%C3%A3o%20ao%20Desenvolvimento%20Web-blue?style=for-the-badge">
  <img alt="Instituição" src="https://img.shields.io/badge/USP-Universidade%20de%20S%C3%A3o%20Paulo-orange?style=for-the-badge">
</p>

> 📚 **Disciplina:** SCC0219 - Introdução ao Desenvolvimento Web <br>
> 👩‍🏫 **Professora:** Bruna Carolina Rodrigues da Cunha <br>
> 🏛️ **Instituição:** USP - Universidade de São Paulo

---

## 🔎 Sobre o Projeto

O **Farol das Artes** é uma aplicação web desenvolvida como requisito avaliativo da disciplina.

## 🎓 Autores

- **Pedro Henrique de Sousa Prestes** – 15507819
- **Laura Pazini Medeiros** – 15468452
- **Pedro Henrique Perez Dias** – 15484075

## 🛠️ Tecnologias Utilizadas

Este projeto está sendo construído utilizando as seguintes ferramentas principais:

- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
- ![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
- ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
- ![MinIO](https://img.shields.io/badge/MinIO-%23C72E49.svg?style=for-the-badge&logo=minio&logoColor=white)
- ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## 📁 Estrutura do Repositório

- `/frontend`: Contém a aplicação de interface de usuário (React + Vite).
- `/backend`: Contém a API REST desenvolvida em Go utilizando Gin e GORM.

## 🚀 Como Executar

Siga os passos abaixo para rodar o projeto localmente. Para facilitar, incluímos um `Makefile` na raiz do projeto com todos os comandos necessários.

### ⚡ Utilizando o Makefile

Na raiz do projeto, você pode visualizar todos os comandos disponíveis apenas digitando:
```bash
make
```

Para preparar e rodar o projeto do zero, execute os comandos em terminais separados:

**1. Instale as dependências (Frontend e Backend):**
```bash
make setup
```

**2. Suba o Banco de Dados e Armazenamento (PostgreSQL, pgAdmin e MinIO via Docker):**
```bash
make db
```
> O banco de dados estará acessível na porta `5432`, o painel pgAdmin em `http://localhost:5050` (Credenciais: `admin@admin.com` / `admin`) e o Console do MinIO em `http://localhost:9001` (Credenciais: `minioadmin` / `minioadminpassword`).

**3. Inicie a API (Backend Go):**
```bash
make backend
```

**4. Inicie a Interface (Frontend React/Vite):**
```bash
make frontend
```

### 🧹 Utilitários
Para parar o banco de dados, rode:
```bash
make stop-db
```
Para limpar o ambiente (remover dependências do Node e containers do BD):
```bash
make clean
```

---
