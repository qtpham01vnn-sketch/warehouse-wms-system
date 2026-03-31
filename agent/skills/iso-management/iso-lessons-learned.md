# ISO LESSONS LEARNED

## 1. Runtime & Environment
- Always use a real `.env` file, not only `.env.example`
- Supabase app requires:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY
- Restart dev server after updating env variables

## 2. Import Safety
- Never import CSS or files that do not exist
- Verify exact filename and path before import
- Avoid broken imports like missing Layout.css

## 3. Blank Screen Prevention
- Do not claim success based only on build status
- Always verify the UI renders visibly in browser
- Check browser console for runtime errors before considering the task complete

## 4. ISO UX Lessons
- Current app works functionally but visual spacing is still rough
- Need better vertical rhythm between sections
- Need more balanced card spacing and content density
- Need stronger visual hierarchy for titles, labels, and content blocks
- Avoid large empty dark spaces
- Tables, cards, and dashboard panels should align consistently

## 5. Internal MVP Rules
- Prioritize usable workflow first
- Then refine UI polish
- No blank modules
- Certificates and Alerts must never appear empty without clear empty state or fallback data

## 6. Audit-Ready Rules
- Active documents must be locked
- Any change must go through new version workflow
- change_log is mandatory
- Workflow transitions must be logged
- Download/view/export activities must be logged

## 7. ISO Product Quality Standard
Future ISO builds must satisfy:
- functional login
- role-based access
- department isolation
- version history
- certificate tracking
- alerts
- export report
- visually balanced dashboard and forms

## 8. Final Rule
Do not stop at “working”.
The output must be:
- usable
- stable
- visually consistent
- suitable for internal pilot deployment