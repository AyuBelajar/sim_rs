export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public payload?: unknown,
    ) {
        super(message);
    }
}

export function getToken(): string | null {
    return sessionStorage.getItem('simrs_token');
}

export function setToken(token: string): void {
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

export async function api<T>(
    url: string,
    init: RequestInit = {},
): Promise<T> {
    const token = getToken();

    const response = await fetch(url, {
        ...init,

        headers: {
            Accept: 'application/json',

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

    const payload =
        response.status === 204
            ? null
            : await response.json();

    if (!response.ok) {
        throw new ApiError(
            (payload as any)?.message ??
                'Terjadi kesalahan pada server.',
            response.status,
            payload,
        );
    }

    return payload as T;
}