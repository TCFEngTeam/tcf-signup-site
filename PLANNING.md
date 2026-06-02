# TCF Event Signup Site — Planning & Context

Last updated: **2026-06-02** — verified against codebase; maintainability priority added.

This document captures product decisions, known gaps, security notes, and a prioritized roadmap. Use it alongside `REQUIREMENTS.md` (original spec) when picking up future work.

---

## Verified against codebase (2026-06-02)

| Area | Status |
|---|---|
| Next.js 16, HubSpot-only admin, no login | Confirmed |
| `/mhfa`, `/qpr` program listings + `/[program]/events/[id]` signup | Confirmed |
| Root `/` | Redirects to TCF marketing site (program chooser in `deprecated/program-chooser-home/`) |
| Signup → HubSpot; `502` on sync failure; `409` when full / duplicate | Confirmed |
| Full events: card disabled; detail page hides form when full/inactive | Confirmed |
| `profile-store` autofill (load on mount, save after success) | Confirmed |
| `CapacityIndicator` on cards + detail | Confirmed |
| Event-specific success page | Confirmed |
| SMS consent → HubSpot (`HUBSPOT_SMS_CONSENT_*`) | Confirmed |
| Vitest + `TESTING.md`; no `/preview` or mock signup routes | Confirmed |
| Listing sort | **Soonest upcoming first** (see [Sort order](#sort-order)) |
| Branding, SMS policy URLs, rate limiting, search/filters | Still open |
| **Non-developer maintainability** | **In progress** — `content/` + `MAINTENANCE.md` (see below) |

---

## Current state (summary)

The site is a **Next.js 16** public signup app. Events and registrations flow through **HubSpot** (custom training objects, contacts, company associations). There is no user login.

**Working today:**
- Program event listings at `/mhfa` and `/qpr` (HubSpot via `loadProgramEvents`, not a client fetch to `/api/events`)
- Event detail + signup at `/[program]/events/[id]`; form hidden when full or inactive
- Signup POST to `/api/signup` → HubSpot contact create/update + training association
- Public `GET /api/events` (still available for integrations or tooling)
- Pipeline stage/type filtering per program (`src/lib/programs/config.ts`)
- Form validation, phone formatting (+1 US-style), country code picker
- Success page after signup (`/[program]/events/[id]/success`) with event title/schedule
- Browser autofill via `src/lib/signup/profile-store.ts`
- Env vars configured locally and on Vercel

**Root `/`:** redirects to the TCF youth mental health program page on the main marketing site. HubSpot/marketing pages should link directly to `/mhfa` or `/qpr`.

**Not working / incomplete:** see [Known issues & gaps](#known-issues--gaps) below.

---

## Decisions (confirmed)

| Topic | Decision |
|---|---|
| HubSpot env vars | Set in local `.env` and Vercel |
| Event visibility | Filter by HubSpot pipeline stage/type — current approach is acceptable |
| Capacity | HubSpot calculates availability via contact ↔ training associations (specific label); site reads `available_capacity` |
| HubSpot sync failure | **User must see an error** (not silent success) |
| Form fields | **Final for now**; architecture should make adding fields straightforward |
| Local autofill | **Yes** — `profile-store.ts` prefills on mount and saves after successful submit |
| Multiple event signups | Allowed for now (pending team confirmation); server returns `409` if already registered for same event |
| Success UX | **Event-specific** confirmation page (`title`, schedule, links back to program) |
| Full events | Listing + detail: no signup when full/inactive — see [clarification](#full-event-behavior-clarification) |
| Event sort order | **Soonest upcoming first** (next session top-left); events without dates last |
| Non-developer maintainability | **Important** — routine updates (copy, nav, ops) should not require deep Next.js knowledge; see [maintainability](#non-developer-maintainability-important) |
| Search / filters | Not required for immediate launch — see [clarification below](#search--filters-clarification) |
| Mobile layout | Form fields should **stack on mobile** (email/phone, name, etc.) |
| Phone / international | Mostly US audience; +1-only display on closed country picker is fine |
| Admin | **HubSpot only** — no admin UI on this site |
| Confirmation emails | TBD — investigate HubSpot workflows |
| Multi-program split | **Done:** `/mhfa` and `/qpr`, separate pipeline env vars per program |
| Preview / mock routes | **Removed** — use `npm test` and manual HubSpot checks (`TESTING.md`) |
| Branding | Placeholders compiled below — team to supply real assets/links |

---

## Clarifications

### Full event behavior (clarification)

**Listing (`/[program]` + `EventCard`):** Full events show a “Full” badge; CTA is a disabled “Full” control (no link to signup).

**Event page (`/[program]/events/[id]`):** Notice shows “This event is full.” when applicable. The signup form is **not rendered** when `isFull` or inactive; users see “Registration is closed…” with a link back to the program list. Server still returns `409` on `/api/signup` if capacity is exceeded between page load and submit.

---

### Search & filters (clarification)

Original wireframes in `REQUIREMENTS.md` described optional listing controls:
- **Search** by keyword (title, location)
- **Filters** by date range, category, or location
- **Pagination** or “load more” for long lists

**None of this is built.** Each program page renders all pipeline-visible events in a grid.

**Recommendation:** Defer until event volume justifies it. Separate MHFA/QPR pages reduce the need for search initially.

---

### Sort order

Listings sort **soonest upcoming first** (ascending by `startDate` via `sortEventsForListing` in `src/lib/programs/sort.ts`). Events without a valid date appear last. Covered by unit tests in `src/lib/programs/sort.test.ts`.

*(Earlier doc wording “furthest future first” did not match implementation; decision updated to match shipped behavior.)*

---

### Non-developer maintainability (important)

**Goal:** A non-developer on the team can operate and lightly maintain the site without reading React/Next.js internals for routine work.

**In progress (2026-06-02):**
- ✅ User-facing copy in **`content/`** (`site.json`, `programs/mhfa.json`, `programs/qpr.json`) — see [`content/README.md`](content/README.md).
- ✅ Plain-language runbook: [`MAINTENANCE.md`](MAINTENANCE.md).
- ✅ Site chrome, SMS links, metadata, and program intros loaded from JSON via `src/lib/content/`.
- HubSpot still owns event titles, dates, capacity, and registrations.
- **Still developer-heavy:** form field labels, branding images/favicon, new form fields, new programs, HubSpot env mapping.

**Remaining:**
- Move form field labels into `content/` (optional).
- Logo/favicon in `public/` + Header image support.
- Expand `MAINTENANCE.md` as processes evolve.

Tracked in [Known issues & gaps](#known-issues--gaps).

---

## Security notes

HubSpot API key usage is **server-side only** (`src/lib/hubspot/api.ts`, API routes) — not exposed to the browser. This is correct.

### Low / acceptable risk
- **`GET /api/events`** is public — intentional for a public listing; only returns pipeline-filtered event fields.
- **Env vars on Vercel** — standard pattern; ensure production keys are scoped (private app token with minimal scopes).
- **No user accounts** — reduces auth complexity; all signups are anonymous form posts.

### Medium risk — consider hardening
- **`POST /api/signup` is unauthenticated** — open to spam, bot submissions, and quota abuse on HubSpot API. Mitigations to consider: rate limiting (Vercel middleware / Upstash), honeypot field, CAPTCHA (Turnstile/hCaptcha), server-side request logging.
- ~~**HubSpot failure returns success**~~ — **fixed:** signup returns `502` with a user-visible error when HubSpot sync fails.
- **Company association errors are swallowed** — signup succeeds even if university → company link fails; acceptable if non-critical, but worth monitoring.
- **Capacity race condition** — two simultaneous signups near capacity could both pass the pre-check; HubSpot association count is eventually consistent. Acceptable if HubSpot is source of truth, but edge cases possible.
- ~~**`/preview` and `/api/mock-signup`**~~ — removed; use Vitest + manual HubSpot testing instead.

### SSRF / internal fetch
- Homepage server-renders by fetching `{host}/api/events`. In typical Vercel deployment this is same-origin and fine. Avoid passing user-controlled host values into upstream fetches elsewhere.

### Privacy
- **`profile-store.ts`** stores PII in `localStorage` on the user’s device — document in privacy policy; no server-side persistence until submit.

---

## Branding & content placeholders

Team action needed — replace placeholders with real assets/links.

### Site chrome
| Location | Current | Needed |
|---|---|---|
| `Header.tsx` — logo | Text `"TCF"` | Official logo image + alt text |
| `Header.tsx` — nav | Empty `{/* nav links */}` | Nav items (e.g. MHFA home, QPR home, main site, contact) |
| `Footer.tsx` | `© TCF — Event Signup` | Full footer copy, links, address, social? |

### Metadata & assets (`layout.tsx`, `public/`)
| Item | Current | Needed |
|---|---|---|
| Page title / description | Generic “TCF Event Signup” / MHFA-focused description | Per-program titles when MHFA/QPR split; OG tags |
| Favicon | Default Next.js / none custom | TCF favicon (`public/favicon.ico` or app icon) |
| `public/` assets | Vercel/default SVGs only | Logo, any program imagery |

### Program listing / event copy
| Location | Current | Needed |
|---|---|---|
| `src/lib/programs/config.ts` | MHFA/QPR listing intro + signup notices | Team copy review; consider non-dev-friendly edit path |
| `[program]/events/[id]/page.tsx` — notice block | Program notices from config | HubSpot-driven description (optional) |
| `[program]/events/[id]/success/page.tsx` | Event-specific confirmation | — |

### Signup form
| Location | Current | Needed |
|---|---|---|
| SMS Terms link | `href="#"` | Real SMS terms URL |
| SMS Privacy Policy link | `href="#"` | Real SMS privacy policy URL |
| University website placeholder | `virginia.edu` | OK as example or update to neutral placeholder |

### Components not built (content TBD)
| Component | Notes |
|---|---|
| `EventCard` — image | Commented-out image placeholder |
| `EventDetails` — extras | `{/* host info, map, image, etc. */}` empty |

### Fonts
| Item | Current | Needed |
|---|---|---|
| Body font | Arial in CSS; Geist loaded in layout | Confirm brand typography vs Geist |

---

## HubSpot environment variables (reference)

Configured locally + Vercel. Do not commit values to git.

| Variable | Purpose |
|---|---|
| `HUBSPOT_API_KEY` | Private app token for CRM API |
| `HUBSPOT_MHFA_PIPELINE_STAGE` | MHFA training visibility filter |
| `HUBSPOT_MHFA_PIPELINE_TYPE` | MHFA pipeline (`hs_pipeline`) filter |
| `HUBSPOT_QPR_PIPELINE_STAGE` | QPR training visibility filter |
| `HUBSPOT_QPR_PIPELINE_TYPE` | QPR pipeline (`hs_pipeline`) filter |
| `HUBSPOT_TRAINING_OBJECT_ID` | Custom training object type (default `0-410`) |
| `HUBSPOT_TRAINING_PROPERTIES` | Comma-separated properties to fetch |
| `HUBSPOT_TRAINING_ASSOCIATION_LABEL` | Contact → training association type (default `registrant`) |
| `HUBSPOT_*_PROPERTY` | Contact field mappings (firstname, email, phone, etc.) |

**Legacy (MHFA fallback only):** `HUBSPOT_TRAINING_PIPELINE_STAGE` / `HUBSPOT_TRAINING_PIPELINE_TYPE` are used if the MHFA-specific vars are unset.

**Not yet mapped to HubSpot (collected in form):**
- ~~`smsConsent`~~ — mapped via `src/lib/hubspot/field-mappers.ts` (see `HUBSPOT_SMS_CONSENT_*` env vars)

**Removed from form but still in API types:**
- `trainingDates` — in `ContactData`; not on form

---

## Known issues & gaps

### Important (product / operations)
1. **Non-developer maintainability** — **started:** copy in `content/`; runbook in `MAINTENANCE.md`. Remaining: branding assets, form labels in JSON, optional nav entries in `site.json` → `nav`.

### Must-fix for production alignment — done
2. ~~Signup errors when HubSpot fails~~ — `502` on sync failure.
3. ~~Sort order~~ — soonest-upcoming-first via `sortEventsForListing` (tests in `sort.test.ts`).
4. ~~Full event page~~ — form hidden when full or inactive.
5. ~~Wire profile autofill~~ — `profile-store.ts` on form mount / after success.
6. ~~Remove mock/preview~~ — removed; see `TESTING.md`.

### Should-fix soon
7. ~~Unify data fetching~~ — `loadProgramEvents` in `src/lib/programs/events.ts`.
8. ~~CapacityIndicator~~ — on listing cards and event detail.
9. **Branding** — logo, favicon, nav, footer, SMS legal URLs still placeholders.
10. **Bot/spam protection** on `POST /api/signup` — not implemented.

### Multi-program (MHFA / QPR) — done
11. ~~`/mhfa` and `/qpr`~~ with per-program pipeline env vars.
12. ~~`ProgramListing`~~ with program-specific copy from config.

### Later / optional
13. Search/filters — only if event volume grows.
14. Confirmation emails — HubSpot workflow research (team).
15. Duplicate signup policy across events — team confirmation pending.

### Code quality
16. Reduce remaining `any` types (e.g. signup form error handling, HubSpot catch blocks).
17. ~~Core signup tests~~ — Vitest; see `TESTING.md`.
18. Document extensibility pattern for new form fields (partially in [Adding form fields](#adding-form-fields-extensibility-pattern); expand for non-dev readers).

---

## Recommended roadmap

> **Workflow:** One commit at a time; Ethan approves each commit before the next tranche of work begins.

### Phase 1 — Production correctness ✅
- Fail signup on HubSpot error
- Sort listings furthest-future-first
- Disable form on full events
- Wire localStorage autofill
- Strip/gate mock & preview for production → **Vitest** (`npm test`) + `TESTING.md`

### Phase 2 — Multi-program (MHFA / QPR) ✅
- Program config (pipeline env vars per program)
- `/mhfa` and `/qpr` listing routes
- Program-specific page copy and metadata
- Event detail/signup scoped to program (pipeline filter on fetch)
- Root `/` program chooser
- Shared components; signup form reused across programs

### Phase 3 — UX polish (mostly done)
- ~~Mobile stacking layout~~ (`grid-cols-1 sm:grid-cols-2` on form rows)
- ~~Event-specific success confirmation~~
- ~~SMS consent → HubSpot property~~ (`HUBSPOT_SMS_CONSENT_PROPERTY`, default `sms_consent`)
- Branding placeholders → real links/assets (**remaining**)

### Phase 4 — Maintainability, hardening & optional features
- **Non-developer maintainability** (copy centralization, runbook, HubSpot-first ops)
- Rate limiting / bot protection on `/api/signup`
- Search/filters if needed
- Monitoring (failed HubSpot sync alerts)

---

## Adding form fields (extensibility pattern)

When new fields are needed:

1. Add to `SignupFormData` in `src/lib/signup/format-fields.ts`
2. Add UI + validation in `src/components/signup/EventSignupForm.tsx`
3. Add server validation in `src/app/api/signup/route.ts`
4. Map property in `mapContactProperties()` in `src/lib/hubspot/api.ts` + env var for HubSpot property name
5. Include in `src/lib/signup/profile-store.ts` save/load if it should autofill
6. Update test fixtures in `src/test/fixtures/` when form fields change

Keep field labels, validation rules, and HubSpot mapping colocated or documented to avoid drift.

---

## Open items for team

- [ ] Confirm duplicate signups (same email, multiple events) policy
- [ ] HubSpot workflow for confirmation emails
- [x] QPR route naming and pipeline env var strategy — `/mhfa`, `/qpr`, separate env vars per program
- [ ] Provide SMS Terms + Privacy Policy URLs
- [ ] Provide logo, favicon, nav structure, footer content
- [ ] Decide bot/spam protection for public signup endpoint
- [ ] **Maintainability:** agree how non-developers update program copy, nav, and run routine checks (see [Non-developer maintainability](#non-developer-maintainability-important))

---

## Related files

| File | Role |
|---|---|
| `content/` | Editable site + program copy (JSON) |
| `content/README.md` | How to edit copy without code |
| `MAINTENANCE.md` | Plain-language ops runbook |
| `REQUIREMENTS.md` | Original spec, wireframes, open questions |
| `src/lib/content/` | Loads `content/*.json` for the app |
| `src/lib/hubspot/api.ts` | HubSpot CRM integration |
| `src/lib/hubspot/field-mappers.ts` | HubSpot option IDs, association helpers |
| `src/lib/signup/format-fields.ts` | Form normalization + phone formatting |
| `src/lib/signup/profile-store.ts` | Browser autofill (localStorage) |
| `src/lib/programs/config.ts` | MHFA/QPR program config and pipeline env |
| `src/lib/programs/events.ts` | Fetch and map trainings to app events |
| `src/lib/phone/country-codes.ts` | Country dial codes |
| `src/components/signup/EventSignupForm.tsx` | Signup form UI |
| `src/components/events/ProgramListing.tsx` | Program event listing |
| `src/app/api/signup/route.ts` | Signup endpoint |
| `src/app/api/events/route.ts` | Public event list API |
| `src/app/page.tsx` | Root redirect to marketing site |
| `deprecated/program-chooser-home/` | Archived `/` chooser (restore instructions in README) |
| `TESTING.md` | How to run automated tests and manual HubSpot checks |
| `src/test/fixtures/signup.ts` | Shared signup payloads for API tests |
| `vitest.config.ts` | Test runner configuration |
