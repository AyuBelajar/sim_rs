import {
    useAuth,
} from '../auth/AuthContext';

export function DashboardPage() {
    const {
        user,
    } = useAuth();

    return (
        <div>
            <h1 className="
                text-2xl
                font-bold
                text-slate-900
            ">
                Dashboard
            </h1>

            <p className="
                mt-1
                text-sm
                text-slate-500
            ">
                Selamat datang,
                {' '}
                {user?.name}.
            </p>

            <div className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-4
                mt-6
            ">
                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-xl
                    p-5
                ">
                    <div className="
                        text-xs
                        text-slate-500
                    ">
                        Status Sistem
                    </div>

                    <div className="
                        mt-2
                        text-lg
                        font-bold
                        text-green-600
                    ">
                        Online
                    </div>
                </div>

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-xl
                    p-5
                ">
                    <div className="
                        text-xs
                        text-slate-500
                    ">
                        Role
                    </div>

                    <div className="
                        mt-2
                        text-lg
                        font-bold
                        text-slate-800
                    ">
                        {user?.role}
                    </div>
                </div>

                <div className="
                    bg-white
                    border
                    border-slate-200
                    rounded-xl
                    p-5
                ">
                    <div className="
                        text-xs
                        text-slate-500
                    ">
                        Backend
                    </div>

                    <div className="
                        mt-2
                        text-lg
                        font-bold
                        text-cyan-700
                    ">
                        Laravel API
                    </div>
                </div>
            </div>
        </div>
    );
}