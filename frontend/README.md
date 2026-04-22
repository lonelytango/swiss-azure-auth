# Frontend

Vite + React + TypeScript + Tailwind frontend with Azure MSAL authentication.

## Setup

1. Copy `.env.example` to `.env` and fill in Azure values.
2. Install dependencies with `npm install`.
3. Start the app with `npm run dev`.

## Environment variables

- `VITE_AZURE_TENANT_ID` Azure tenant ID
- `VITE_AZURE_CLIENT_ID` Azure app registration client ID
- `VITE_AZURE_REDIRECT_URI` local SPA redirect URI (usually `http://localhost:5173`)
- `VITE_POST_LOGOUT_REDIRECT_URI` optional logout return URI
- `VITE_AZURE_AUTHORITY_HOST` optional authority host for non-public clouds

## Auth flow

- `AuthProvider` initializes MSAL and uses redirect-based sign-in.
- Login requests `User.Read` scope.
- Frontend uses the signed-in account ID token for backend authorization calls.
- Protected frontend UI is wrapped by `ProtectedRoute`.

## API integration

- API calls use native `fetch`.
- Responses follow the standard envelope:
  - success: `{ success: true, data: ... }`
  - failure: `{ success: false, data: null, error: { code, message, details? } }`
- `apiMapper` converts backend snake_case fields to frontend camelCase models.
