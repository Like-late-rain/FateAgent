import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export const supabase = createClient(
  requireEnv(SUPABASE_URL, 'SUPABASE_URL'),
  requireEnv(SUPABASE_SERVICE_KEY, 'SUPABASE_SERVICE_KEY'),
);
