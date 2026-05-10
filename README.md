# CourseSphere 🎓

Aplicação web de gestão de cursos online colaborativa, desenvolvida com **Ruby on Rails** (API) no backend e **React + Vite** no frontend.

---

## Funcionalidades

- Registro e login de usuários com autenticação JWT
- CRUD completo de cursos e aulas
- Apenas o criador pode editar ou excluir seus cursos e aulas
- Todos os usuários autenticados podem visualizar todos os cursos
- Aulas em rascunho só aparecem para o criador do curso
- Busca de cursos por nome
- Filtro de aulas por status (draft/published)
- Consumo da [RandomUser API](https://randomuser.me) para exibir instrutor convidado e turma fictícia
- Banners e miniaturas automáticas via [Picsum Photos](https://picsum.photos)
- Descrição dos cursos com suporte a Markdown
- Dark mode / Light mode
- Layout responsivo

---

## Tecnologias

**Backend**
- Ruby 3.2.2
- Rails 8.1.3 (API mode)
- PostgreSQL
- JWT para autenticação
- bcrypt para hash de senha
- rack-cors para CORS

**Frontend**
- React 18 + Vite
- React Router DOM
- Axios
- React Markdown
- CSS customizado com variáveis (sem framework externo)

---

## Pré-requisitos

- Ruby 3.2.2
- Rails 8.1.3
- PostgreSQL
- Node.js 20+
- npm

---

## Rodando o Backend

```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails s -p 3001
```

A API estará disponível em `http://localhost:3001/api/v1`

---

## Rodando o Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

---

## Usuários de Teste

Após rodar o `rails db:seed`:

| Campo | Valor |
|-------|-------|
| Email | teste@coursesphere.com |
| Senha | senha123 |

Você também pode criar novos usuários pela tela de registro em `/register`.

---

## Autenticação

A API utiliza JWT. Após login ou registro, o token é retornado no corpo da resposta e armazenado no `localStorage` do frontend. Todas as requisições autenticadas enviam o token no header:

```
Authorization: Bearer <token>
```

---

## Estrutura do Projeto

```
projeto v-lab/
├── backend/                  # Rails API
│   ├── app/
│   │   ├── controllers/
│   │   │   └── api/v1/       # AuthController, CoursesController, LessonsController
│   │   ├── models/           # User, Course, Lesson
│   │   └── services/         # JsonWebToken
│   ├── config/
│   │   ├── routes.rb
│   │   └── initializers/cors.rb
│   └── db/
│       ├── migrate/
│       └── seeds.rb
│
└── frontend/                 # React + Vite
    └── src/
        ├── api/              # cliente axios
        ├── assets/           # logo SVG
        ├── components/       # ProtectedRoute, ThemeToggle
        ├── contexts/         # AuthContext
        └── pages/            # Landing, Login, Register, Dashboard, CourseDetail, CourseForm
```

---

## Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/v1/register` | Criar usuário |
| POST | `/api/v1/login` | Login |
| GET | `/api/v1/me` | Usuário autenticado |

### Cursos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/courses` | Listar todos os cursos |
| GET | `/api/v1/courses/:id` | Detalhes do curso |
| POST | `/api/v1/courses` | Criar curso |
| PUT | `/api/v1/courses/:id` | Editar curso (apenas criador) |
| DELETE | `/api/v1/courses/:id` | Excluir curso (apenas criador) |

### Aulas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/v1/courses/:id/lessons` | Listar aulas do curso |
| POST | `/api/v1/courses/:id/lessons` | Criar aula |
| PATCH | `/api/v1/courses/:id/lessons/:id` | Atualizar aula |
| DELETE | `/api/v1/courses/:id/lessons/:id` | Excluir aula |

---

## Diferenciais Implementados

- ✅ Stack recomendada: Rails + React
- ✅ Autenticação JWT com proteção real de rotas
- ✅ Melhorias de UX/UI: dark mode, banners automáticos, markdown, design responsivo
- ✅ Commits com mensagens semânticas