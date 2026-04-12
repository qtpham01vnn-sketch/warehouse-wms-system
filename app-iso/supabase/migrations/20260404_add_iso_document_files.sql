-- Migration: Add iso_document_files table for ISO ZIP Import flow
-- Date: 2026-04-04

CREATE TABLE IF NOT EXISTS iso_document_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES iso_documents(id) ON DELETE CASCADE,
    file_code TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL, -- BM, HS, PL
    file_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    import_batch_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE iso_document_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "View document files" ON iso_document_files FOR SELECT USING (
  EXISTS (SELECT 1 FROM iso_documents d WHERE d.id = document_id)
);

CREATE POLICY "Modify document files" ON iso_document_files FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Admin', 'Approver', 'Reviewer'))
);
