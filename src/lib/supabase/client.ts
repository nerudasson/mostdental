import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://lyvngsredpczhxoujikt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5dm5nc3JlZHBjemh4b3VqaWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MTQyMDAsImV4cCI6MjA0OTM5MDIwMH0.wgHrdIEgrIQ2cO8KL8vOLrUEEfjeHbXUnI6hW7GJex8';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);