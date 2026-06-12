# TCF Event Signup Site

Next.js app for public MHFA and QPR training signups. Events and registrations are stored in **HubSpot**.

## For non-developers

- **Change page wording:** edit files in [`content/`](content/README.md) (start with [`content/README.md`](content/README.md)).
- **Operate events & contacts:** use HubSpot.
- **Cancel a registration:** [`/unregister`](UNREGISTER.md) (staff guide in [`UNREGISTER.md`](UNREGISTER.md)).
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
- HubSpot wiring: [`config/hubspot.json`](config/README.md) (see [`config/README.md`](config/README.md))

Deploys on Vercel. **Secrets** in `.env.template`; **HubSpot IDs** in `config/hubspot.json`. Full ops guide: [`MAINTENANCE.md`](MAINTENANCE.md).
