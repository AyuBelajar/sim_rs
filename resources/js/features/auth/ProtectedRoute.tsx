import {
    Navigate,
} from 'react-router-dom';

import {
    useAuth,
} from './AuthContext';

export function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const {
        user,
        loading,
    } = useAuth();

    if (loading) {
        return (
            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-slate-50
            ">
                <div className="
                    text-sm
                    text-slate-500
                ">
                    Memuat SIMRS...
                </div>
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

    return children;
}