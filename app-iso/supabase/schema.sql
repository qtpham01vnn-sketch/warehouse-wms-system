-- ISO Management System Schema (Evolution)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ROLES: Admin, Reviewer, Approver, Standard
-- STATUS: draft, under_review, approved, active, obsolete
-- VISIBILITY: department_only, company_wide

-- TABLE: profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'Standard', -- Admin, Reviewer, Approver, Standard
    department TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: iso_documents
CREATE TABLE IF NOT EXISTS iso_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- QT, HS, BM, HDCV
    department TEXT NOT NULL,
    owner TEXT NOT NULL,
    reviewer TEXT NOT NULL,
    approver TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    visibility TEXT NOT NULL DEFAULT 'department_only', -- department_only, company_wide
    current_version_id UUID,
    published_date DATE,
    effective_date DATE,
    next_review_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: iso_document_versions
CREATE TABLE IF NOT EXISTS iso_document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES iso_documents(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL,
    file_url TEXT NOT NULL,
    change_log TEXT,
    uploader_name TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: iso_workflow_logs
CREATE TABLE IF NOT EXISTS iso_workflow_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES iso_documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users,
    user_name TEXT,
    from_status TEXT,
    to_status TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: iso_certificates
CREATE TABLE IF NOT EXISTS iso_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    standard TEXT,
    cert_number TEXT,
    issuer TEXT,
    issued_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES

-- Enable RLS
ALTER TABLE iso_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE iso_certificates ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Documents: Isolation + Company Wide + Admin Override
CREATE POLICY "View documents" ON iso_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin') OR
  department = (SELECT department FROM profiles WHERE id = auth.uid()) OR
  visibility = 'company_wide'
);

-- Active Publishing: Only Reviewer/Approver/Admin can update status (Service level enforces actual logic)
CREATE POLICY "Modify documents" ON iso_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Admin', 'Approver', 'Reviewer'))
);

-- TABLE: iso_activity_logs
CREATE TABLE IF NOT EXISTS iso_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users,
    user_name TEXT,
    action TEXT NOT NULL, -- Download, View, Export
    target_id UUID,
    target_type TEXT, -- Document, Certificate
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Activity Logs: Viewable by Admin only
ALTER TABLE iso_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View activity logs" ON iso_activity_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'Admin')
);
CREATE POLICY "Insert activity logs" ON iso_activity_logs FOR INSERT WITH CHECK (true);
