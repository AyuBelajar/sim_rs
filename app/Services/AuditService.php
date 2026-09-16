<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

class AuditService
{
    private const HIDDEN_KEYS = [
        'password',
        'password_confirmation',
        'token',
        'access_token',
        'remember_token',
    ];

    public function log(
        string $action,
        ?Model $model = null,
        array $old = [],
        array $new = [],
        ?int $userId = null,
    ): AuditLog {
        return AuditLog::create([
            'user_id' => $userId ?? auth()->id(),

            'action' => $action,

            'auditable_type' => $model
                ? $model::class
                : null,

            'auditable_id' => $model?->getKey(),

            'old_values' => $this->sanitize($old),

            'new_values' => $this->sanitize($new),

            'ip_address' => request()->ip(),

            'user_agent' => request()->userAgent(),
        ]);
    }

    private function sanitize(array $data): ?array
    {
        if ($data === []) {
            return null;
        }

        foreach (self::HIDDEN_KEYS as $key) {
            unset($data[$key]);
        }

        return $data ?: null;
    }
}