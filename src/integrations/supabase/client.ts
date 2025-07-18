// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zttburqgjstsxrutrjac.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0dGJ1cnFnanN0c3hydXRyamFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODg5ODksImV4cCI6MjA2Nzk2NDk4OX0.6BvV0miSEy-Uf8_qRrEmMSQd4Lt4FyDtS5eQ6i__nlI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});