type EnvMap = Record<string, string | undefined>;

const SERVER_ENV_KEYS = [
  "SHEETS_PROVIDER",
  "GOOGLE_SHEETS_SPREADSHEET_ID",
  "GOOGLE_SHEETS_TAB",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "MERCADOPAGO_ACCESS_TOKEN",
  "NEXT_PUBLIC_SITE_URL",
] as const;

function mergeCloudflareVars(base: EnvMap, cfEnv: Record<string, unknown>): EnvMap {
  const out = { ...base };
  for (const key of SERVER_ENV_KEYS) {
    const value = cfEnv[key];
    if (typeof value === "string" && value.length > 0) {
      out[key] = value;
    }
  }
  return out;
}

/** Variables de servidor: process.env + bindings de Wrangler en Workers. */
export async function getServerEnv(): Promise<EnvMap> {
  const base: EnvMap = {};
  for (const key of SERVER_ENV_KEYS) {
    const v = process.env[key];
    if (v !== undefined) base[key] = v;
  }

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    return mergeCloudflareVars(base, ctx.env as Record<string, unknown>);
  } catch {
    return base;
  }
}

export function isCloudflareWorkerRuntime(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator.userAgent === "Cloudflare-Workers"
  );
}
