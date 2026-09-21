<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Registration\StoreOutpatientRegistrationRequest;
use App\Http\Resources\OutpatientRegistrationResource;
use App\Services\OutpatientRegistrationService;
use Illuminate\Http\Request;

class OutpatientRegistrationController extends Controller
{
    public function __construct(
        private readonly OutpatientRegistrationService $registrationService
    ) {
    }

    public function index(Request $request)
    {
        $registrations = $this->registrationService->paginate(
            $request->only(['search', 'status', 'date', 'per_page'])
        );

        return OutpatientRegistrationResource::collection($registrations)
            ->additional([
                'stats' => $this->registrationService->todayStats(),
            ]);
    }

    public function store(StoreOutpatientRegistrationRequest $request)
    {
        $registration = $this->registrationService->create($request->validated());

        return (new OutpatientRegistrationResource($registration))
            ->response()
            ->setStatusCode(201);
    }
}