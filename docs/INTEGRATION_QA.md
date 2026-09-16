\# SIMRS Integration QA



\## Mandatory checks before merging a feature



\### Git

\- Branch based on latest main

\- No `.env` or local credential files committed

\- No unrelated files changed

\- Migration names do not conflict



\### Backend

\- `php artisan migrate:status`

\- `php artisan test`

\- API routes use authentication where required

\- RBAC is enforced on backend

\- Validation uses FormRequest or equivalent

\- API errors follow project convention

\- Sensitive values are not written to audit logs



\### Frontend

\- `npm run build`

\- Protected pages require authentication

\- Role-based pages use RoleRoute

\- Navigation only shows permitted modules

\- API calls use shared `api()` helper

\- Loading, empty, validation, and error states are handled



\### Database

\- Existing merged migrations are not edited

\- Schema changes use new migrations

\- Foreign keys match workflow dependencies

\- Delete behavior is intentional

\- Seeders do not contain production credentials



\## Module integration order



Ayu:

Master Data -> Doctor/Staff -> Schedule -> Quota



Ipeh:

Booking -> Registration -> Referral/Verification -> Consent



Sava:

Encounter -> Vitals -> SOAP -> Diagnosis -> Procedure -> Therapy/Orders



Vega:

Nursing -> BPJS -> Billing -> Payment -> Reports



\## Critical workflow



Patient

\-> Doctor Schedule / Quota

\-> Booking

\-> Registration

\-> Encounter

\-> Clinical Documentation

\-> Billing

\-> Completion



\## Roles



ADMIN:

Full administrative override.



FRONT\_OFFICE:

Patient, scheduling, booking, registration.



DOCTOR:

Clinical encounter and medical record.



NURSE:

Nursing workflow.



BILLING:

Billing and payment.



\## Final release gate



\- Fresh testing database migration succeeds

\- All backend tests pass

\- Frontend production build succeeds

\- Login/logout works

\- RBAC works

\- Patient CRUD works

\- Audit events are generated

\- Full outpatient workflow works

\- No debug data exposed in production

