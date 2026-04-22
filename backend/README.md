# Backend

Express + TypeScript API with Azure bearer token validation.

## Setup

1. Copy `.env.example` to `.env` and provide Azure values.
2. Install dependencies with `npm install`.
3. Start the API with `npm run dev`.

## Environment variables

- `PORT` API port (default `3001`)
- `FRONTEND_ORIGIN` allowed CORS origin (default `http://localhost:5173`)
- `AZURE_TENANT_ID` Azure tenant ID
- `AZURE_CLIENT_ID` Azure app registration client ID
- `AZURE_AUDIENCE` optional explicit audience; if omitted backend accepts `client_id` and `api://client_id`
- `AZURE_AUTHORITY_HOST` optional authority host (default `login.microsoftonline.com`)

## Endpoints

- `GET /api/health` public health check
- `GET /api/profile` protected endpoint
- `GET /api/me` protected endpoint
- `GET /api/mock-data` protected endpoint returning randomized mock array

## Response format

All endpoints use a lean envelope:

- success: `{ "success": true, "data": ... }`
- failure: `{ "success": false, "data": null, "error": { "code", "message", "details?" } }`
