<?php

namespace App\Providers;

use App\Contracts\BpjsGateway;
use App\Services\Bpjs\MockBpjsGateway;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            BpjsGateway::class,
            MockBpjsGateway::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}