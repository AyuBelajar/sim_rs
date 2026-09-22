<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\OutpatientBooking;
use App\Services\BookingService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookingService
    ) {
    }

    public function index(Request $request)
    {
        $bookings = OutpatientBooking::with(['patient', 'hospitalUnit', 'doctor.staff'])
            ->when($request->date, fn ($q, $v) => $q->whereDate('visit_date', $v))
            ->when($request->status, fn ($q, $v) => $q->where('status', $v))
            ->latest()
            ->paginate(10);

        return BookingResource::collection($bookings);
    }

    public function store(StoreBookingRequest $request)
    {
        $booking = $this->bookingService->create($request->validated(), $request->user());

        return (new BookingResource($booking))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Request $request, OutpatientBooking $booking)
    {
        $booking->update($request->only(['notes', 'status']));

        return new BookingResource($booking->fresh());
    }

    public function checkIn(OutpatientBooking $booking)
    {
        $booking = $this->bookingService->checkIn($booking);

        return new BookingResource($booking);
    }
}