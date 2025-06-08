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

## 🚀 Como rodar o projeto localmente:

### Pré-requisitos:

- ✅ **Node.js v22.16.0**
- ✅ Gerenciador de pacotes: npm
- ✅ Banco de dados: PostgreSQL (já instanciado)

### 📦 Passo a passo:

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

A aplicação contém usuário e senha padrão que estão disponibilizadas na documentação do swagger. Caso queira um banco de dados vazio, troque em .env "DATABASE_URL" o link do seu banco de dados ou digite no terminal o seguinte comando, que limpará o banco de dados:

```bash
npx prisma migrate reset
```

4. **Rode o projeto**

```bash
npm run start:dev
```

A aplicação estará disponível em: ➡️ http://localhost:3001/api

---

## 📚 Documentação da API (Swagger)

A documentação completa está disponível em: ➡️ http://localhost:3001/api/docs

Lá você consegue:

- Visualizar todas as rotas do app, usar os parâmetros e visualizar os exemplos;
- Testar requisições diretamente pela "interface";
- Analisar os DTOs de entrada e saída usados na aplicação.

---

## 🐳 Para subir aplicação no Docker:

A aplicação está pronta para ser executada com o docker-compose.yaml que foi configurado para criar um backend NestJS e outro para o banco de dados PostgreSQL.

✅ Pré-requisitos:

- Docker e Docker Compose instalados
- Arquivo .env criado a partir do .env.example

```bash
cp .env.example .env
```

### 🚀 Subindo o ambiente

Execute o seguinte comando na raiz do projeto:

```bash
docker-compose up --build
```

Isso irá:

- Construir a imagem da aplicação com Node.js
- Instanciar o banco de dados PostgreSQL com as credenciais do docker-compose.yml
- Aplicar automaticamente as migrations com Prisma
- Iniciar o servidor na porta 3001

A API estará acessível em: ➡️ http://localhost:3001/api
A documentação Swagger: ➡️ http://localhost:3001/api/docs
**O banco estará vazio.**

---

### 🧪 Testes com Insomnia/Postman

- O conjunto de rotas/coleções esta disponível **[aqui]**(https://drive.google.com/file/d/1mca1O-RTueRFAM-RVkmNc3sgMDGXWsJ9/view).

## 📌 Melhorias e Próximos passos:

### 📌 Regras de negócio:

- Permitir reativar URLs deletadas se o slug for reutilizado;
- Histórico de edições com melhor visualização para o usuário;
- Melhorr GET/urls com filtros;
- Busca textual por domínios;

### 💡 System Desing:

- Fila de tarefas: implementação de mensageria assíncrona para desacoplar processos (ex: RabbitMQ);
- Cache com Redis: melhorar a performance de leitura com cache de consultas e tokens;
- Design de dados e APIs: revisar e refinar a modelagem das interfaces e DTOs;
- Tolerância a falhas: implementar retries automáticos e circuit breakers;
- Segurança: reforçar a proteção contra ataques (rate limit e validações profundas);
- Monitoramento e observabilidade: integração com logs e métricas;
- Orquestração e deploy: adotar pipelines de CI/CD com versionamento controlado e deploy contínuo;
- Versionamento de API e serviços: aplicar versionamento eficiente para evitar breaking changes em ambientes produtivos.

### 📁 Estrutura principal do projeto:

```pgsql
src/
├── auth/            → Login, JWT, estratégias e guards
├── user/            → CRUD de usuários
├── url/             → CRUD de URLs, redirecionamento e histórico
├── prisma/          → Schema e acesso ao banco
├── swagger/         → Configuração da documentação
└── main.ts          → Entrypoint da aplicação
```
