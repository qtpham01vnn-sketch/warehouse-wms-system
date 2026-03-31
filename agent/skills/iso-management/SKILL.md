# ISO MANAGEMENT SKILL

## Purpose
Handle ISO document systems including:
- QT (Procedures)
- HS (Records)
- BM (Forms)
- HDCV (Work Instructions)
- ISO Certificates

## Core Capabilities

### 1. Document Management
- Create document with metadata
- Upload file to storage
- Manage version history
- Track review dates
- Assign owner / reviewer / approver

### 2. Version Control
- Each upload creates a new version
- Latest version is Active
- Previous versions become Archived
- Track:
  - version number
  - change log
  - uploader
  - upload date

### 3. Certificate Management
- Manage ISO certificates:
  - ISO 9001
  - ISO 13006
  - ISO 14001
  - BS EN 14411
- Track:
  - issue date
  - expiry date
  - issuing body
- Upload and download certificate files

### 4. Alert System

#### Certificates:
- < 60 days → warning
- < 30 days → danger
- expired → critical

#### Documents:
- near review_date → warning
- overdue review → danger

### 5. Storage Structure
- documents/{id}/{version}.pdf
- certificates/{id}.pdf

### 6. UI Requirements
- Document Hub
- Document Detail + Version History
- Certificate Management
- Alert Center

## Rules
- Documents and Certificates must be separate
- No empty pages
- Always support view + download
- Always create version on upload

## Output Mode
Generate full app:
- React + TypeScript + Vite
- Supabase integration
- Full CRUD + upload + alertsw