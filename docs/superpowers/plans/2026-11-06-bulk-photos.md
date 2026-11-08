# Bulk Photo Implementation Plan
> Execute inline using the approved kitchen architecture.
**Goal:** Upload many photos on the website and identify them via a linked ChatGPT task.
**Architecture:** Browser upload queue calls the existing idempotent upload endpoint. Hourly Site-linked cloud task uses MCP to read photos and stage results; users review before approval.
**Tech Stack:** Existing React/Vinext/Workers/D1/R2 and ChatGPT task/MCP.
**Spec:** docs/superpowers/specs/2026-11-06-bulk-photos-design.md

## Global Constraints
Private Site; no extra model API key; preserve records; no invented dates; review before inventory writes.
## Review Focus
Failed uploads continue; retries retain IDs; source state is not overwritten; extracted and unreadable drafts do not repeat; schedule uses supported cloud connections.

### Task 1: Queue and UI
- [x] Test sequential uploads, continuation after failure, stopping and stable retry operation IDs.
- [x] Implement lib/upload-queue.ts, app/PhotoImportPanel.tsx, and multiple-file picker integration.
- [x] Replace manual ChatGPT extraction instructions with truthful scheduled-processing states.
### Task 2: Task preparation
- [x] Verify native MCP image reads and writer availability; save a self-contained task prompt.
- [x] Publish UI, then recheck linked schedules and create one hourly Site-linked cloud task.
### Task 3: Verification
- [x] Run suite, typecheck, browser-check queue and mobile states; review changed source.
- [ ] Build, package and deploy owner-private.
- [x] Exercise unattended image read/write if supported; otherwise report exactly what remains unverified.
