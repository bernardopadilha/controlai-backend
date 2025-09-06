# 🔴 Gestão de Custos Domésticos - Back-end

Este é o back-end da aplicação **Gestão de Custos Domésticos**, desenvolvido em **Nest.js + Prisma + PostgreSQL**.
---

## 📂 Estrutura do Projeto

- **Nest.js**
- **Prisma ORM** → Modelagem e manipulação do banco de dados.
- **PostgreSQL** → Banco de dados utilizado.
- **Render** → Hospedagem da API em produção.

## ⚙️ Decisões Técnicas

- Nest.js → escolha por ser modular e por possuir boas práticas de arquitetura.
- Prisma ORM → escolha pela facilidade de modelar e migrar o banco de dados.
- Banco PostgreSQL → escolha por maior familiaridade.

## 🚀 Deploy
- Front-end: Vercel **https://controlai-frontend.vercel.app/sign-in**
- Back-end: Render **https://controlai-backend.onrender.com**

## 🎥 Vídeo de demonstração
- **https://www.youtube.com/watch?v=666BvUJS5Rc**

## 📚 Documentação
- **https://controlai-backend.onrender.com/docs**

---

## ▶️ Como executar localmente

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio-front>
```

## ▶️ Variáveis de Ambiente
- 🚨 Lembre de completar o env com variáveis enviadas no whatsApp
```bash
# Crie um .env
# Lembre de completar o env com variáveis enviadas no whatsApp
PORT=3333
DATABASE_URL=""
NODE_ENV=development
JWT_SECRET=
```

## ▶️ Docker compose

```bash
docker-compose up
```
