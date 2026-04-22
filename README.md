# Swiss Azure Auth

Monorepo scaffold with:

- `frontend`: Vite + React + TypeScript + Tailwind + MSAL auth provider
- `backend`: Express + TypeScript API with Azure JWT validation

## Prerequisites

- Node.js 20+
- Azure app registration with SPA redirect URI (`http://localhost:5173`)

## Run locally

### 1) Configure env files

Frontend:

```bash
cp frontend/.env.example frontend/.env
```

Backend:

```bash
cp backend/.env.example backend/.env
```

Fill in the Azure values in both files.

### 2) Start backend

```bash
cd backend
npm install
npm run dev
```

### 3) Start frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and sign in. The frontend sends the bearer token on `/api/profile`, and the backend validates it before returning data.
