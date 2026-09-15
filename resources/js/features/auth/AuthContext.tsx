import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

import {
    api,
    clearToken,
    getToken,
    setToken,
} from '../../api/http';

export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    staff: unknown | null;
};

type LoginResponse = {
    data: {
        token: string;
        user: User;
    };
};

type MeResponse = {
    data: User;
};

type AuthContextValue = {
    user: User | null;
    loading: boolean;

    login: (
        email: string,
        password: string,
    ) => Promise<void>;

    logout: () => Promise<void>;
};

const AuthContext =
    createContext<AuthContextValue | null>(null);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            setLoading(false);
            return;
        }

        api<MeResponse>('/api/auth/me')
            .then((response) => {
                setUser(response.data);
            })
            .catch(() => {
                clearToken();
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    async function login(
        email: string,
        password: string,
    ) {
        const response =
            await api<LoginResponse>(
                '/api/auth/login',
                {
                    method: 'POST',

                    body: JSON.stringify({
                        email,
                        password,
                    }),
                },
            );

        setToken(response.data.token);

        setUser(response.data.user);
    }

    async function logout() {
        try {
            await api(
                '/api/auth/logout',
                {
                    method: 'POST',
                },
            );
        } finally {
            clearToken();

            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth harus dipakai di dalam AuthProvider',
        );
    }

    return context;
}