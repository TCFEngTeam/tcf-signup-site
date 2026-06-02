# Site content (edit here first)

**Who this is for:** Anyone updating wording on the signup site — you do **not** need to edit React components for routine copy changes.

## What lives here

| File | What you can change |
|------|---------------------|
| `site.json` | Site name, logo text, footer, links to main TCF site, SMS legal URLs, default page title/description |
| `programs/mhfa.json` | MHFA listing page intro, signup notice, success-page next steps |
| `programs/qpr.json` | QPR listing page intro, signup notice, success-page next steps |

## What does **not** live here (HubSpot instead)

- **Event titles, dates, locations, capacity** — managed in HubSpot training records. The site reads them automatically.
- **Who receives confirmation emails** — HubSpot workflows (see `MAINTENANCE.md`).
- **Whether someone is registered** — HubSpot contact ↔ training association.

## How changes go live

1. Edit the JSON file(s) and save.
2. Commit and push (or ask a developer to deploy).
3. Vercel rebuilds the site; changes appear after deploy (usually a few minutes).

For a quick local preview, a developer runs `npm run dev` and opens `/mhfa` or `/qpr`.

## JSON tips

- Use double quotes `"` for all strings.
- Paragraphs are a **list** in square brackets, one string per paragraph:
  ```json
  "listingIntro": [
    "First paragraph.",
    "Second paragraph."
  ]
  ```
- Links must be full URLs including `https://`.
- Placeholder links like `"#"` are fine until legal provides real SMS policy URLs.

## Need a new program page?

That requires developer setup (new route + HubSpot pipeline env vars). See `MAINTENANCE.md` → “Adding a new training program.”
