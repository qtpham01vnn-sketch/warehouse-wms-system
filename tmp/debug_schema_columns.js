import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://namwpwyjwzruaagwfoox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbXdwd3lqd3pydWFhZ3dmb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDE4MzMsImV4cCI6MjA3NTc3NzgzM30.2ySYAtueeFPvuUT6gZSSodhMKrNcwJwbNMyAFOH9ZeI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  console.log('--- ISO_DOCUMENTS COLUMNS PROBE ---');
  // Try to select common fields and some potentials
  const { data, error } = await supabase.from('iso_documents').select('*').limit(1);
  if (data && data.length > 0) {
    console.log('Actual keys:', Object.keys(data[0]));
  } else {
    // If table is empty, we test field existence with selective selects
    const fields = ['id', 'code', 'name', 'departmentid', 'ownerid', 'ownername', 'status', 'visibility', 'nextreviewdate', 'url', 'owner_id', 'owner_name'];
    for (const field of fields) {
      const { error: e } = await supabase.from('iso_documents').select(field).limit(1);
      console.log(`${field}: ${!e ? 'EXISTS' : 'MISSING (' + e.message + ')'}`);
    }
  }
}

checkColumns();
