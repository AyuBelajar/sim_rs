<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDoctorScheduleRequest;
use App\Http\Resources\DoctorScheduleResource;
use App\Models\DoctorSchedule;
use App\Models\DoctorScheduleQuota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DoctorScheduleController extends Controller
{
    public function index(Request $request)
    {
        $schedules = DoctorSchedule::query()
            ->with(['doctor.staff', 'hospitalUnit', 'quotas'])
            ->when($request->date, fn ($q, $v) => $q->whereDate('schedule_date', $v))
            ->when($request->hospital_unit_id, fn ($q, $v) => $q->where('hospital_unit_id', $v))
            ->when($request->doctor_id, fn ($q, $v) => $q->where('doctor_id', $v))
            ->orderBy('schedule_date')
            ->orderBy('start_time')
            ->get();

        return DoctorScheduleResource::collection($schedules);
    }

    public function store(StoreDoctorScheduleRequest $request)
    {
        $schedule = DB::transaction(function () use ($request) {
            $data = $request->validated();

            $schedule = DoctorSchedule::create([
                'doctor_id' => $data['doctor_id'],
                'hospital_unit_id' => $data['hospital_unit_id'],
                'schedule_date' => $data['schedule_date'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($data['quotas'] as $quota) {
                $schedule->quotas()->create([
                    'channel' => $quota['channel'],
                    'payer_group' => $quota['payer_group'],
                    'quota_total' => $quota['quota_total'],
                    'quota_used' => 0,
                ]);
            }

            return $schedule;
        });

        return (new DoctorScheduleResource($schedule->load(['doctor.staff', 'hospitalUnit', 'quotas'])))
            ->response()->setStatusCode(201);
    }

    /**
     * Dipanggil Ipeh (Booking) untuk menambah quota_used saat booking dibuat,
     * atau menguranginya saat booking dibatalkan.
     */
    public function updateQuota(Request $request, DoctorSchedule $schedule, DoctorScheduleQuota $quota)
    {
        $request->validate([
            'action' => ['required', 'in:increment,decrement'],
        ]);

        if ($quota->doctor_schedule_id !== $schedule->id) {
            abort(404);
        }

        $updated = DB::transaction(function () use ($quota, $request) {
            $quota->refresh();

            if ($request->action === 'increment') {
                if ($quota->quota_used >= $quota->quota_total) {
                    abort(422, 'Kuota sudah penuh.');
                }
                $quota->increment('quota_used');
            } else {
                $quota->decrement('quota_used', min(1, $quota->quota_used));
            }

            return $quota;
        });

        return response()->json(['data' => [
            'id' => $updated->id,
            'quota_total' => $updated->quota_total,
            'quota_used' => $updated->quota_used,
            'is_full' => $updated->is_full,
        ]]);
    }
}