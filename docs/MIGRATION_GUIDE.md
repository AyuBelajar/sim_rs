# Panduan Laravel Migration – SIMRS

Project ini menggunakan Laravel 13 dan migration SIMRS ditambahkan pada folder `database/migrations`.

## File migration baru

1. `2026_09_15_000100_add_simrs_columns_to_users_table.php`
2. `2026_09_15_000200_create_hospital_master_tables.php`
3. `2026_09_15_000300_create_staff_tables.php`
4. `2026_09_15_000400_create_patient_tables.php`
5. `2026_09_15_000500_create_schedule_and_booking_tables.php`
6. `2026_09_15_000600_create_outpatient_registration_tables.php`
7. `2026_09_15_000700_create_consent_and_bpjs_tables.php`
8. `2026_09_15_000800_create_clinical_tables.php`
9. `2026_09_15_000900_create_nursing_tables.php`
10. `2026_09_15_001000_create_billing_tables.php`
11. `2026_09_15_001100_create_audit_logs_table.php`

## Menjalankan migration

### Development database baru

```bash
php artisan migrate
```

Jika database development memang boleh dihapus seluruhnya:

```bash
php artisan migrate:fresh
```

Jangan memakai `migrate:fresh` pada database yang sudah memiliki data penting.

## Database

`.env.example` project saat ini menggunakan SQLite. Migration ini dibuat menggunakan Laravel Schema Builder agar tetap portable ke MySQL/MariaDB/PostgreSQL selama tipe data standar yang digunakan didukung.

Untuk MySQL/MariaDB contoh konfigurasi `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sim_rs
DB_USERNAME=root
DB_PASSWORD=
```

Lalu:

```bash
php artisan config:clear
php artisan migrate
```

## Catatan implementasi

- Isi master `hospital_units`, `payers`, `staff`, `doctor_profiles`, `medical_service_catalogs` sebelum transaksi pendaftaran digunakan.
- Nomor RM, nomor registrasi, kode booking, nomor billing, order penunjang dan resep sebaiknya dibuat oleh service khusus agar format nomor konsisten.
- Field sensitif seperti NIK, nomor kartu BPJS, signature path, dan response BPJS harus dibatasi aksesnya melalui authorization/policy Laravel.
- Password untuk otorisasi pembatalan tidak boleh disimpan pada `registration_cancellations` atau `audit_logs`.
- Gunakan database transaction saat membuat pendaftaran + booking conversion + bill awal, agar tidak terbentuk data setengah jadi.
