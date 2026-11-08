# ChatGPT image attachment imports

Add upload_image to the existing private MCP connection using OpenAI file inputs (_meta openai/fileParams), accepting an actual temporary file reference. Download JPG/PNG/WebP up to 8 MB from approved ChatGPT storage hosts only, validating redirects and file signatures, then retain bytes in owner-scoped R2 and create a pending import through the existing idempotent save_upload action. Source URLs are not persisted. ChatGPT may then extract either recipe or product details into that same draft using stage_import. The original remains attached. Preserve review before approval and the existing photo task.

Verify file descriptor contract, URL and redirect checks, signatures, expired/oversize downloads, owner isolation, stored bytes and upload retries. No AI API or changes to schedules required.
