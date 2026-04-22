/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_TENANT_ID?: string
  readonly VITE_AZURE_CLIENT_ID?: string
  readonly VITE_AZURE_REDIRECT_URI?: string
  readonly VITE_TENANT_ID?: string
  readonly VITE_CLIENT_ID?: string
  readonly VITE_REDIRECT_URI?: string
  readonly VITE_POST_LOGOUT_REDIRECT_URI?: string
  readonly VITE_AZURE_AUTHORITY_HOST?: string
  readonly VITE_AZURE_API_SCOPE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
