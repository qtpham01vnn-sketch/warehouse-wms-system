import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://namwpwyjwzruaagwfoox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbXdwd3lqd3pydWFhZ3dmb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDE4MzMsImV4cCI6MjA3NTc3NzgzM30.2ySYAtueeFPvuUT6gZSSodhMKrNcwJwbNMyAFOH9ZeI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkVersionsTable() {
  console.log('--- ISO_DOCUMENT_VERSIONS COLUMNS PROBE ---');
  const { data, error } = await supabase.from('iso_document_versions').select('*').limit(1);
  if (data && data.length > 0) {
    console.log('Actual keys:', Object.keys(data[0]));
  } else {
    // Check common fields
    const fields = ['id', 'document_id', 'version_number', 'file_url', 'change_log', 'uploader_name', 'is_active', 'created_at', 'versionnumber', 'fileurl', 'changelog', 'uploadername', 'isactive'];
    for (const field of fields) {
      const { error: e } = await supabase.from('iso_document_versions').select(field).limit(1);
      console.log(`${field}: ${!e ? 'EXISTS' : 'MISSING (' + e.message + ')'}`);
    }
  }
}

checkVersionsTable();
