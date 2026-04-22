# Swiss Azure Auth

Monorepo scaffold with:

- `frontend`: Vite + React + TypeScript + Tailwind + MSAL auth provider
- `backend`: Express + TypeScript API with Azure JWT validation

## Prerequisites

- Node.js 20+
- Azure app registration with SPA redirect URI (`http://localhost:5173`)

## Project structure

- `frontend`: UI + MSAL login flow (`User.Read`)
- `backend`: protected API endpoints with JWT validation
- root `package.json`: concurrent dev scripts for both apps

## Setup

Install root dependencies:

```bash
npm install
```

Install workspace dependencies (if needed on a fresh clone):

```bash
npm install --prefix frontend
npm install --prefix backend
```

## Configure environment

### Frontend

```bash
cp frontend/.env.example frontend/.env
```

Required values:

- `VITE_AZURE_TENANT_ID`
- `VITE_AZURE_CLIENT_ID`
- `VITE_AZURE_REDIRECT_URI`

Optional values:

- `VITE_POST_LOGOUT_REDIRECT_URI`
- `VITE_AZURE_AUTHORITY_HOST` (example: `login.microsoftonline.us`)

### Backend

```bash
cp backend/.env.example backend/.env
```

Required values:

- `AZURE_TENANT_ID`
- `AZURE_CLIENT_ID`

Optional values:

- `AZURE_AUDIENCE`
- `AZURE_AUTHORITY_HOST`
- `PORT`
- `FRONTEND_ORIGIN`

## Run locally

Run frontend + backend together:

```bash
npm run dev
```

Or run separately:

```bash
npm run dev:frontend
npm run dev:backend
```

Open `http://localhost:5173` and sign in.

## API response format

All endpoints use a lean envelope:

- Success: `{ "success": true, "data": ... }`
- Failure: `{ "success": false, "data": null, "error": { "code", "message", "details?" } }`

## Available backend endpoints

- `GET /api/health` (public)
- `GET /api/profile` (protected)
- `GET /api/me` (protected)
- `GET /api/mock-data` (protected, random mock array)
