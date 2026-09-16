# SIMRS

Sistem Informasi Manajemen Rumah Sakit (SIMRS) berbasis Laravel dan React untuk mendukung proses administrasi pasien, penjadwalan dokter, pendaftaran rawat jalan, pelayanan klinis, keperawatan, billing, serta integrasi layanan rumah sakit.

## Technology Stack

### Backend

- PHP 8.3+
- Laravel 13
- Laravel Sanctum
- PostgreSQL
- Supabase

### Frontend

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router

## Main Modules

- Authentication and RBAC
- Patient Management
- Hospital Master Data
- Doctor and Staff Management
- Doctor Schedule and Quota
- Booking
- Outpatient Registration
- Clinical Encounter
- Medical Record
- Nursing
- Billing
- Reports
- Audit Logging

## Roles

The application currently supports:

- `ADMIN`
- `FRONT_OFFICE`
- `DOCTOR`
- `NURSE`
- `BILLING`

`ADMIN` acts as an administrative override for protected modules.

## Development Database

The shared development database uses PostgreSQL hosted on Supabase.

Database credentials must be stored only in `.env`.

Never commit:

```text
.env
.env.testing
database passwords
access tokens
Supabase secrets
```

## Important Database Safety

The shared Supabase database must never be used for destructive automated tests.

Do not run the following commands against the shared database:

```bash
php artisan migrate:fresh
php artisan migrate:fresh --seed
php artisan db:wipe
```

Always verify the active database configuration before executing destructive database commands.

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd sim_rs
```

Install PHP dependencies:

```bash
composer install
```

Install frontend dependencies:

```bash
npm install
```

Create the environment file:

Windows:

```powershell
Copy-Item .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Configure the Supabase PostgreSQL connection in `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=your-supabase-pooler-host
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=your-supabase-database-user
DB_PASSWORD=your-database-password
DB_SSLMODE=require
```

Clear cached configuration:

```bash
php artisan optimize:clear
```

Check the database connection and migration state:

```bash
php artisan migrate:status
```

Do not run new migrations against the shared database until the migration has been reviewed.

## Running the Application

Start Laravel:

```bash
php artisan serve
```

Start Vite in another terminal:

```bash
npm run dev
```

The default development URLs are:

```text
Laravel:
http://127.0.0.1:8000

Vite:
http://localhost:5173
```

## Development Seeders

Development users can be created using:

```bash
php artisan db:seed --class=DevelopmentUserSeeder
```

Current development roles include:

```text
ADMIN
FRONT_OFFICE
DOCTOR
NURSE
BILLING
```

Development credentials are intended only for development and must not be reused in production.

Other available seeders include:

```text
HospitalUnitSeeder
PayerSeeder
StaffDoctorSeeder
DoctorScheduleSeeder
DevelopmentPatientSeeder
```

Do not run all seeders blindly against the shared Supabase database.

## Automated Testing

Automated tests must use a database separate from the shared Supabase development database.

Create a local `.env.testing` and ensure it does not point to the shared Supabase instance.

Example:

```env
APP_ENV=testing

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simrs_test
DB_USERNAME=root
DB_PASSWORD=

CACHE_STORE=array
SESSION_DRIVER=array
QUEUE_CONNECTION=sync
```

Run tests:

```bash
php artisan test
```

The project uses `RefreshDatabase` in automated tests, so never point `.env.testing` at the shared development database.

## Production Build

Create the frontend production build:

```bash
npm run build
```

## Integration QA

On the Windows development environment, run:

```powershell
.\qa.ps1
```

The QA gate checks:

1. PHP availability
2. Laravel application startup
3. Migration status
4. Backend automated tests
5. Frontend production build

A feature should not be merged when the QA gate fails.

## API Convention

Successful single-resource responses use:

```json
{
    "data": {}
}
```

Laravel paginated resources use:

```json
{
    "data": [],
    "links": {},
    "meta": {}
}
```

Standard API errors use a `message` field.

Validation errors use:

```json
{
    "message": "Data yang diberikan tidak valid.",
    "errors": {}
}
```

## Authentication

API authentication uses Laravel Sanctum bearer tokens.

Protected backend routes use:

```text
auth:sanctum
```

Role-based backend routes additionally use the project's `role` middleware.

Frontend authentication and role protection use:

```text
AuthContext
ProtectedRoute
RoleRoute
```

## Audit Logging

Current audited events include:

```text
AUTH_LOGIN
AUTH_LOGOUT
PATIENT_CREATE
PATIENT_UPDATE
PATIENT_DELETE
```

Passwords and authentication tokens must never be stored in audit logs.

## Team Integration Order

The recommended module integration order is:

```text
Master Data
    ↓
Doctor Schedule / Quota
    ↓
Booking
    ↓
Outpatient Registration
    ↓
Clinical Encounter
    ↓
Nursing
    ↓
Billing
```

This order reflects dependencies between SIMRS modules.

## Production Notes

Production configuration must use:

```env
APP_ENV=production
APP_DEBUG=false
```

Before production deployment:

```bash
composer install --no-dev --optimize-autoloader
npm ci
npm run build
php artisan migrate --force
php artisan optimize
```

`php artisan migrate --force` is appropriate only after migration review and during an intentional deployment.

Never commit production credentials to Git.