# ISO Management Development Patterns

This document outlines the standard coding and architectural patterns used in the **app-iso** project to ensure consistency, security, and scalability.

## 1. Atomic Document Creation
When a new document is added, the system must perform an atomic transaction (or sequential safe steps) to ensure the metadata and the initial version are perfectly synced.

**Pattern:**
```typescript
// sequential-atomic-upload
async function createDocument(metadata, file, version) {
  // 1. Upload to storage first to get the URL
  const fileUrl = await upload(file);
  
  // 2. Create the document metadata
  const doc = await db.insert('iso_documents', metadata);
  
  // 3. Create the initial version record
  const ver = await db.insert('iso_document_versions', {
    document_id: doc.id,
    file_url: fileUrl,
    version_number: version,
    is_active: true
  });
  
  // 4. Update document's current_version_id
  await db.update('iso_documents', { current_version_id: ver.id }).eq('id', doc.id);
}
```

## 2. Threshold-Driven Alerts
Alerts are not stored statically if they depend on the passage of time. They are computed dynamically based on the current date vs. the saved target dates.

**Thresholds:**
- **Warning**: `< 60 days` for certificates; near `review_date` for documents.
- **Danger**: `< 30 days` for certificates; overdue for documents.
- **Critical**: Overdue (expired) for certificates.

## 3. Dual-Action File Handling
Every file record in the system MUST support two distinct actions:
- **View**: Opens the PDF in a new browser tab using the browser's native viewer.
- **Download**: Triggers a direct download to the user's local machine with the correct filename.

## 4. "PhuongNam Luxe" Component Pattern
Components should follow high-density, glassmorphism principles. Use the following CSS variables for consistency:
- `--glass-bg`: Semi-transparent background.
- `--glass-border`: Subtle 1px borders.
- `--accent-gradient`: Primary visual highlights.
- `--status-danger`: For <30 day alerts.
- `--status-warning`: For <60 day alerts.

## 5. Storage Path Convention
Strict directory structure for Supabase Storage:
- `documents/{doc_id}/{version_number}.pdf`
- `certificates/{cert_number}.pdf`
- `temp/{random_id}.pdf` (for temporary staging)
