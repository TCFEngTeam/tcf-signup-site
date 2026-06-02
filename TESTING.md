# Testing

## Automated tests (Vitest)

Run the full unit and API test suite:

```bash
npm test
```

Watch mode during development:

```bash
npm run test:watch
```

### What is covered

| Area | Test file |
|---|---|
| Form normalization (names, email, phone, HubSpot yes/no) | `src/lib/signup/format-fields.test.ts` |
| Event list sorting | `src/lib/programs/sort.test.ts` |
| HubSpot field mappers (SMS consent IDs, duplicate association detection) | `src/lib/hubspot/field-mappers.test.ts` |
| Training object → app event mapping | `src/lib/programs/events.test.ts` |
| Program config (MHFA/QPR, pipeline env) | `src/lib/programs/config.test.ts` |
| Signup API validation and error paths (mocked HubSpot) | `src/app/api/signup/route.test.ts` |

Shared signup payloads live in `src/test/fixtures/signup.ts`.

### Adding tests

- Prefer testing **pure functions** in `src/lib/` without network calls.
- For API routes, **mock** `@/lib/hubspot/api` and `@/lib/programs/events` (see `route.test.ts`).
- Do not call the real HubSpot API in CI or local `npm test`.

## Manual / integration testing (HubSpot)

Requires `.env.local` with a valid `HUBSPOT_API_KEY` and pipeline variables.

1. `npm run dev`
2. Open `/mhfa` or `/qpr` (root `/` redirects to the marketing site)
3. Confirm events load from HubSpot (not empty unless pipeline stage is wrong)
4. Open an event → submit the form with a **new** email
5. Confirm redirect to `/{program}/events/{id}/success`
6. Submit again with the **same** email → should show “already registered” (409)
7. In HubSpot, verify contact properties and training association

### Pipeline troubleshooting

If no events appear, the training records may be in a different `hs_pipeline_stage` than your env vars. Use HubSpot to compare stage IDs with `HUBSPOT_*_PIPELINE_STAGE` in `.env.local`.

## Removed dev-only surfaces

The following were removed in favor of automated tests and real HubSpot manual checks:

- `/preview` UI page
- `/api/mock-signup`
- In-memory `_mockData` and mock event fallback
