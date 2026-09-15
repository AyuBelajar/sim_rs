import {
    Navigate,
} from 'react-router-dom';

import {
    useAuth,
} from './AuthContext';

type Props = {
    roles: string[];
    children: React.ReactNode;
};

export function RoleRoute({
    roles,
    children,
}: Props) {
    const {
        user,
        loading,
    } = useAuth();

    if (loading) {
        return (
            <div
                className="
                    min-h-[60vh]
                    flex
                    items-center
                    justify-center
                "
            >
                <span
                    className="
                        text-sm
                        text-slate-500
                    "
                >
                    Memeriksa akses...
                </span>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        user.role !== 'ADMIN' &&
        !roles.includes(user.role)
    ) {
        return (
            <Navigate
                to="/forbidden"
                replace
            />
        );
    }

    return children;
}