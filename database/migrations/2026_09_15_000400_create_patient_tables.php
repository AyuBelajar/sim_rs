<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('medical_record_no', 40)->unique();
            $table->string('title', 20)->nullable();
            $table->string('full_name', 150)->index();
            $table->string('nickname', 80)->nullable();
            $table->string('nik', 20)->nullable()->unique();
            $table->string('gender', 20)->index();
            $table->string('birth_place', 120)->nullable();
            $table->date('birth_date')->index();
            $table->string('blood_type', 10)->nullable();
            $table->string('phone', 30)->nullable()->index();
            $table->string('email')->nullable();
            $table->string('religion', 50)->nullable();
            $table->string('education', 50)->nullable();
            $table->string('occupation', 80)->nullable();
            $table->string('marital_status', 40)->nullable();
            $table->string('employee_status', 40)->nullable();
            $table->string('registered_service', 40)->nullable();
            $table->text('special_notes')->nullable();
            $table->string('photo_path')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('patient_identifiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('identifier_type', 30); // KTP, SIM, PASPOR, KITAS, KITAP, KK, etc.
            $table->string('identifier_no', 100);
            $table->string('issued_country', 80)->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
            $table->unique(['identifier_type', 'identifier_no'], 'patient_identifier_unique');
        });

        Schema::create('patient_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('address_type', 30)->default('HOME');
            $table->text('address_line');
            $table->string('country', 80)->default('Indonesia');
            $table->string('province', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('district', 100)->nullable();
            $table->string('village', 100)->nullable();
            $table->string('rt', 10)->nullable();
            $table->string('rw', 10)->nullable();
            $table->string('postal_code', 15)->nullable();
            $table->boolean('is_primary')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('patient_guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('relationship', 50);
            $table->string('nik', 20)->nullable()->index();
            $table->string('phone', 30)->nullable();
            $table->text('address')->nullable();
            $table->boolean('same_address_as_patient')->default(false);
            $table->boolean('is_primary')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('patient_family_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('relationship', 50);
            $table->string('nik', 20)->nullable()->index();
            $table->string('phone', 30)->nullable();
            $table->boolean('is_emergency_contact')->default(false)->index();
            $table->timestamps();
        });

        Schema::create('patient_allergies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->string('allergen', 150);
            $table->string('allergy_type', 40)->nullable();
            $table->string('reaction', 150)->nullable();
            $table->string('severity', 30)->nullable();
            $table->string('status', 30)->default('ACTIVE')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('patient_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('payer_id')->constrained('payers')->restrictOnDelete();
            $table->string('policy_no', 100)->index();
            $table->string('member_name', 150)->nullable();
            $table->string('insurance_class', 50)->nullable();
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->boolean('is_primary')->default(false)->index();
            $table->string('status', 30)->default('ACTIVE')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->unique(['patient_id', 'payer_id', 'policy_no'], 'patient_policy_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_policies');
        Schema::dropIfExists('patient_allergies');
        Schema::dropIfExists('patient_family_members');
        Schema::dropIfExists('patient_guardians');
        Schema::dropIfExists('patient_addresses');
        Schema::dropIfExists('patient_identifiers');
        Schema::dropIfExists('patients');
    }
};
