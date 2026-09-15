import {
    NavLink,
    Outlet,
} from 'react-router-dom';

import {
    useAuth,
} from '../features/auth/AuthContext';

const menus = [
    {
        label: 'Dashboard',
        to: '/',
    },
    {
        label: 'Pasien',
        to: '/patients',
    },
    {
        label: 'Pendaftaran Rawat Jalan',
        to: '/admission/outpatient',
    },
    {
        label: 'Rawat Jalan',
        to: '/clinical',
    },
    {
        label: 'Rekam Medis',
        to: '/medical-record',
    },
    {
        label: 'Billing',
        to: '/billing',
    },
    {
        label: 'Laporan',
        to: '/reports',
    },
];

export function AppLayout() {
    const {
        user,
        logout,
    } = useAuth();

    async function handleLogout() {
        await logout();

        window.location.href =
            '/login';
    }

    return (
        <div className="
            min-h-screen
            flex
            bg-slate-100
        ">
            <aside
                className="
                    w-64
                    shrink-0
                    text-white
                    min-h-screen
                    fixed
                    left-0
                    top-0
                "
                style={{
                    background:
                        '#093C5D',
                }}
            >
                <div className="
                    h-16
                    flex
                    items-center
                    px-5
                    border-b
                    border-white/10
                ">
                    <div>
                        <div className="
                            font-bold
                            text-lg
                        ">
                            SIMRS
                        </div>

                        <div className="
                            text-[10px]
                            text-slate-300
                        ">
                            Rumah Sakit
                        </div>
                    </div>
                </div>

                <nav className="
                    px-3
                    py-5
                    space-y-1
                ">
                    {menus.map(
                        (menu) => (
                            <NavLink
                                key={
                                    menu.to
                                }
                                to={
                                    menu.to
                                }
                                end={
                                    menu.to ===
                                    '/'
                                }
                                className={({
                                    isActive,
                                }) =>
                                    `
                                    block
                                    rounded-lg
                                    px-3
                                    py-2.5
                                    text-sm
                                    transition-colors
                                    ${
                                        isActive
                                            ? 'bg-white/15 text-white'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                    }
                                    `
                                }
                            >
                                {
                                    menu.label
                                }
                            </NavLink>
                        ),
                    )}
                </nav>
            </aside>

            <div className="
                flex-1
                ml-64
                min-w-0
            ">
                <header className="
                    h-16
                    bg-white
                    border-b
                    border-slate-200
                    flex
                    items-center
                    justify-between
                    px-6
                    sticky
                    top-0
                    z-20
                ">
                    <div>
                        <div className="
                            text-sm
                            font-semibold
                            text-slate-800
                        ">
                            Sistem Informasi
                            Manajemen Rumah Sakit
                        </div>
                    </div>

                    <div className="
                        flex
                        items-center
                        gap-4
                    ">
                        <div className="
                            text-right
                        ">
                            <div className="
                                text-sm
                                font-medium
                                text-slate-700
                            ">
                                {user?.name}
                            </div>

                            <div className="
                                text-xs
                                text-slate-400
                            ">
                                {user?.role}
                            </div>
                        </div>

                        <button
                            onClick={
                                handleLogout
                            }
                            className="
                                border
                                border-slate-200
                                rounded-lg
                                px-3
                                py-2
                                text-xs
                                font-medium
                                text-slate-600
                                hover:bg-slate-50
                            "
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main className="
                    p-6
                    min-h-[calc(100vh-4rem)]
                ">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}