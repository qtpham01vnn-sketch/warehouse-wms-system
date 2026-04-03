import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://namwpwyjwzruaagwfoox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbXdwd3lqd3pydWFhZ3dmb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDE4MzMsImV4cCI6MjA3NTc3NzgzM30.2ySYAtueeFPvuUT6gZSSodhMKrNcwJwbNMyAFOH9ZeI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('--- ISO_DOCUMENTS COLUMNS ---');
  // Try to query common fields to see which one works
  const { data: d1, error: e1 } = await supabase.from('iso_documents').select('nextreviewdate').limit(1);
  console.log('nextreviewdate exists?', !e1);
  
  const { data: d2, error: e2 } = await supabase.from('iso_documents').select('name').limit(1);
  console.log('name exists?', !e2);

  const { data: d3, error: e3 } = await supabase.from('iso_documents').select('departmentid').limit(1);
  console.log('departmentid exists?', !e3);

  const { data: d4, error: e4 } = await supabase.from('iso_documents').select('status').limit(1);
  console.log('status exists?', !e4);

  const { data: d5, error: e5 } = await supabase.from('iso_documents').select('title').limit(1);
  console.log('title exists?', !e5);

  const { data: d6, error: e6 } = await supabase.from('iso_documents').select('next_review_date').limit(1);
  console.log('next_review_date exists?', !e6);
}

checkSchema();
