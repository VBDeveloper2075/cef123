declare global {
  interface CloudflareEnv {
    INSCRIPCIONES_KV?: {
      get(key: string): Promise<string | null>;
      put(key: string, value: string): Promise<void>;
    };
    SHEETS_PROVIDER?: string;
    GOOGLE_SHEETS_SPREADSHEET_ID?: string;
    GOOGLE_SHEETS_TAB?: string;
    GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
    GOOGLE_PRIVATE_KEY?: string;
    MERCADOPAGO_ACCESS_TOKEN?: string;
    NEXT_PUBLIC_SITE_URL?: string;
  }
}

export {};
