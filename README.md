# TCF Event Signup Site

Next.js app for public MHFA and QPR training signups. Events and registrations are stored in **HubSpot**.

## For non-developers

- **Change page wording:** edit files in [`content/`](content/README.md) (start with [`content/README.md`](content/README.md)).
- **Operate events & contacts:** use HubSpot.
- **Day-to-day guide:** [`MAINTENANCE.md`](MAINTENANCE.md).

## For developers

```bash
npm install
npm run dev      # http://localhost:3000 → redirects; use /mhfa or /qpr
npm test         # Vitest
npm run build
```

- Architecture & roadmap: [`PLANNING.md`](PLANNING.md)
- Testing: [`TESTING.md`](TESTING.md)
- Copy loader: `src/lib/content/` (reads `content/*.json`)

Deploys on Vercel. Env vars documented in `MAINTENANCE.md` and `PLANNING.md`.
