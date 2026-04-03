import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://namwpwyjwzruaagwfoox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbXdwd3lqd3pydWFhZ3dmb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDE4MzMsImV4cCI6MjA3NTc3NzgzM30.2ySYAtueeFPvuUT6gZSSodhMKrNcwJwbNMyAFOH9ZeI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
  console.log('--- PROFILES DATA ---');
  const { data, error } = await supabase.from('profiles').select('*').limit(5);
  if (error) {
    console.error('Error fetching profiles:', error.message);
  } else {
    console.log('Profiles:', JSON.stringify(data, null, 2));
  }
}

checkProfiles();
