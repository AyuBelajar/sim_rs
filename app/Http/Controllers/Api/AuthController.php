<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private AuditService $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])
            ->first();

        if (
            !$user ||
            !$user->is_active ||
            !Hash::check(
                $credentials['password'],
                $user->password
            )
        ) {
            throw ValidationException::withMessages([
                'email' => [
                    'Email atau password tidak valid, atau akun tidak aktif.'
                ],
            ]);
        }

        $user->update([
            'last_login_at' => now(),
        ]);

        // Audit login sukses
        $this->auditService->log(
            action: 'AUTH_LOGIN',
            model: $user,
            new: [
                'email' => $user->email,
                'role' => $user->role,
            ],
            userId: $user->id,
        );

        $token = $user
            ->createToken('simrs-web')
            ->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'staff' => $user->staff,
                ],
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()
            ->load('staff');

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'staff' => $user->staff,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        // Audit logout sebelum token dihapus
        $this->auditService->log(
            action: 'AUTH_LOGOUT',
            model: $user,
            new: [
                'email' => $user->email,
                'role' => $user->role,
            ],
            userId: $user->id,
        );

        $user
            ->currentAccessToken()
            ?->delete();

        return response()->noContent();
    }
}