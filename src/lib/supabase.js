import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cczfyvjfqigmmiktsehf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjemZ5dmpmcWlnbW1pa3RzZWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMTc3MDMsImV4cCI6MjEwNjY5MzcwM30.Hau3yPZyi-GKIhZH2dVDNQQONPYwSMjhZzP-df1qkIE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
