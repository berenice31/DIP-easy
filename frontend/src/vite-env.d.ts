/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_VERSION: string;
  readonly VITE_AUTH_TOKEN_KEY: string;
  readonly VITE_AUTH_REFRESH_TOKEN_KEY: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_ENABLE_TWO_FACTOR: string;
  readonly VITE_ENABLE_REGISTRATION: string;
  readonly VITE_GOOGLE_DRIVE_CLIENT_ID: string;
  readonly VITE_GOOGLE_DRIVE_API_KEY: string;
  readonly VITE_ENABLE_LOGGING: string;
  readonly VITE_LOG_LEVEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
