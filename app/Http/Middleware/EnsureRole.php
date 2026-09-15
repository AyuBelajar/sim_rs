<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(
        Request $request,
        Closure $next,
        ...$roles
    ): Response {
        $user = $request->user();

        abort_unless(
            $user &&
            (
                $user->role === 'ADMIN' ||
                in_array($user->role, $roles, true)
            ),
            403,
            'Anda tidak memiliki akses ke modul ini.'
        );

        return $next($request);
    }
}