import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Documentation is contraddictory on if this client can be created freely because cheap,
// of if it has an internal state connected to a GoTrueClient that prefer to have just one singleton.
// To be sure, I will insert this into the Tanstack Router Context, so don't use this manually.
export function createClient() {
  return createSupabaseClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
  );
}
