import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://namwpwyjwzruaagwfoox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbXdwd3lqd3pydWFhZ3dmb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDE4MzMsImV4cCI6MjA3NTc3NzgzM30.2ySYAtueeFPvuUT6gZSSodhMKrNcwJwbNMyAFOH9ZeI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('--- ISO_DOCUMENTS SAMPLE ---');
  const { data: docs, error: docError } = await supabase.from('iso_documents').select('*').limit(1);
  if (docError) {
    console.error('Error fetching iso_documents:', docError);
  } else if (docs && docs.length > 0) {
    console.log('Keys in iso_documents:', Object.keys(docs[0]));
    console.log('Sample record:', JSON.stringify(docs[0], null, 2));
  } else {
    console.log('No records found in iso_documents');
  }

  console.log('\n--- PROFILES DEPARTMENTS ---');
  const { data: profiles, error: profError } = await supabase.from('profiles').select('department').limit(10);
  if (profError) {
    console.error('Error fetching profiles:', profError);
  } else if (profiles) {
    const depts = [...new Set(profiles.map(p => p.department))];
    console.log('Departments found in profiles profile table:', depts);
  }
}

checkSchema();
