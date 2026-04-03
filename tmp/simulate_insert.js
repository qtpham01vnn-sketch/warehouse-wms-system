import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://namwpwyjwzruaagwfoox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbXdwd3lqd3pydWFhZ3dmb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDE4MzMsImV4cCI6MjA3NTc3NzgzM30.2ySYAtueeFPvuUT6gZSSodhMKrNcwJwbNMyAFOH9ZeI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function simulateInsert() {
  const payload = {
    code: 'TEST-DEBUG-001',
    name: 'Test Debug Document',
    type: 'QT',
    departmentid: 'd2', // Existing ID from probe: 'd1', 'd2', 'd3'
    owner_id: 'd0e98031-482a-4467-b52b-cc6d3a8e97f0', // Dummy UUID for owner_id
    status: 'draft',
    nextreviewdate: '2026-12-31',
    access_scope: 'department_only',
    url: 'https://example.com/test.pdf'
  };

  console.log('Attempting insert with payload:', JSON.stringify(payload, null, 2));
  
  const { data, error } = await supabase
    .from('iso_documents')
    .insert([payload])
    .select();

  if (error) {
    console.error('INSERT ERROR:', JSON.stringify(error, null, 2));
  } else {
    console.log('INSERT SUCCESS:', data);
  }
}

simulateInsert();
