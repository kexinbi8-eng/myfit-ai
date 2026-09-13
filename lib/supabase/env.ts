export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, anonKey, serviceRoleKey, configured: Boolean(url && anonKey) };
}

/** Server-only REST helper for the single-user MVP. Never expose serviceRoleKey to client modules. */
export async function supabaseRest<T>(table: string, init: RequestInit = {}): Promise<T> {
  const { url, serviceRoleKey, anonKey } = getSupabaseConfig();
  if (!url || !(serviceRoleKey || anonKey)) throw new Error("Supabase 尚未配置");
  const response = await fetch(`${url}/rest/v1/${table}`, {
    ...init,
    headers: { apikey: serviceRoleKey || anonKey || "", Authorization: `Bearer ${serviceRoleKey || anonKey}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`Supabase request failed: ${response.status}`);
  return response.json() as Promise<T>;
}
