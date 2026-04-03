import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://namwpwyjwzruaagwfoox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbXdwd3lqd3pydWFhZ3dmb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDE4MzMsImV4cCI6MjA3NTc3NzgzM30.2ySYAtueeFPvuUT6gZSSodhMKrNcwJwbNMyAFOH9ZeI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDepts() {
  console.log('--- PROFILES DEPARTMENT IDs ---');
  const { data: profiles, error } = await supabase.from('profiles').select('departmentid').limit(50);
  if (error) {
    console.error('Error:', error);
  } else if (profiles) {
    const depts = [...new Set(profiles.map(p => p.departmentid))];
    console.log('Unique department IDs in profiles:', depts);
  }
}

checkDepts();
