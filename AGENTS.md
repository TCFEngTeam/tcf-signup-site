<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## TCF signup site

- **Copy:** `content/*.json` — not hardcoded in components for routine text.
- **HubSpot wiring:** `config/hubspot.json` via `src/lib/hubspot/config.ts` — do not add `HUBSPOT_*` env vars for pipelines, properties, or association labels.
- **Secrets only in env:** `HUBSPOT_API_KEY`, `UNREGISTER_TOKEN_SECRET`, `RESEND_*`, `NEXT_PUBLIC_APP_URL` (see `.env.template`).
- **Ops docs:** `MAINTENANCE.md`, `UNREGISTER.md`, `TESTING.md`, `config/README.md`.
