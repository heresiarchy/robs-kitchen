# Rob's Kitchen
Private recipe book, food inventory and recipe-based shopping lists with ChatGPT MCP tools.

## Use
- Save a recipe by link or by entering ingredients and method. The first saved source remains available alongside later adjustments.
- Store food as individual batches with metric quantities, Fridge/Freezer/Pantry, printed date and date type.
- Build a shopping list from multiple recipes and chosen servings. Compatible quantities merge; usable pantry stock is deducted once. Count units, mass and volume are never mixed.
- Tick purchased items, review actual pack sizes and printed dates, then unpack them into inventory. Unpurchased items remain on the active list.
- Upload up to 50 JPG/PNG/WebP photos, .eml or .txt receipts in one selection, or paste delivery text. Each file has its own progress, failure and retry state. Keep the page open until uploads finish. A linked hourly ChatGPT task reads new image imports through MCP and stages extracted records, even while the website is closed. It processes up to 20 images per run, oldest first. Imports remain pending until reviewed and approved. No separate model API key or paid API inference call is configured.
- Install/connect the Site-provisioned Rob's Kitchen plugin in ChatGPT. Start a new chat after installation if tools aren't available immediately.

## Import boundaries
Public recipe link imports read Recipe JSON-LD. Blocked or unsupported websites can be imported via ChatGPT or manually. US measures must be converted to supported metric measures during review.
Direct Gmail and Ocado account synchronisation is not configured: Sites connector-eligibility discovery was unavailable in this workspace. ChatGPT can use its separate Gmail/browser access together with this kitchen MCP to stage receipts and delivery information. No automatic account monitoring or invented expiry dates.

## Implementation
Vinext/React/TypeScript on a Cloudflare Worker. D1 logical binding DB stores records, revisions and operation receipts. R2 logical binding BUCKET stores owned upload objects. Sites provides private access and trusted identity headers; browser and MCP share user-scoped records. The Vite starter's local sign-in is development-only and is absent from the hosted Worker.

`npm test` runs domain, security and SQLite-backed service regression tests. `npx tsc --noEmit` checks types. Use the Sites build helper for deployment. Schema declarations are in db/schema.ts, migrations in drizzle/. Apply pending migrations once to local previews; Sites applies hosted migrations on publication.

MCP endpoint POST /mcp implements server/discover, initialize, tools/list and tools/call. There are 13 tools covering kitchen reads, recipe/stock changes, shopping, imports, attachment reads and cooking deductions. Mutations require operationId; edits require current revisions. Operations are atomically recorded and retry-safe. Sources and uploads are untrusted data.

## Scheduled photo identification
The Site-linked task `Identify kitchen photos` is enabled hourly in Europe/London. Its instructions are in docs/photo-processing-task.md and are copied into its self-contained prompt. It skips approved/populated drafts, fills existing IDs with current revisions, records unreadable photos as `Needs review:`, and never approves imports or mutates inventory. ChatGPT plan usage limits apply. Scheduled creation is confirmed; a first unattended image-processing run has not yet been verified. Native image read and draft write/readback have been verified separately.
