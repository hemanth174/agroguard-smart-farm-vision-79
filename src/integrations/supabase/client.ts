// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bqvcvqmpelmzjzzlujkz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdmN2cW1wZWxtemp6emx1amt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTY5NDUsImV4cCI6MjA2NTk5Mjk0NX0.f83TMzlRZ0M4IX4Xrgb-C5M3qtPYYTVIntM2hzqqu30";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);