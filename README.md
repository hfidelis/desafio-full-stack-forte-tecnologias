# Desafio Full-Stack | Forte Tecnologias

## Tecnologias Utilizadas

### Backend:
- Nest.js
- Prisma
- class-validator e class-transformer
- JWT
- Swagger (OpenAPI)
- PostgreSQL

### Frontend:
- Angular 20
- Angular Material
- ngx-mask

### Funcionalidades
- Autenticação via JWT
- Testes automatizados dos services no backend
- Criação e remoção de Usuários (apenas para administradores)
- CRUD de Empresas
- CRUD de Funcionários
- CRUD de Ativos
- Associação e Desassociação de Ativos a Funcionários
- Regra de negócio para associar apenas 1 notebook por funcionário
- Validações de dados no backend e frontend
- Documentação da API via Swagger (OpenAPI)
- Seed inicial do banco de dados com um usuário administrador e status e tipos de ativos
- Tratamento de erros e mensagens amigáveis no frontend

### Como executar o projeto
1. Clone o repositório:
   ```bash
   git clone https://github.com/hfidelis/desafio-full-stack-forte-tecnologias
   cd desafio-full-stack-forte-tecnologias
    ```

2. As variáveis de ambiente estão definidas e comitadas apenas por questões de praticidade para o teste e avaliação. No diretório raíz temos uma arquivo `.env` com as variáveis do banco de dados e no diretório do backend temos um arquivo `.env` com as variáveis JWT, string do banco e dados do super usuário.

```bash
# .env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=forte_assets
POSTGRES_PORT=5432

# backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/forte_assets?schema=public"
JWT_SECRET="0f7ddfb27f1b08a28ebf58a25cfe3f3a"
JWT_EXPIRES_IN="3600s"
PORT=3000
ADMIN_EMAIL="admin@forte.com"
ADMIN_PASSWORD="forteadmin"
```

3. Inicie o banco de dados utilizando docker-compose:
    ```bash
    docker-compose up -d
    ```

4. Inicialize o backend (Dependências, migrações, seed, testes e start):
    ```bash
    cd backend

    npm install

    npx prisma migrate deploy

    npx prisma db seed

    npm run test

    npm run start:dev
    ```

**Agora o backend estará rodando em** `http://localhost:3000` **e a documentação da API via Swagger (OpenAPI) estará disponível em** `http://localhost:3000/api/docs`.

**O usuário administrador inicial é:**
- Email: `admin@forte.com`
- Senha: `forteadmin`

5. Inicialize o frontend (Dependências e start):
    ```bash
    cd ../frontend

    npm install

    npm run start
    ```

**Agora o frontend estará rodando em** `http://localhost:4200`.

### Screenshots:

![1](./docs/1.png)

![2](./docs/2.png)

![3](./docs/3.png)

![4](./docs/4.png)

![5](./docs/5.png)

![6](./docs/6.png)

![7](./docs/7.png)

![8](./docs/8.png)

![9](./docs/9.png)
