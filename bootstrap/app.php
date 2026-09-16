<?php

use App\Http\Middleware\EnsureRole;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(
    basePath: dirname(__DIR__)
)
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(
        function (Middleware $middleware): void {
            $middleware->alias([
                'role' => EnsureRole::class,
            ]);
        }
    )
    ->withExceptions(
        function (Exceptions $exceptions): void {

            /*
             * Semua request API harus mendapat
             * response JSON.
             */
            $exceptions->shouldRenderJsonWhen(
                fn (Request $request) =>
                    $request->is('api/*') ||
                    $request->expectsJson()
            );

            /*
             * Standard API error response.
             */
            $exceptions->render(
                function (
                    Throwable $exception,
                    Request $request
                ) {

                    if (
                        !$request->is('api/*') &&
                        !$request->expectsJson()
                    ) {
                        return null;
                    }

                    /*
                     * 422 - Validation error
                     */
                    if (
                        $exception
                        instanceof ValidationException
                    ) {
                        return response()->json([
                            'message' =>
                                'Data yang diberikan tidak valid.',

                            'errors' =>
                                $exception->errors(),
                        ], 422);
                    }

                    /*
                     * 401 - Authentication error
                     */
                    if (
                        $exception
                        instanceof AuthenticationException
                    ) {
                        return response()->json([
                            'message' =>
                                'Unauthenticated.',
                        ], 401);
                    }

                    /*
                     * 403 - Authorization / RBAC
                     */
                    if (
                        $exception
                        instanceof AuthorizationException
                    ) {
                        return response()->json([
                            'message' =>
                                'Anda tidak memiliki akses untuk melakukan tindakan ini.',
                        ], 403);
                    }

                    /*
                     * 404 - Eloquent model not found
                     */
                    if (
                        $exception
                        instanceof ModelNotFoundException
                    ) {
                        return response()->json([
                            'message' =>
                                'Data tidak ditemukan.',
                        ], 404);
                    }

                    /*
                     * HTTP exceptions:
                     * 404 route
                     * 403 abort
                     * 405 method
                     * 429 throttle
                     * dll.
                     */
                    if (
                        $exception
                        instanceof HttpExceptionInterface
                    ) {
                        $status =
                            $exception->getStatusCode();

                        $message = match ($status) {
                            401 =>
                                'Unauthenticated.',

                            403 =>
                                'Anda tidak memiliki akses untuk melakukan tindakan ini.',

                            404 =>
                                'Endpoint atau data tidak ditemukan.',

                            405 =>
                                'Metode HTTP tidak diizinkan.',

                            429 =>
                                'Terlalu banyak permintaan. Silakan coba kembali.',

                            default =>
                                $exception->getMessage()
                                    ?: 'Permintaan tidak dapat diproses.',
                        };

                        return response()->json([
                            'message' => $message,
                        ], $status);
                    }

                    /*
                     * Saat development, Laravel tetap
                     * menampilkan detail debugging.
                     */
                    if (config('app.debug')) {
                        return null;
                    }

                    /*
                     * Production:
                     * jangan expose exception,
                     * SQL, stack trace, path, dll.
                     */
                    return response()->json([
                        'message' =>
                            'Terjadi kesalahan pada server.',
                    ], 500);
                }
            );
        }
    )
    ->create();