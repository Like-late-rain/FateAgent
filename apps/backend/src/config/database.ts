import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

export const supabase = createClient(
  ENV.supabaseUrl,
  ENV.supabaseServiceKey,
);
