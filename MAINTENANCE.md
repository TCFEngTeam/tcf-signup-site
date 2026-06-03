# Maintenance guide (TCF Event Signup Site)

Plain-language reference for **non-developers** and developers. Technical details also live in `PLANNING.md` and `TESTING.md`.

---

## What this site does

- Public signup for **MHFA** and **QPR** training sessions.
- **HubSpot** stores events (trainings), contacts, and registrations.
- There is **no admin panel** on this site — use HubSpot for event and contact management.

### Public URLs

| URL | Purpose |
|-----|---------|
| `/` | Redirects to the main TCF marketing page (`content/site.json` → `homeRedirectUrl`) |
| `/mhfa` | MHFA event list |
| `/qpr` | QPR event list |
| `/mhfa/events/{id}` | MHFA event detail + signup |
| `/qpr/events/{id}` | QPR event detail + signup |

Link directly to `/mhfa` or `/qpr` from HubSpot or marketing pages.

---

## Changing wording (no code required)

**Edit JSON in the `content/` folder** — see [`content/README.md`](content/README.md).

| Change | File |
|--------|------|
| Footer, logo, main site link, page title, SMS policy links | `content/site.json` |
| Signup form labels, messages, dropdown options | `content/signup-form.json` |
| Event cards, event page, success page wording | `content/pages.json` |
| MHFA intro / signup notice / success steps | `content/programs/mhfa.json` |
| QPR intro / signup notice / success steps | `content/programs/qpr.json` |

After editing: save, commit, push, and wait for Vercel to deploy (or ask a developer to deploy).

**Do not edit** `src/components/...` for routine copy — those read from `content/`.

---

## Changing events (HubSpot)

Events on `/mhfa` and `/qpr` come from **HubSpot training records**, filtered by pipeline stage/type (set in Vercel env vars).

In HubSpot you typically control:

- Title, dates, location
- Capacity and how many seats remain (`available_capacity` or equivalent property)
- Whether the session appears on the site (pipeline stage must match env vars)

If **no events show**:

1. Confirm trainings exist in HubSpot.
2. Compare the training’s pipeline stage ID to `HUBSPOT_MHFA_PIPELINE_STAGE` / `HUBSPOT_QPR_PIPELINE_STAGE` in Vercel (or ask a developer).
3. Trainings moved to **closed for registration** must use `HUBSPOT_MHFA_CLOSED_PIPELINE_STAGE` / `HUBSPOT_QPR_CLOSED_PIPELINE_STAGE` — they stay listed but show “Registration Closed” instead of “Full”.

---

## Confirmation emails

Not configured in this codebase. Set up **HubSpot workflows** (or transactional email) when a contact is associated with a training. Coordinate with whoever manages HubSpot.

---

## Testing after changes

### Copy-only changes (`content/`)

A developer runs `npm run dev` and checks `/mhfa` and `/qpr` (and one event signup page).

### Before a production release

See [`TESTING.md`](TESTING.md):

```bash
npm test          # automated checks (no real HubSpot calls)
```

Manual check with real HubSpot (valid `.env.local`):

1. `npm run dev`
2. Open `/mhfa` — events load
3. Submit signup with a **new** email → success page
4. Submit again with same email → “already registered”
5. Verify contact + training link in HubSpot

---

## Environment variables (Vercel / `.env.local`)

Never commit secrets. Developers maintain these in Vercel and local `.env.local`.

| Variable | Purpose |
|----------|---------|
| `HUBSPOT_API_KEY` | HubSpot private app token |
| `HUBSPOT_MHFA_PIPELINE_STAGE` | MHFA trainings open for signup |
| `HUBSPOT_MHFA_CLOSED_PIPELINE_STAGE` | MHFA trainings listed with registration closed |
| `HUBSPOT_MHFA_PIPELINE_TYPE` | MHFA pipeline filter |
| `HUBSPOT_QPR_PIPELINE_STAGE` | QPR trainings open for signup |
| `HUBSPOT_QPR_CLOSED_PIPELINE_STAGE` | QPR trainings listed with registration closed |
| `HUBSPOT_QPR_PIPELINE_TYPE` | QPR pipeline filter |
| `HUBSPOT_TRAINING_OBJECT_ID` | Custom training object type |
| `HUBSPOT_TRAINING_ASSOCIATION_LABEL` | Contact → training link type (e.g. `registrant`) |
| `HUBSPOT_*_PROPERTY` | Maps form fields to HubSpot contact properties |
| `HUBSPOT_SMS_CONSENT_PROPERTY` | SMS consent field on contact |

Full list: `PLANNING.md` → “HubSpot environment variables”.

---

## Deploy

Hosted on **Vercel** (typical flow):

1. Merge changes to the main branch.
2. Vercel builds and deploys automatically.
3. Confirm `/mhfa` and `/qpr` after deploy.

Developers: `npm run build` locally to catch build errors before push.

---

## Adding a form field (developer task)

Follow the checklist in `PLANNING.md` → “Adding form fields”:

1. `src/lib/signup/format-fields.ts` — data type + formatting
2. `src/components/signup/EventSignupForm.tsx` — UI
3. `src/app/api/signup/route.ts` — required-field validation
4. `src/lib/hubspot/api.ts` — HubSpot property mapping + env var
5. `src/lib/signup/profile-store.ts` — if it should autofill
6. `src/test/fixtures/signup.ts` + tests

---

## Adding a new training program (developer task)

Example: a third program beyond MHFA/QPR.

1. Add `content/programs/{id}.json` and wire it in `src/lib/content/index.ts`.
2. Add route `src/app/[program]/page.tsx` static param (or dynamic config).
3. Add HubSpot pipeline env vars and `getProgramPipelineConfig()` in `src/lib/programs/config.ts`.
4. Update tests and `MAINTENANCE.md` URL table.

---

## Branding (logo, favicon, nav)

- **Logo image:** add file to `public/` (developer), then set `content/site.json` → `logo.imageSrc` (e.g. `"/logo.png"`). Text fallback: `logo.text`.
- **Nav links:** edit `content/site.json` → `nav` array, e.g. `{ "label": "Main site", "href": "https://..." }`.
- **Favicon:** add `public/favicon.ico` (developer).

---

## Getting help

| Question | Where to look |
|----------|----------------|
| Product decisions & roadmap | `PLANNING.md` |
| Original requirements | `REQUIREMENTS.md` |
| Automated / manual tests | `TESTING.md` |
| Edit page copy | `content/README.md` |
