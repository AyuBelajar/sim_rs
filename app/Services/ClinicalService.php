namespace App\Services;

use App\Models\OutpatientEncounter;
use App\Models\OutpatientRegistration;
use Illuminate\Support\Facades\DB;

class ClinicalService
{
    public function startEncounter(OutpatientRegistration $registration, int $doctorId): OutpatientEncounter
    {
        abort_if($registration->status === 'CANCELLED', 422, 'Pendaftaran dibatalkan.');

        return DB::transaction(function () use ($registration, $doctorId) {
            $encounter = OutpatientEncounter::firstOrCreate(
                ['outpatient_registration_id' => $registration->id],
                [
                    'doctor_id' => $doctorId,
                    'status' => 'IN_SERVICE',
                    'started_at' => now(),
                ]
            );

            $registration->update(['status' => 'IN_SERVICE']);

            return $encounter;
        });
    }

    public function createPrescription(OutpatientEncounter $encounter, array $data, ?int $staffId)
    {
        return DB::transaction(function () use ($encounter, $data, $staffId) {
            $prescription = $encounter->prescriptions()->create([
                'prescription_no' => 'RX-' . now()->format('YmdHis') . '-' . random_int(100, 999),
                'prescriber_id' => $staffId,
                'status' => 'FINAL',
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                $prescription->items()->create($item);
            }

            return $prescription->load('items');
        });
    }
}