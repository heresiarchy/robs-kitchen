# Verification and implementation record
6 November 2026. Scope approved in chat. Implemented inline in a new isolated Site checkout; independent code review completed and actionable findings corrected with regression tests.
- Domain and SQLite-backed service tests cover ownership, revisions, atomic operations, upload idempotency, source preservation, ingredient conversions, expiry types, small deductions, completed and partial shopping, and request bounds.
- Browser: created and saved a recipe; added 100 g rice; scaled a 200 g recipe to four servings and verified 300 g shopping requirement; saved list, checked rice, unpacked and verified lemon remains active. Data survives page refresh. Mobile rendering checked at 390 px via a temporary iframe QA harness.
- Direct localhost HTTP smoke from executor cannot reach the managed preview (ECONNREFUSED); equivalent browser-hosted API harness used instead. Fixtures exist only in preview database, excluded from deployment.
- Ruling: no direct email/Ocado account sync: Sites connector eligibility discovery is unavailable. Use connected ChatGPT tools plus this MCP to stage extracted data; users review before approving. This limitation is shown in the app.
- Local starter mock sign-in enabled only by Vite configureServer; hosted Worker has no mock identity fallback.

- Browser API harness PASS: MCP discovery and all 13 tool definitions; PNG upload and identical retry returns same import; MCP image content retrieval; original attachment retrieval; anonymous reads rejected; receipt dates extracted explicitly without inventing missing dates. Temporary harnesses removed before publication.
- Independent review findings fixed: stale draft checks, immutable shopping completion, retry IDs, atomic uploads/capacity, small-unit precision and schema metadata; added attachment cleanup and partial-shop regression tests.

## Bulk photos and scheduled identification, 6 November 2026
- 31 tests passed, including sequential uploads, failure continuation, cancellation boundaries, stable retry IDs, status classification and 50-file selection cap; typecheck passed.
- Mobile browser queue test: valid PNG, unsupported HEIC, valid PNG. Both valid images uploaded, unsupported file showed its own error, and remaining files continued. Review navigation disabled until uploads finish; leaving an unfinished queue now requires an explicit stop choice, and page unload warns during uploads.
- Native MCP read returned the actual stored product image. A temporary draft was staged, read back, and removed; stock count remained 1 throughout. No approved imports were changed.
- Site-linked hourly task Identify kitchen photos created and enabled, exact automation ID Automation_45393fc5763481919b10e1ad431fd9fa. Tasks use existing MCP access, no model API key. First unattended vision processing remains unverified; native scheduling confirms configuration only.
- Independent review found premature review navigation could unmount the queue. Fixed by disabling navigation while uploading and adding close/unload protection. No other important findings.

## Readability and contrast, 6 November 2026
User supplied a mobile inventory screenshot showing very small muted text. Increased typography throughout, replaced low-contrast text colours with darker green/brown/red, strengthened input boundaries and focus rings, enlarged touch controls, and changed mobile inventory rows into full-width product names with clear quantity/location/date sections.
- Rendered mobile viewport 390 px: item names 17 px; quantities/dates 16 px; notes, date status and navigation 14 px; controls 16 px or larger.
- Rendered desktop viewport 1180 px: inventory names, quantities and dates 16 px; status labels 14 px. No horizontal overflow at either tested width.
- Contrast: secondary text on sage 6.95:1; main text 11.65:1; quantity/date 9.82:1; expired status 8.82:1; warning badge 6.87:1; primary button 8.73:1; placeholders 6.40:1; input boundaries 3.99:1.
- Existing 31 tests passed; typecheck passed. Visual check used only local preview records; temporary QA page removed before packaging.

## Rich recipe editor — 7 November 2026
- Tiptap methods and notes in manual entry/import review; HTML source editing; sanitize-html allowlist at input/render.
- 36 tests pass, including safe HTML/plain text, stored original and plain MCP edit compatibility; TypeScript passes.
- Local browser: bold toolbar produces strong HTML; direct outer save from HTML view retains source changes; save/reload displays headings, bold, numbered steps and removes script content.
- 390 px mobile preview: readable type and wrapping touch-sized toolbar. Preview-only fixtures were not added to production.

## Dense layout and aisles — 7 November 2026
- Standard department groups inferred from item names, with persisted per-item override and MCP schema support; existing lists require no migration.
- 39 tests pass, including aisle ordering, unknown fallback, explicit overrides and override persistence while ticking items; TypeScript passes.
- Mobile local browser fixture: automatic groups, moving rice to Other, ticking apples and remaining counts verified. Final shopping layout uses a mobile list picker and hides aisle controls until Edit aisles, reducing clutter. No production data modified.

## Images from ChatGPT — 7 November 2026
- upload_image declares official OpenAI fileParams metadata with all four supported file properties. Downloads temporary references, retains original bytes and creates a pending import; stage_import handles subsequent recipe/product extraction.
- 44 tests pass; TypeScript passes. Tests cover URL allowlist, redirect rejection, expired/oversize responses, image signature, owner isolation, R2 byte preservation and idempotent retries.
- The real ChatGPT attachment-transfer flow still needs a user-provided food or recipe image after the refreshed tool becomes available. Screenshot attachments from site feedback were not imported as food.

## Recipe and product image fields — 7 November 2026
- save_recipe/save_stock now declare and persist imageUrl, imageAlt, imageCredit and uploaded attachmentId. Omitted image fields retain existing images; attachment ownership and image type are checked. Recipe approval retains its import image.
- 47 tests pass; TypeScript passes. Local browser saved a cover URL and verified that the actual image loaded on recipe detail (600 px natural width) and the recipe card.
- Representative oats photo URL already held in the user's recipe notes is supported; credit remains distinct from the original recipe source.

## Servings field — 7 November 2026
- Replaced keystroke coercion with a draft string so empty input remains empty while focused. Valid quarter servings update quantities; invalid/blank drafts keep previous quantities and disable recipe actions. Blur restores the last valid value.
- Shared control covers recipe detail, recipe editing and shopping-list recipe servings.
- 49 tests pass; TypeScript passes. Local browser cleared the detail field (remained blank, cooking/shopping disabled), then entered 4 (rice scaled from 200 g to 400 g; actions re-enabled).

## Method quantities scale with servings — 7 November 2026
- Cooking view scales explicit metric/spoon measures and recognised each-item counts in method HTML from the original serving ratio. Plain methods use the same path. Stored instructions remain unchanged.
- Fractions, partial ingredient amounts, inline formatting and links are handled; temperatures, timings, step numbers, batter proportions and common equipment capacity mentions remain unchanged. Unknown count descriptions are left as written.
- Browser verified 2 → 4 servings: 200 g rice / 400 ml water became 400 g / 800 ml in instructions; 180°C and 20 minutes stayed unchanged.
