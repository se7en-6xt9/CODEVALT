import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oldgjjdaactriwneutwm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZGdqamRhYWN0cml3bmV1dHdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDUxODMsImV4cCI6MjA4ODI4MTE4M30.MvD4b7eOy8qhUArsYaFMmljLfVqJDHaredVXwXyoMaI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
