export type ValidationErrors =
    Record<string, string[]>;

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public payload?: unknown,
    ) {
        super(message);

        this.name = 'ApiError';
    }
}

export function getToken(): string | null {
    return sessionStorage.getItem(
        'simrs_token',
    );
}

export function setToken(
    token: string,
): void {
    sessionStorage.setItem(
        'simrs_token',
        token,
    );
}

export function clearToken(): void {
    sessionStorage.removeItem(
        'simrs_token',
    );
}

function isObject(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === 'object' &&
        value !== null
    );
}

function getErrorMessage(
    payload: unknown,
): string | null {
    if (
        isObject(payload) &&
        typeof payload.message === 'string'
    ) {
        return payload.message;
    }

    return null;
}

export function getValidationErrors(
    error: unknown,
): ValidationErrors {
    if (
        !(error instanceof ApiError) ||
        error.status !== 422 ||
        !isObject(error.payload)
    ) {
        return {};
    }

    const errors = error.payload.errors;

    if (!isObject(errors)) {
        return {};
    }

    const result: ValidationErrors = {};

    Object.entries(errors).forEach(
        ([field, messages]) => {
            if (
                Array.isArray(messages) &&
                messages.every(
                    (message) =>
                        typeof message === 'string',
                )
            ) {
                result[field] =
                    messages as string[];
            }
        },
    );

    return result;
}

export async function api<T>(
    url: string,
    init: RequestInit = {},
): Promise<T> {
    const token = getToken();

    let response: Response;

    try {
        response = await fetch(url, {
            ...init,

            headers: {
                Accept:
                    'application/json',

                ...(init.body
                    ? {
                        'Content-Type':
                            'application/json',
                    }
                    : {}),

                ...(token
                    ? {
                        Authorization:
                            `Bearer ${token}`,
                    }
                    : {}),

                ...(init.headers ?? {}),
            },
        });
    } catch (error) {
        throw new ApiError(
            'Tidak dapat terhubung ke server.',
            0,
            error,
        );
    }

    let payload: unknown = null;

    if (response.status !== 204) {
        const contentType =
            response.headers.get(
                'content-type',
            ) ?? '';

        if (
            contentType.includes(
                'application/json',
            )
        ) {
            payload =
                await response.json();
        } else {
            payload =
                await response.text();
        }
    }

    if (!response.ok) {
        throw new ApiError(
            getErrorMessage(payload) ??
                'Terjadi kesalahan pada server.',
            response.status,
            payload,
        );
    }

    return payload as T;
}