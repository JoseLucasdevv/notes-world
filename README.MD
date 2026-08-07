# Notes World

Aplicação de notas no estilo Notion: o usuário cria sua conta, escreve cards com título, descrição
e cor, e organiza tudo em um painel paginado.

Projeto full-stack em TypeScript, dividido em duas aplicações independentes:

| Pasta | O que é | Stack |
| --- | --- | --- |
| [`back-end/`](back-end) | API REST com autenticação e CRUD de notas | Node.js, Express, TypeScript, MongoDB, JWT, Jest |
| [`web/`](web) | Interface web do usuário | React 18, Vite, TypeScript, Tailwind CSS |

📮 **[Documentação da API no Postman](https://documenter.getpostman.com/view/29716630/2sAXqv6MKz)**

---

## Decisões técnicas

**A API é organizada em camadas.** Cada recurso passa por `routes → controllers → services →
entity`, com `contracts` definindo as interfaces entre elas. Controller cuida de HTTP, service
cuida de regra de negócio. Isso é o que permite testar as regras com Jest sem subir servidor.

**Autenticação com JWT em middleware.** `ensureAuthenticated` protege as rotas privadas e
`GenerateTokenProvider` isola a emissão do token — trocar a estratégia de assinatura mexe em um
arquivo só. No front, o token é guardado em cookie e injetado pelo cliente Axios.

**Validação nas duas pontas.** O formulário usa React Hook Form com Zod, e a API revalida antes de
persistir, porque validação de cliente é experiência do usuário, não segurança.

**CI desde o começo.** O workflow [`backend.yml`](.github/workflows/backend.yml) roda lint, build e
testes a cada push em `main` e em PRs, com cache de dependências.

## Regras de negócio

- E-mail único e válido; senha com no mínimo 8 caracteres.
- Título da nota entre 3 e 100 caracteres.
- Descrição entre 10 e 2500 caracteres.
- Cor precisa ser um hexadecimal válido.

## Endpoints principais

| Método | Rota | O que faz |
| --- | --- | --- |
| `POST` | `/register` | Cria a conta |
| `POST` | `/login` | Autentica e devolve o token |
| `GET` | `/user` | Dados do usuário autenticado |
| `GET` | `/post?page=1` | Lista as notas com paginação |
| `GET` | `/post/{id}` | Detalha uma nota |
| `GET` | `/post/title?title=Titulo` | Busca por título |
| `GET` | `/welcome` | Health check |

## Rodando localmente

### API

```bash
cd back-end
npm install
docker compose up -d      # MongoDB
npm start                 # ts-node-dev com reload
npm test                  # Jest
```

Crie um `.env` em `back-end/`:

```env
DB_NAME=
DB_USERNAME=
CONNECTION_URL_LOCAL=
PORT_APP=
PRIVATE_KEY_JWT=
```

### Web

```bash
cd web
npm install
npm run dev
```

Crie um `.env` em `web/`:

```env
VITE_API_SERVER_BACKEND='http://localhost:3000'   # URL da API
VITE_UNSPLASH_ACCESS_KEY=""                       # imagens do banner: unsplash.com/oauth/applications
VITE_API_OPENWATHER_KEY=""                        # clima do banner: home.openweathermap.org
```

## Estrutura

```
back-end/src/
├── routes/        # definição das rotas
├── controllers/   # entrada HTTP (Auth, Post, User)
├── services/      # regras de negócio
├── contracts/     # interfaces entre as camadas
├── entity/        # modelos Post e User
├── providers/     # geração de token
├── middlewares/   # ensureAuthenticated
├── database/      # conexão MongoDB
└── test/          # testes Jest

web/src/
├── pages/         # Home, Onboarding, login, register, Dashboard
├── components/    # header, footer, modal, paginação, perfil, inputs
├── context/       # sessão do usuário
├── layouts/
└── lib/           # cliente Axios
```

## Contribuindo

Commits seguem [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

## Licença

MIT.
