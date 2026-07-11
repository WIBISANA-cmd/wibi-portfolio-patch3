/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID?: string;
  readonly VITE_SANITY_DATASET?: string;
  readonly VITE_SANITY_API_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __APP_CONFIG__?: {
    VITE_SANITY_PROJECT_ID?: string;
    VITE_SANITY_DATASET?: string;
    VITE_SANITY_API_VERSION?: string;
  };
}
