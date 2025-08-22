# Authentication & Todo Management API (FastAPI + Google OAuth2)

A secure, production‑ready Python backend built with **FastAPI**, integrating **Google OAuth2**, **JWT-based session management**, and a **Todo Management** system with complete user profile handling.
---

## 🚀 Features

### Authentication

* Google Sign‑In / Sign‑Up (`/auth/google` → OAuth2 redirect)
* JWT **Access & Refresh Token**
* Secure logout and cookie‑based refresh flow

### User Management

* Get profile with absolute avatar URL
* Update profile, bio, and avatar (upload, replace, or remove)

### Todo CRUD

* Create, read, update, delete
* Priority, category, due date
* Filtering, searching, sorting (created date) support

---

## 🧱 Tech Stack

* **Backend:** FastAPI (Python)
* **DB/ORM:** SQLAlchemy + Alembic
* **DB:** PostgreSQL
* **Auth:** Google OAuth 2.0 + JWT (python‑jose)
* **HTTP Client:** httpx

---

## 📁 Project Structure

```
python-backend/                                   # Backend repository root
│
├── app/                                          # Main application code
│   ├── __init__.py                               # Marks `app` as a package
│   ├── main.py                                   # FastAPI app entrypoint (routers, static, CORS, handlers)
│   │
│   ├── core/                                     # App-wide core (settings, security, guards, errors)
│   │   ├── __init__.py                           # Marks `core` as a package
│   │   ├── api_key_guard.py                      # X-API-Key guard
│   │   ├── config.py                             # Pydantic settings (reads env)
│   │   ├── exceptions.py                         # Exception handlers
│   │   ├── oauth.py                              # Google OAuth client helpers
│   │   ├── refresh_token_guard.py                # Refresh token validation dependency
│   │   └── security.py                           # JWT utilities & get_current_user
│   │
│   ├── utils/                                    # Helpers
│   │   ├── __init__.py                           # Marks `utils` as a package
│   │   ├── helpers.py                            # parse_timedelta, ensure_static_dirs, file helpers
│   │   └── validators.py                         # Input/file validators
│   │
│   ├── db/                                       # Database setup & models
│   │   ├── __init__.py                           # Marks `db` as a package
│   │   ├── base.py                               # SQLAlchemy declarative Base/metadata
│   │   ├── dependencies.py                       # DB helpers
│   │   ├── session.py                            # Async engine/session & get_db
│   │   ├── sync_session.py                       # Sync session (Alembic / utilities)
│   │   ├── models/
│   │   │   ├── __init__.py                       # Consolidates model exports
│   │   │   ├── todo.py                           # SQLAlchemy ORM model: Todo
│   │   │   └── user.py                           # SQLAlchemy ORM model: User
│   │   └── migrations/
│   │       ├── __init__.py                       # Marks Alembic migrations as a package
│   │       ├── env.py                            # Alembic env bound to SQLAlchemy metadata
│   │       ├── script.py.mako
│   │       └── versions/
│   │
│   ├── api/                                      # Feature modules
│   │   ├── __init__.py                           # Marks `api` as a package
│   │   ├── auth/                                 # Authentication
│   │   │   ├── __init__.py                       # Marks `auth` as a package
│   │   │   ├── repository.py                     # Data access layer for auth
│   │   │   ├── router.py                         # /auth routes
│   │   │   ├── schemas.py                        # Pydantic models for requests/responses
│   │   │   └── service.py                        # Google sign-in, refresh, logout business logic
│   │   ├── users/                                # User management
│   │   │   ├── __init__.py                       # Marks `users` as a package
│   │   │   ├── repository.py                     # Data access layer for users
│   │   │   ├── router.py                         # /user routes
│   │   │   ├── schemas.py                        # Pydantic models for requests/responses
│   │   │   └── service.py                        # Profile get/update + avatar handling
│   │   └── todos/                                # Todo management
│   │       ├── __init__.py                       # Marks `todos` as a package
│   │       ├── repository.py                     # Data access layer for todos
│   │       ├── router.py                         # /todos routes
│   │       ├── schemas.py                        # Pydantic models for requests/responses
│   │       └── service.py                        # Todo business logic
│   │
│   └── services/                                 # Extra services
│       ├── __init__.py                           # Marks `services` as a package
│       └── file_service.py                       # File save/delete helpers for avatars
│
├── static/                                       # Publicly served static files
│   └── avatars/                                  # Stored profile pictures; served under `/static/avatars`
│
├── requirements.txt                              # Python dependencies
├── alembic.ini                                   # Alembic configuration
├── README.md                                     # Project Documentation
├── .env.example                                  # Example environment variables
├── .env                                          # Local environment variables
└── .gitignore                                    # Git ignore rules
```

---

## 📋 Prerequisites

* Python 3.10+ installed
  - macOS (Homebrew): `brew install python`
  - Linux (Debian/Ubuntu): `sudo apt update && sudo apt install -y python3 python3-venv python3-pip`
  - Windows (winget): `winget install Python.Python.3.12`
  - Or download from https://www.python.org/downloads/

Ensure Python is on PATH: `python --version` or `py --version` (Windows).

---

## ⚙️ Setup & Run

1) **Clone or open the repository**

   ```bash
   git clone https://github.com/hodev09/todo-app.git
   cd python-backend
   ```

2) **Create and activate a virtual environment**

   macOS/Linux (bash/zsh)

   ```bash
   # If your system uses python3, replace `python` with `python3`
   python -m venv venv
   source venv/bin/activate
   ```

   Windows (PowerShell)

   ```powershell
   py -3 -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

   Windows (CMD)

   ```bat
   py -3 -m venv venv
   venv\Scripts\activate.bat
   ```

3) **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4) **Configure environment variables**

   Create a `.env` file:-

   ```bash
   # .env
   ENVIRONMENT=development
   DATABASE_URL=postgresql+asyncpg://DATABASE_USERNAME:DATABASE_PASSWORD@DATABASE_HOSTNAME:DATABASE_PORT/DATABASE_NAME
   DATABASE_SYNC_URL=postgresql://DATABASE_USERNAME:DATABASE_PASSWORD@DATABASE_HOSTNAME:DATABASE_PORT/DATABASE_NAME
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   API_KEY=your_api_key                                        # Api key for accessing protected endpoints
   ALGORITHM=HS256                                             # Or RS256 if using asymmetric keys or any other algorithm used for signing the JWTs
   ACCESS_TOKEN_EXPIRE=our_access_token_expiry_time            # e.g., "30m", "1h", "1d"
   REFRESH_TOKEN_EXPIRE=our_refresh_token_expiry_time          # e.g., "16h", "7d", "30d"
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
   # Max file size in bytes (default 2MB)
   MAX_FILE_SIZE=2097152 # 2 * 1024 * 1024
   # Upload directory relative to project root; served under /static
   UPLOAD_DIR=static/avatars
   # Comma-separated allowed extensions
   ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,svg
   ```

   Notes:
   * `DATABASE_URL` is async (asyncpg) for the app; `DATABASE_SYNC_URL` is sync for Alembic.

5) **Initialize database (Alembic)**

   ```bash
   # Apply latest migrations
   alembic upgrade head

   # (Optional) Create a new migration from model changes
   alembic revision --autogenerate -m "describe changes"
   ```

6) **Run the server (Uvicorn)**

   ```bash
   uvicorn app.main:app --reload
   ```

   API → `http://localhost:8000`
   Static avatars → `http://localhost:8000/static/avatars/...`

---

## 🔐 Authentication APIs

### Google OAuth2

| Method | Endpoint                          | Description |
| ------ | --------------------------------- | ----------- |
| GET    | `/auth/google`                    | Redirects to Google login |
| GET    | `/auth/google/callback?code=...`  | Handles OAuth2 callback |

Behavior on successful callback:

* Sets `refresh_token` as HttpOnly cookie (SameSite=Lax; Secure in prod)
* Redirects to frontend with `access_token` in the URL query (e.g., `?access_token=...`)

### Refresh Access Token

* `POST /auth/refresh` → Requires valid refresh cookie. Returns a fresh access token.

Example response

```json
{ "access_token": "<jwt>", "token_type": "bearer" }
```

### Logout

* `POST /auth/logout` → Requires `Authorization: Bearer <token>`. Clears refresh cookie.

Example response

```json
{ "message": "Logged out successfully" }
```

---

## 👤 User Profile APIs

* **GET /user/me** → Returns profile with absolute avatar URL.

Example response

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "avatar": "http://localhost:8000/static/avatars/avatar.jpg",
  "bio": "string | null",
  "createdAt": "2025-07-17T10:00:00.000Z"
}
```

* **PATCH /user/me** → Requires `Authorization` and `X-API-Key`.

FormData fields

* `name` (optional string)
* `bio` (optional string)
* `avatar` (optional image file). To remove avatar, send empty filename or omit and include a removal flag as implemented by client.

Example response

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Updated Name",
  "avatar": "http://localhost:8000/static/avatars/new-avatar.jpg",
  "bio": "Updated bio"
}
```

Avatar rules:

* Validate extension against `ALLOWED_EXTENSIONS`.
* Validate size ≤ `MAX_FILE_SIZE`.
* Stored in `UPLOAD_DIR`, old avatars replaced.

Troubleshooting avatars

* Files are saved under `static/avatars/` and served at `/static/avatars/<filename>`.
* 404s typically mean the file does not exist on disk or the filename stored in DB is stale. Verify the file exists in `static/avatars/` and that the returned URL matches.

---

## ✅ Todo APIs

### Create Todo

| Method | Endpoint  | Description |
| ------ | --------- | ----------- |
| POST   | `/todos`  | Create a new todo |

Request body

```json
{
  "title": "Buy groceries",
  "description": "Milk, Eggs, Bread",
  "priority": "high",
  "category": "personal",
  "dueDate": "2025-07-30T10:00:00.000Z"
}
```

Example response

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

### Get All Todos

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET    | `/todos` | Get all user todos (supports filters) |

Query filters: `search`, `priority`, `status`, `orderBy`, `category`.

Example response

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

### Get One Todo

| Method | Endpoint            | Description |
| ------ | ------------------- | ----------- |
| GET    | `/todos/{id}`       | Get a single todo by id |

### Update Todo

| Method | Endpoint            | Description |
| ------ | ------------------- | ----------- |
| PATCH  | `/todos/{id}`       | Update a todo |

Request body (partial)

```json
{
  "title": "Updated title",
  "completed": true
}
```

### Delete Todo

| Method | Endpoint            | Description |
| ------ | ------------------- | ----------- |
| DELETE | `/todos/{id}`       | Delete a todo |

Example response

```json
{ "message": "Todo deleted successfully" }
```

## 🛡️ Security Notes

* Access token: Bearer token in headers.
* Refresh token: HttpOnly cookie with SameSite=Lax (use Secure in prod).
* API key: Required for sensitive routes like PATCH `/user/me`.
* Input validation: Pydantic + file checks (size, extension).

---

## 📄 License

MIT License © 2025

---

## 🙋 Contributions

PRs are welcome. Please follow the documented API contracts to keep parity with the TypeScript backend.

---