import { createClient } from '@supabase/supabase-js';

// Use environment variables for Vercel deployment
// These should be prefixed with VITE_ for Vite to expose them to the client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oldgjjdaactriwneutwm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZGdqamRhYWN0cml3bmV1dHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDUxODMsImV4cCI6MjA4ODI4MTE4M30.MvD4b7eOy8qhUArsYaFMmljLfVqJDHaredVXwXyoMaI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
