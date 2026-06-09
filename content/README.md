# Site content (edit here first)

**Who this is for:** Anyone updating wording on the signup site — you do **not** need to edit React components for routine copy changes.

## What lives here

| File | What you can change |
|------|---------------------|
| `site.json` | Site name, logo (text or image), footer, main site links, page title/description, SMS legal URLs, submit button labels |
| `signup-form.json` | All signup field labels, validation messages, server signup error messages, state list, “year in school” options, Yes/No labels |
| `pages.json` | Event cards, capacity labels, schedule fallbacks, listing empty/error states, event detail page, success page, “back to main site” link text |
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

Some strings include `{program}` or `{count}`, replaced automatically, e.g.:

- `"Back to {program} events"` → “Back to MHFA events”
- `"{count} seats remaining"` → “3 seats remaining”

## How changes go live

1. Edit the JSON file(s) and save.
2. Commit and push (or ask a developer to deploy).
3. Vercel rebuilds the site; changes appear after deploy (usually a few minutes).

For a quick local preview, a developer runs `npm run dev` and opens `/mhfa` or `/qpr`.

## JSON tips

- Use double quotes `"` for all strings.
- Links must be full URLs including `https://`.
- Placeholder links like `"#"` are fine until legal provides real SMS policy URLs.

### Program intro and signup notice (`listingIntro`, `signupNotice`)

These fields use **mixed blocks**: an ordered list where each entry is either a paragraph or a bullet list.

**Paragraph block:**

```json
{ "type": "paragraph", "text": "Opening sentence or paragraph." }
```

**Bullet list block:**

```json
{
  "type": "list",
  "items": [
    "First bullet point.",
    "Second bullet point."
  ]
}
```

**Example** (intro paragraph, then bullets):

```json
"listingIntro": [
  {
    "type": "paragraph",
    "text": "This FREE training teaches students how to recognize signs of mental health challenges."
  },
  {
    "type": "list",
    "items": [
      "For college students only.",
      "Full attendance is required for certification."
    ]
  }
]
```

You can repeat blocks in any order (e.g. paragraph → list → paragraph). `successNextSteps` stays a simple string list (one bullet per line on the success page).

## Need a new program page?

That requires developer setup (new route + HubSpot pipeline env vars). See `MAINTENANCE.md` → “Adding a new training program.”
