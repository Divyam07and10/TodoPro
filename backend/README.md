#  Authentication & Todo Management API (NestJS + Google OAuth2)

A secure, production-ready backend built with **NestJS**, integrating **Google OAuth2**, JWT-based session management, and a **Todo Management** system with complete user profile handling.

---

## 🚀 Features

### ✅ Authentication

* Google Sign-In / Sign-Up
* JWT Access & Refresh Token
* Secure logout and cookie management

### 🧑‍💼 User Management

* Get profile
* Update profile, bio, and avatar

### ✅ Todo CRUD

* Create, read, update, and delete todos
* Priority, category, due date support
* Filtering, searching, sorting (based on created date only) support.

---

## 🧱 Tech Stack

| Layer        | Tech                        |
| ------------ | --------------------------- |
| Backend      | NestJS (TypeScript)         |
| ORM          | Prisma                      |
| DB           | PostgreSQL                  |
| Auth         | Google OAuth 2.0 + JWT      |
| Static Serve | HTML (for testing frontend) |

---

## 📁 Project Structure

```
todo-app/backend
│
├── .vscode/                                        # VS Code-specific editor settings
│   └── settings.json                               # Enables format on save using Prettier
│
├── prisma/                                         # Prisma ORM configuration and migrations
│   ├── schema.prisma                               # Defines DB models, enums, and relations
│   └── migrations/                                 # Auto-generated DB migration files/folders
│       └── ...                                     # Individual migration directories (timestamped)
│
├── public/                                         # Publicly accessible static files
│   ├── index.html                                  # Basic API test UI (can be removed in prod)
│   └── token-test.html                             # UI for testing login, refresh, logout
│
├── uploads/                                        # Uploaded user files (e.g., avatars)
│   └── avatars/                                    # Stores profile pictures locally
│
├── test/                                           # End-to-end (e2e) testing setup (default NestJS)
│   ├── app.e2e-spec.ts                             # Basic e2e test for root AppController
│   └── jest-e2e.json                               # Jest config for running e2e tests
│
├── src/
│   ├── main.ts                                     # Entry point; sets up app, middleware, global configs
│   ├── app.module.ts                               # Root module that imports all feature modules
│
│   ├── config/                                     # App-wide configurations
│   │   ├── jwt.config.ts                           # JWT secret, expiry, signing options
│   │   ├── cookie.config.ts                        # Secure cookie options for refresh tokens
│   │   ├── multer.config.ts                        # Multer setup for file upload (avatars)
│   │   └── env.schema.ts                           # Joi validation for .env file
│
│   ├── common/                                     # Shared logic (non-feature-specific)
│   │   ├── guards/
│   │   │   ├── jwt.guard.ts                        # Global JWT guard
│   │   │   └── api-key.guard.ts                    # API key guard (2FA style)
│   │   ├── decorators/                             # Custom route decorators (Currently empty)
│   │   ├── interceptors/                           # Custom interceptors (e.g., logging, transforming, {currently empty})
│   │   └── pipes/                                  # Custom validation pipes (Currently empty)
│
│   ├── core/                                       # Globally used services
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts                    # Exports Prisma Service globally
│   │   │   └── prisma.service.ts                   # Custom Prisma client service
│   │   ├── token/                                  # Token module (access & refresh)
│   │   │   ├── token.module.ts
│   │   │   └── services/
│   │   │       └── token.service.ts                # Handles refresh token & access token issue
│
│   ├── modules/                                    # All feature-specific logic
│   │
│   │   ├── auth/                                   # Authentication (Google OAuth + JWT)
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.ts              # Handles /auth endpoints
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts                 # Core auth logic (Google sign-in, logout)
│   │   │   ├── guards/
│   │   │   │   └── refresh-token.guard.ts          # Protects refresh token endpoint
│   │   │   ├── strategies/
│   │   │   │   ├── google.strategy.ts              # Google OAuth strategy
│   │   │   │   └── jwt.strategy.ts                 # JWT strategy (extracts user from token)
│   │   │   ├── dto/
│   │   │   │   └── login-response.dto.ts           # DTO for login response structure
│   │   │   ├── types/
│   │   │   │   └── request-with-user.interface.ts  # Extends Request object with user info
│   │   │   └── auth.module.ts                      # Auth module declaration
│   │
│   │   ├── user/                                   # User-related features (profile, avatar)
│   │   │   ├── controllers/
│   │   │   │   └── user.controller.ts              # Handles /users endpoints
│   │   │   ├── services/
│   │   │   │   └── user.service.ts                 # Business logic for user profile updates
│   │   │   ├── dto/
│   │   │   │   └── update-user.dto.ts              # DTO for validating user profile updates
│   │   │   ├── types/
│   │   │   │   └── user-response.interface.ts      # Response structure for user info
│   │   │   └── user.module.ts                      # User module declaration
│   │
│   │   ├── todo/                                   # Todo module (CRUD)
│   │   │   ├── constants/
│   │   │   │   └── filter-options.ts               # Centralized enums for todo filters
│   │   │   ├── controllers/
│   │   │   │   └── todo.controller.ts              # Handles /todos endpoints
│   │   │   ├── services/
│   │   │   │   └── todo.service.ts                 # Todo creation, update, delete, get logic
│   │   │   ├── dto/
│   │   │   │   ├── create-todo.dto.ts              # DTO for creating a new todo
│   │   │   │   ├── filter-todo.dto.ts              # DTO for validating todo filter query params
│   │   │   │   └── update-todo.dto.ts              # DTO for updating an existing todo
│   │   │   ├── types/
│   │   │   │   └── todo-response.interface.ts      # Response shape for todo objects
│   │   │   └── todo.module.ts                      # Todo module declaration
│
├── .env                                            # Environment variables (DB_URL, JWT_SECRET, API_KEY, etc.)
├── .env.example                                    # Environment variables example file
├── .gitignore                                      # Specifies files/folders to ignore in version control
├── .prettierrc                                     # Prettier config for consistent code formatting
├── nest-cli.json                                   # NestJS CLI configuration
├── package.json                                    # Project metadata, dependencies, and scripts
├── tsconfig.json                                   # TypeScript compiler base configuration
├── tsconfig.build.json                             # TypeScript config for production builds
└── README.md                                       # Complete project documentation


```

---

## 🔐 Authentication APIs

### Google Sign-In

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | `/auth/google`          | Redirects to Google login |
| GET    | `/auth/google/callback` | Handles OAuth2 callback   |

✅ On success, sets the following **secure cookies**:

* `access_token` (HttpOnly = false)
* `refresh_token` (HttpOnly = true)

---

### Logout

| Method | Endpoint       | Description   |
| ------ | -------------- | ------------- |
| POST   | `/auth/logout` | Logs out user |

**Response**

```json
{ "message": "Logged out successfully" }
```

---

## 👤 User Profile APIs

### Get Profile

| Method | Endpoint   | Description        |
| ------ | ---------- | ------------------ |
| GET    | `/user/me` | Get logged-in user |

**Response**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "uploads/avatars/avatar.jpg",
  "bio": "string | null",
  "createdAt": "2025-07-17T10:00:00.000Z"
}
```

---

### Update Profile

| Method   | Endpoint                                                            | Description                 |
| -------- | ------------------------------------------------------------------- | --------------------------- |
| PATCH    | `/user/me`                                                          | Update name, avatar, or bio |
| FormData | `name` (optional), `bio` (optional), `avatar` (optional image file) |                             |

**Response**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Updated Name",
  "avatar": "uploads/avatars/new-avatar.jpg",
  "bio": "Updated bio"
}
```

---

## ✅ Todo APIs

### Create Todo

| Method | Endpoint | Description       |
| ------ | -------- | ----------------- |
| POST   | `/todo`  | Create a new todo |

**Request Body**

```json
{
  "title": "Buy groceries",
  "description": "Milk, Eggs, Bread",
  "priority": "high",
  "category": "personal",
  "dueDate": "2025-07-30T10:00:00.000Z"
}
```

**Response**

```json
{
  "id": "uuid",
  "title": "Buy groceries",
  "description": "Milk, Eggs, Bread",
  "priority": "high",
  "category": "personal",
  "dueDate": "2025-07-30T10:00:00.000Z",
  "completed": false,
  "createdAt": "2025-07-17T11:00:00.000Z",
  "updatedAt": "2025-07-17T11:00:00.000Z"
}
```

---

### Get All Todos

| Method | Endpoint | Description        |
| ------ | -------- | ------------------ |
| GET    | `/todo`  | Get all user todos |

**Response**

```json
[
  {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, Eggs, Bread",
    "priority": "high",
    "category": "personal",
    "dueDate": "2025-07-30T10:00:00.000Z",
    "completed": false,
    "createdAt": "2025-07-17T11:00:00.000Z",
    "updatedAt": "2025-07-17T11:00:00.000Z"
  }
]
```

---

### Update Todo

| Method | Endpoint    | Description   |
| ------ | ----------- | ------------- |
| PATCH  | `/todo/:id` | Update a todo |

**Request Body**

```json
{
  "title": "Updated title",
  "completed": true
}
```

---

### Delete Todo

| Method | Endpoint    | Description   |
| ------ | ----------- | ------------- |
| DELETE | `/todo/:id` | Delete a todo |

**Response**

```json
{ "message": "Todo deleted successfully" }
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/todo-app
cd todo-app
```

### 2. Create `.env` file

```env
PORT=your-port-number(default 8000)
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_db
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback
ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key
REFRESH_TOKEN_EXPIRY=1d
NODE_ENV=your-development-environment(default "development")
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run DB migrations

```bash
npx prisma migrate dev
```

### 5. Start the server

```bash
npm run start:dev
```

---

## 🛡️ Security Best Practices

* Access token stored in non-HttpOnly cookie (for frontend JS use)
* Refresh token stored in HttpOnly cookie
* Cookie attributes: `HttpOnly`, `SameSite`, `Secure`, `maxAge`
* Avatar file cleanup handled on update
* Joi-based environment validation

---

## 📄 License

MIT License © 2025

---

## 🙋 Contributions Welcome

Feel free to fork, contribute, and suggest improvements via PR!

---

