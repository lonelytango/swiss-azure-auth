# Mobile

Expo + React Native (TypeScript) app that uses Azure authentication and calls
the same protected backend API.

## Setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Start app:

```bash
npm run start
```

## Environment variables

- `EXPO_PUBLIC_AZURE_CLIENT_ID`
- `EXPO_PUBLIC_AZURE_REDIRECT_URI` (example:
  `msauth.com.ziandev.swissazureauthmobile://auth`)
- `EXPO_PUBLIC_AZURE_AUTHORITY` (example:
  `https://login.microsoftonline.com/<tenant-id>`)
- `EXPO_PUBLIC_BACKEND_BASE_URL` (example: `http://localhost:3001`)

## Azure app registration notes

- Add mobile redirect URI in Azure:
  - `msauth.com.ziandev.swissazureauthmobile://auth`
- Native app identifiers configured in this project:
  - iOS bundle ID: `com.ziandev.swissazureauthmobile`
  - Android package: `com.ziandev.swissazureauthmobile`
- Current auth scope is `User.Read`.
