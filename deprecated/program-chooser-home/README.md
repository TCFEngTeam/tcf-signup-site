# Program chooser home (deprecated)

This was the `/` route: a page that linked to `/mhfa` and `/qpr`.

Traffic now goes to the HubSpot marketing site instead (`HUBSPOT_WEBSITE_URL` redirect in `src/app/page.tsx`). HubSpot pages should link directly to:

- `/mhfa` — MHFA training listings
- `/qpr` — QPR training listings

## Restore the program chooser as `/`

1. Copy `deprecated/program-chooser-home/page.tsx` to `src/app/page.tsx` (replace the redirect).
2. Remove or comment out `HUBSPOT_WEBSITE_URL` redirect usage if you no longer need it.
3. In `src/components/events/ProgramListing.tsx`, change the back link from the HubSpot URL back to `href="/"` if desired.
4. Redeploy.

## Keep redirect + chooser (unlikely)

Do not copy this file into `app/` without removing the redirect in `src/app/page.tsx` — only one file can own `/`.
