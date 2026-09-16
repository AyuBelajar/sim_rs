<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PayerResource;
use App\Models\Payer;

class PayerController extends Controller
{
    public function index()
    {
        $payers = Payer::where('is_active', true)->orderBy('name')->get();

        return PayerResource::collection($payers);
    }
}