import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://namwpwyjwzruaagwfoox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbXdwd3lqd3pydWFhZ3dmb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDE4MzMsImV4cCI6MjA3NTc3NzgzM30.2ySYAtueeFPvuUT6gZSSodhMKrNcwJwbNMyAFOH9ZeI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVersionsFields() {
  console.log('--- ISO_DOCUMENT_VERSIONS FIELDS PROBE ---');
  const { data, error } = await supabase.from('iso_document_versions').select('*').limit(1);
  if (error) {
    console.error('Error:', error.message);
  } else if (data && data.length > 0) {
    console.log('Keys:', Object.keys(data[0]));
  } else {
    console.log('Table exists but is empty');
    // Try some common fields
    const fields = ['id', 'document_id', 'documentid', 'fileurl', 'file_url', 'version_number', 'versionnumber', 'changelog', 'change_log'];
    for (const f of fields) {
      const { error: e } = await supabase.from('iso_document_versions').select(f).limit(1);
      console.log(`${f}: ${!e ? 'EXISTS' : 'MISSING'}`);
    }
  }
}

checkVersionsFields();
