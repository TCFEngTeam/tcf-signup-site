# Site content (edit here first)

**Who this is for:** Anyone updating wording on the signup site — you do **not** need to edit React components for routine copy changes.

## What lives here

| File | What you can change |
|------|---------------------|
| `site.json` | Site name, logo (text or image), footer, main site links, page title/description, SMS legal URLs, submit button labels |
| `signup-form.json` | All signup field labels, validation messages, state list, “year in school” options, Yes/No/Maybe labels |
| `pages.json` | Event cards, event detail page, success page, “back to main site” link text |
| `programs/mhfa.json` | MHFA listing intro, signup notice, success-page next steps |
| `programs/qpr.json` | QPR listing intro, signup notice, success-page next steps |

## What does **not** live here (HubSpot instead)

- **Event titles, dates, locations, capacity** — managed in HubSpot training records. The site reads them automatically.
- **Who receives confirmation emails** — HubSpot workflows (see `MAINTENANCE.md`).
- **Whether someone is registered** — HubSpot contact ↔ training association.

## Logo image (optional)

In `site.json`, under `logo`:

```json
"logo": {
  "text": "TCF",
  "imageSrc": "/logo.png",
  "imageAlt": "Trusted Care Foundation"
}
```

1. Ask a developer to add your image file under `public/` (e.g. `public/logo.png`).
2. Set `imageSrc` to that path (e.g. `"/logo.png"`).
3. Leave `imageSrc` as `""` to show text-only `logo.text`.

## Placeholders in `pages.json`

Some strings include `{program}`, replaced with **MHFA** or **QPR** automatically, e.g.:

`"Back to {program} events"` → “Back to MHFA events”

## How changes go live

1. Edit the JSON file(s) and save.
2. Commit and push (or ask a developer to deploy).
3. Vercel rebuilds the site; changes appear after deploy (usually a few minutes).

For a quick local preview, a developer runs `npm run dev` and opens `/mhfa` or `/qpr`.

## JSON tips

- Use double quotes `"` for all strings.
- Paragraphs are a **list** in square brackets, one string per paragraph.
- Links must be full URLs including `https://`.
- Placeholder links like `"#"` are fine until legal provides real SMS policy URLs.

## Need a new program page?

That requires developer setup (new route + HubSpot pipeline env vars). See `MAINTENANCE.md` → “Adding a new training program.”
