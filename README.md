# 🔗 Encurtador de URLs — Teddy Open Finance

[![Node Version](https://img.shields.io/badge/node-18.17.1-green.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](#)

Encurtador de URLs em **NestJS** e **PostgreSQL**, projetado para funcionar tanto com **usuários autenticados** quanto **não autenticados**. A aplicação é capaz de:

- Criar URLs curtas com ou sem autenticação;
- Garante a rastreabilidade de URLs apagadas ou editadas (através do `previous_url_id`);
- Rastrea a quantidade de acessos (`accesses_qty`);
- Controlar URLs ativas, inativas e deletadas (com soft delete).

---

## 📚 Documentação da API (Swagger)

A documentação completa está disponível em: http://localhost:3001/api/docs

Lá você consegue:

- Visualizar todas as rotas do app, usar os parâmetros e visualizar os exemplos;
- Testar requisições diretamente pela "interface";
- Analisar os DTOs de entrada e saída usados na aplicação.

---

## 🚀 Como rodar o projeto localmente

### ✅ Pré-requisitos

- **Node.js v18.17.1** (exatamente esta versão)
- npm
- Banco PostgreSQL **já instanciado**
- ***

### 📦 Passo a passo

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd teddy-open-finance
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o .env**
   As variáveis de ambiente estão no arquivo .env.example.

```bash
cp .env.example .env
```

O banco de dados contém um usuário padrão "joão@teddy360.com.br" com uma senha padrão, disponibilizada na documentação do swagger. Caso queira um banco de dados vazio, troque em .env "DATABASE_URL" o link do seu banco de dados ou siga os seguintes comandos:

```bash
cd src
npx prisma migrate reset
```

Esse comando limpará o banco de dados.

4. **Rode o projeto**

```bash
npm run start:dev
```

A aplicação estará disponível em http://localhost:3001/api

🧪 Testes com Insomnia/Postman
O conjunto de rotas/coleções esta disponível **aqui**.

Melhorias sugeridas e pensadas ao longo do processo:
📌 Regras de negócio:

- Permitir reativar URLs deletadas se o slug for reutilizado
- Histórico de edições com melhor visualização para o usuário

🔍 Filtros e buscas:
Melhorr GET /urls com filtros:

- URLs ativas/inativas;
- Busca textual domínio;

💡 Arquitetura e código

- Melhorar tipagem das Promise<DTO> em todos os serviços
- Unificar retornos com class-transformer -> @Exclude/@Expose
- Aplicar DTOs também para respostas públicas (não só privadas)

🔒 Segurança

- Adicionar rate-limit por IP
- Integração opcional com captcha para usuários não autenticados

📁 Estrutura principal do projeto:

```pgsql
src/
├── auth/            → Login, JWT, estratégias e guards
├── user/            → CRUD de usuários
├── url/             → CRUD de URLs, redirecionamento e histórico
├── prisma/          → Schema e acesso ao banco
├── swagger/         → Configuração da documentação
└── main.ts          → Entrypoint da aplicação
```
