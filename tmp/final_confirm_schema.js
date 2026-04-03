import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://namwpwyjwzruaagwfoox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbXdwd3lqd3pydWFhZ3dmb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDE4MzMsImV4cCI6MjA3NTc3NzgzM30.2ySYAtueeFPvuUT6gZSSodhMKrNcwJwbNMyAFOH9ZeI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function finalConfirm() {
  const { data, error } = await supabase.from('iso_documents').select('departmentid').limit(1);
  if (error) {
    console.log('departmentid error:', error.message);
    const { data: d2, error: e2 } = await supabase.from('iso_documents').select('department_id').limit(1);
    if (e2) {
      console.log('department_id error:', e2.message);
    } else {
      console.log('department_id EXISTS');
    }
  } else {
    console.log('departmentid EXISTS');
  }
}

finalConfirm();
