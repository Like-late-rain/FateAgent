import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ApiError } from './errors';

const ENV_SUPABASE_URL = 'SUPABASE_URL';
const ENV_SUPABASE_SERVICE_KEY = 'SUPABASE_SERVICE_KEY';
const SUPABASE_MISSING_MESSAGE = 'Supabase 环境变量未配置';

const SUPABASE_CLIENT_OPTIONS = {
  auth: {
    persistSession: false
  }
};

let supabaseClient: SupabaseClient | null = null;

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new ApiError(SUPABASE_MISSING_MESSAGE, 500, 'UNKNOWN');
  }
  return value;
}

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }
  const url = getRequiredEnv(ENV_SUPABASE_URL);
  const serviceKey = getRequiredEnv(ENV_SUPABASE_SERVICE_KEY);
  supabaseClient = createClient(url, serviceKey, SUPABASE_CLIENT_OPTIONS);
  return supabaseClient;
}
