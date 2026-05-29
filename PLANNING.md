# TCF Event Signup Site — Planning & Context

Last updated: planning session after initial MHFA signup implementation.

This document captures product decisions, known gaps, security notes, and a prioritized roadmap. Use it alongside `REQUIREMENTS.md` (original spec) when picking up future work.

---

## Current state (summary)

The site is a **Next.js 16** public signup app. Events and registrations flow through **HubSpot** (custom training objects, contacts, company associations). There is no user login.

**Working today:**
- Homepage event listing (via `/api/events`)
- Event detail + signup form (`/events/[id]`)
- Signup POST to `/api/signup` → HubSpot contact create/update + training association
- Pipeline stage/type filtering for visible events
- Form field validation, phone formatting (+1 US-style), country code picker
- Success page redirect after signup (`/events/success`)
- Env vars configured locally and on Vercel

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
| Local autofill | **Yes** — wire `localProfileStore` to prefill/save on submit |
| Multiple event signups | Allowed for now (pending team confirmation) |
| Success UX | Generic success page today; **event-specific confirmation** is desired |
| Full events | Partial today — see [clarification below](#full-event-behavior-clarification) |
| Event sort order | **Furthest future first** (latest date top-left) |
| Search / filters | Not required for immediate launch — see [clarification below](#search--filters-clarification) |
| Mobile layout | Form fields should **stack on mobile** (email/phone, name, etc.) |
| Phone / international | Mostly US audience; +1-only display on closed country picker is fine |
| Admin | **HubSpot only** — no admin UI on this site |
| Confirmation emails | TBD — investigate HubSpot workflows |
| Multi-program split | **Upcoming:** separate front pages for **MHFA** vs **QPR** trainings, each with its own HubSpot pipeline designation |
| Preview / mock routes | **Disable in production**; remove current preview/mock implementation and replace with better dev-only testing approach |
| Branding | Placeholders compiled below — team to supply real assets/links |

---

## Clarifications

### Full event behavior (clarification)

**Listing page (`/` + `EventCard`):** When an event is full, the card shows a “Full” badge and the signup button is replaced with a disabled “Full” control. Users cannot navigate to signup from the card CTA.

**Event page (`/events/[id]`):** Shows a “This event is full.” message in the notice area, **but the signup form is still rendered**. The form only blocks submission when:
- the client re-checks `/api/events` before POST, or
- the server returns `409` from `/api/signup`.

**Gap to close:** Hide or disable the form on the event page when full (matching listing behavior), not only on submit.

---

### Search & filters (clarification)

Original wireframes in `REQUIREMENTS.md` described optional listing controls:
- **Search** by keyword (title, location)
- **Filters** by date range, category, or location
- **Pagination** or “load more” for long lists

**None of this is built.** The homepage renders all pipeline-visible events in a grid.

**Recommendation:** Defer until event volume justifies it. If MHFA and QPR split onto separate pages (each with its own pipeline filter), search may be unnecessary initially.

---

### Sort order

Listings sort **furthest future first** (descending by `startDate`) so the latest upcoming session appears top-left. Events without a valid date appear last.

~~Homepage currently sorts **latest date first** (descending):~~ *(superseded by program listing pages)*

---

## Security notes

HubSpot API key usage is **server-side only** (`hubspotApi.ts`, API routes) — not exposed to the browser. This is correct.

### Low / acceptable risk
- **`GET /api/events`** is public — intentional for a public listing; only returns pipeline-filtered event fields.
- **Env vars on Vercel** — standard pattern; ensure production keys are scoped (private app token with minimal scopes).
- **No user accounts** — reduces auth complexity; all signups are anonymous form posts.

### Medium risk — consider hardening
- **`POST /api/signup` is unauthenticated** — open to spam, bot submissions, and quota abuse on HubSpot API. Mitigations to consider: rate limiting (Vercel middleware / Upstash), honeypot field, CAPTCHA (Turnstile/hCaptcha), server-side request logging.
- **HubSpot failure returns success today** — users may believe they registered when HubSpot did not persist data. **Must change to fail-closed** per product decision (return 5xx/4xx with clear message).
- **Company association errors are swallowed** — signup succeeds even if university → company link fails; acceptable if non-critical, but worth monitoring.
- **Capacity race condition** — two simultaneous signups near capacity could both pass the pre-check; HubSpot association count is eventually consistent. Acceptable if HubSpot is source of truth, but edge cases possible.
- **`/preview` and `/api/mock-signup`** — if deployed to production, expose fake signup surface and in-memory mutation. **Remove or gate behind dev-only** before launch.

### SSRF / internal fetch
- Homepage server-renders by fetching `{host}/api/events`. In typical Vercel deployment this is same-origin and fine. Avoid passing user-controlled host values into upstream fetches elsewhere.

### Privacy
- **`localProfileStore`** (when wired) stores PII in `localStorage` on the user’s device — document in privacy policy; no server-side persistence until submit.

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

### Homepage / event copy
| Location | Current | Needed |
|---|---|---|
| `page.tsx` — hero | Hard-coded MHFA 8-hour course copy | MHFA-specific page copy; separate QPR copy on future route |
| `events/[id]/page.tsx` — notice block | Same MHFA boilerplate on every event | Program-specific or HubSpot-driven description |
| `events/success/page.tsx` | Generic “what happens next” | Event-specific details when implemented |

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
- `smsConsent` — form field exists; no `hubspotApi` mapping yet

**Removed from form but still in API types:**
- `trainingDates` — in `ContactData`; not on form

---

## Known issues & gaps

### Must-fix for production alignment
1. ~~**Signup should error when HubSpot fails**~~ — returns `502` on HubSpot sync failure.
2. ~~**Sort order**~~ — furthest-future-first via `sortEventsForListing`.
3. ~~**Full event page**~~ — form hidden when event is full or inactive.
4. ~~**Wire `localProfileStore`**~~ — load on mount, save after successful submit.
5. ~~**Remove mock/preview from production**~~ — dev-only via `isDevMockEnabled()`.

### Should-fix soon (can interleave with Phase 1–2)
6. ~~**Unify data fetching**~~ — shared `loadProgramEvents` in `src/lib/programEvents.ts`.
7. ~~**Use `CapacityIndicator`**~~ — on listing cards and event detail pages.

### Multi-program (MHFA / QPR) — next priority
11. ~~**Split homepage**~~ — `/mhfa` and `/qpr` with separate pipeline env vars.
12. ~~Shared event listing component~~ — `ProgramListing` with program-specific copy.

### After multi-program / UX polish
13. ~~Mobile stacking layout~~ — form fields stack on small screens. Event-specific success page. ~~SMS consent mapping~~. Branding assets still pending.
14. Search/filters — only if event volume grows.
15. Confirmation emails — HubSpot workflow research.
16. Better dev testing — replace preview page with Storybook, dedicated test fixtures, or env-gated routes.

### Code quality
17. Reduce `any` types on homepage event list.
18. Add tests for `formatSignupFields`, signup API validation, phone parsing.
19. Document extensibility pattern for new form fields (single source of truth for field list + HubSpot mapping).

---

## Recommended roadmap

> **Workflow:** One commit at a time; Ethan approves each commit before the next tranche of work begins.

### Phase 1 — Production correctness ✅
- Fail signup on HubSpot error
- Sort listings furthest-future-first
- Disable form on full events
- Wire localStorage autofill
- Strip/gate mock & preview for production

### Phase 2 — Multi-program (MHFA / QPR) ✅
- Program config (pipeline env vars per program)
- `/mhfa` and `/qpr` listing routes
- Program-specific page copy and metadata
- Event detail/signup scoped to program (pipeline filter on fetch)
- Root `/` program chooser
- Shared components; signup form reused across programs

### Phase 3 — UX polish (in progress)
- ~~Mobile stacking layout~~
- ~~Event-specific success confirmation~~
- ~~SMS consent → HubSpot property~~ (`HUBSPOT_SMS_CONSENT_PROPERTY`, default `sms_consent`)
- Branding placeholders → real links/assets

### Phase 4 — Hardening & optional features
- Rate limiting / bot protection on `/api/signup`
- Search/filters if needed
- Dev testing infrastructure rewrite
- Monitoring (failed HubSpot sync alerts)

---

## Adding form fields (extensibility pattern)

When new fields are needed:

1. Add to `SignupFormData` in `src/lib/formatSignupFields.ts`
2. Add UI + validation in `EventSignupForm.tsx`
3. Add server validation in `src/app/api/signup/route.ts`
4. Map property in `mapContactProperties()` in `src/lib/hubspotApi.ts` + env var for HubSpot property name
5. Include in `localProfileStore` save/load if it should autofill
6. Update preview/test fixtures if any remain

Keep field labels, validation rules, and HubSpot mapping colocated or documented to avoid drift.

---

## Open items for team

- [ ] Confirm duplicate signups (same email, multiple events) policy
- [ ] HubSpot workflow for confirmation emails
- [x] QPR route naming and pipeline env var strategy — `/mhfa`, `/qpr`, separate env vars per program
- [ ] Provide SMS Terms + Privacy Policy URLs
- [ ] Provide logo, favicon, nav structure, footer content
- [ ] Decide bot/spam protection for public signup endpoint

---

## Related files

| File | Role |
|---|---|
| `REQUIREMENTS.md` | Original spec, wireframes, open questions |
| `src/lib/hubspotApi.ts` | HubSpot CRM integration |
| `src/lib/formatSignupFields.ts` | Form normalization + phone formatting |
| `src/lib/localProfileStore.ts` | Browser autofill (not wired yet) |
| `src/lib/phoneCountryCodes.ts` | Country dial codes (from [gist](https://gist.github.com/gugazimmermann/635dac160396fc9b5e5d75d1b03c1194)) |
| `src/app/api/signup/route.ts` | Signup endpoint |
| `src/app/api/events/route.ts` | Public event list |
| `src/app/api/_mockData.ts` | **Remove** for production |
| `src/app/preview/page.tsx` | **Remove/replace** for production |
