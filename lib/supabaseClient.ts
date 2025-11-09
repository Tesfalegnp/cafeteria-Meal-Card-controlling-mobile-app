// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = 'https://xfxqwjfunevddcswgzxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmeHF3amZ1bmV2ZGRjc3dnenh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDAzMDYsImV4cCI6MjA3NzcxNjMwNn0.KHgvi9sYON0c-uUQvJMO6NAi7sKs_osancOc2akS-QQ';


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export const getCurrentUserId = async (): Promise<string | null> => {
try {
const { data } = await supabase.auth.getUser();
return data?.user?.id ?? null;
} catch (e) {
// no auth configured — fallback handled by app
return null;
}
};


export default supabase;