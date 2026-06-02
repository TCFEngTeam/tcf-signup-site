# Cancel registration (`/unregister`)

## Flow

1. User opens `/unregister` (optionally `?program=mhfa&eventId=...` from HubSpot links).
2. User enters email → `POST /api/unregister/request`.
3. If they have multiple active registrations for that program, they pick a session.
4. Email is sent with a signed link to `/unregister/confirm?token=...` (each link includes a random id + HMAC signature).
5. Opening the link removes the **registrant** association in HubSpot (or relabels — see below).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `UNREGISTER_TOKEN_SECRET` | HMAC secret for confirmation links (long random string) |
| `UNREGISTER_TOKEN_TTL_HOURS` | Link expiry (default `48`) |
| `NEXT_PUBLIC_UNREGISTER_TOKEN_TTL_HOURS` | Shown on the form (optional, default `48`) |
| `NEXT_PUBLIC_APP_URL` | Base URL in emails (e.g. `https://signup.example.com`) |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Transactional email (in dev without these, the link is logged to the server console) |
| `UNREGISTER_HUBSPOT_MODE` | `remove` (default) or `relabel` |
| `HUBSPOT_TRAINING_CANCELLED_ASSOCIATION_LABEL` | Required for `relabel` — create this association label in HubSpot first |

## HubSpot modes

- **`remove`** — Archives only the `registrant` association. Frees capacity; no audit association.
- **`relabel`** — Archives `registrant`, then creates an association with `HUBSPOT_TRAINING_CANCELLED_ASSOCIATION_LABEL` (e.g. `cancelled_registration`) for reporting.

## HubSpot setup for `relabel`

1. Settings → Data Management → Objects → Training → Associations → Contact.
2. Add a label (e.g. `cancelled_registration`).
3. Set `HUBSPOT_TRAINING_CANCELLED_ASSOCIATION_LABEL` to that internal name.
4. Set `UNREGISTER_HUBSPOT_MODE=relabel`.

## Suggested HubSpot links

- MHFA cancel: `https://your-signup-app/unregister?program=mhfa`
- QPR cancel: `https://your-signup-app/unregister?program=qpr`
- Specific session: `.../unregister?program=mhfa&eventId={trainingRecordId}`
