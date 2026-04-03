import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://namwpwyjwzruaagwfoox.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbXdwd3lqd3pydWFhZ3dmb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDE4MzMsImV4cCI6MjA3NTc3NzgzM30.2ySYAtueeFPvuUT6gZSSodhMKrNcwJwbNMyAFOH9ZeI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  console.log('--- DATABASE TABLES PROBE ---');
  // Since we don't have a direct listTables, we can try to query information_schema or just common names
  const commonTables = ['iso_documents', 'iso_document_versions', 'iso_versions', 'document_versions', 'profiles', 'departments', 'iso_workflow_logs', 'workflow_logs', 'iso_activity_logs', 'activity_logs', 'iso_certificates', 'certificates'];
  for (const table of commonTables) {
    const { error } = await supabase.from(table).select('count').limit(1);
    const exists = !error || (error.code !== '42P01'); // 42P01 is "relation does not exist"
    console.log(`${table}: ${exists ? 'EXISTS' : 'MISSING'}`);
  }
}

listTables();
