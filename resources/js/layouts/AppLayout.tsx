import {
    NavLink,
    Outlet,
    useLocation,
} from 'react-router-dom';

import {
    BarChart3,
    Bell,
    CalendarDays,
    ChevronDown,
    ClipboardList,
    Database,
    FileHeart,
    HeartPulse,
    LayoutDashboard,
    LogOut,
    Menu,
    ReceiptText,
    Search,
    Stethoscope,
    UserRoundPlus,
    Users,
} from 'lucide-react';

import {
    useAuth,
} from '../features/auth/AuthContext';

import {
    canAccessNavigation,
    navigationItems,
    type NavigationItem,
} from '../config/navigation';

type MenuGroup = {
    label?: string;
    paths: string[];
};

const menuGroups: MenuGroup[] = [
    {
        paths: ['/'],
    },
    {
        label: 'ADMISI',
        paths: [
            '/patients',
            '/schedules',
            '/bookings',
            '/admission/outpatient',
        ],
    },
    {
        label: 'PELAYANAN',
        paths: [
            '/clinical',
            '/medical-record',
            '/nursing',
        ],
    },
    {
        label: 'ADMINISTRASI',
        paths: [
            '/master-data',
            '/billing',
            '/reports',
        ],
    },
];

const menuIcons = {
    '/': LayoutDashboard,
    '/patients': Users,
    '/master-data': Database,
    '/schedules': CalendarDays,
    '/bookings': ClipboardList,
    '/admission/outpatient': UserRoundPlus,
    '/clinical': Stethoscope,
    '/medical-record': FileHeart,
    '/nursing': HeartPulse,
    '/billing': ReceiptText,
    '/reports': BarChart3,
};

export function AppLayout() {
    const {
        user,
        logout,
    } = useAuth();

    const location = useLocation();

    const menus =
        user
            ? navigationItems.filter(
                  (menu) =>
                      canAccessNavigation(
                          user.role,
                          menu.roles,
                      ),
              )
            : [];

    async function handleLogout() {
        await logout();

        window.location.href =
            '/login';
    }

    function getMenusByPaths(
        paths: string[],
    ): NavigationItem[] {
        return paths
            .map((path) =>
                menus.find(
                    (menu) =>
                        menu.to === path,
                ),
            )
            .filter(
                (
                    menu,
                ): menu is NavigationItem =>
                    Boolean(menu),
            );
    }

    const currentMenu =
        menus.find((menu) => {
            if (menu.to === '/') {
                return (
                    location.pathname === '/'
                );
            }

            return location.pathname.startsWith(
                menu.to,
            );
        });

    const pageTitle =
        currentMenu?.label ??
        'Dashboard';

    const initials =
        user?.name
            ?.split(' ')
            .map((name) => name[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() ??
        'AD';

    return (
        <div
            className="
                min-h-screen
                bg-slate-50
            "
        >
            {/* SIDEBAR */}
            <aside
                className="
                    fixed
                    left-0
                    top-0
                    z-40
                    flex
                    h-screen
                    w-64
                    flex-col
                    text-white
                "
                style={{
                    background:
                        'linear-gradient(180deg, #093C5D 0%, #07344F 100%)',
                }}
            >
                {/* HOSPITAL BRAND */}
                <div
                    className="
                        flex
                        h-[86px]
                        shrink-0
                        items-center
                        gap-3
                        border-b
                        border-white/10
                        px-5
                    "
                >
                    <div
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-xl
                            bg-white
                            p-1.5
                            shadow-sm
                        "
                    >
                        <img
                            src="/images/logo-harapan-indonesia.png"
                            alt="Logo Rumah Sakit Harapan Indonesia"
                            className="
                                h-full
                                w-full
                                object-contain
                            "
                        />
                    </div>

                    <div className="min-w-0">
                        <div
                            className="
                                text-[15px]
                                font-bold
                                leading-[1.15]
                                text-white
                            "
                        >
                            Rumah Sakit
                            <br />
                            Harapan Indonesia
                        </div>

                        <div
                            className="
                                mt-1
                                text-[9px]
                                font-medium
                                uppercase
                                tracking-[0.16em]
                                text-cyan-100/60
                            "
                        >
                            SIMRS
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav
                    className="
                        flex-1
                        overflow-y-auto
                        px-3
                        py-5
                    "
                >
                    {menuGroups.map(
                        (
                            group,
                            groupIndex,
                        ) => {
                            const groupMenus =
                                getMenusByPaths(
                                    group.paths,
                                );

                            if (
                                groupMenus.length ===
                                0
                            ) {
                                return null;
                            }

                            return (
                                <div
                                    key={
                                        group.label ??
                                        `group-${groupIndex}`
                                    }
                                    className={
                                        groupIndex === 0
                                            ? ''
                                            : 'mt-6'
                                    }
                                >
                                    {group.label && (
                                        <div
                                            className="
                                                mb-2
                                                px-3
                                                text-[10px]
                                                font-semibold
                                                tracking-[0.16em]
                                                text-slate-400
                                            "
                                        >
                                            {
                                                group.label
                                            }
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        {groupMenus.map(
                                            (
                                                menu,
                                            ) => {
                                                const Icon =
                                                    menuIcons[
                                                        menu.to as keyof typeof menuIcons
                                                    ] ??
                                                    Menu;

                                                return (
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
                                                                group
                                                                flex
                                                                items-center
                                                                gap-3
                                                                rounded-xl
                                                                px-3
                                                                py-2.5
                                                                text-sm
                                                                font-medium
                                                                transition-all
                                                                duration-200
                                                                ${
                                                                    isActive
                                                                        ? 'bg-[#5DF8D8] text-[#093C5D] shadow-sm'
                                                                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                                                }
                                                            `
                                                        }
                                                    >
                                                        {({
                                                            isActive,
                                                        }) => (
                                                            <>
                                                                <Icon
                                                                    size={
                                                                        18
                                                                    }
                                                                    strokeWidth={
                                                                        isActive
                                                                            ? 2.3
                                                                            : 1.9
                                                                    }
                                                                    className="shrink-0"
                                                                />

                                                                <span className="truncate">
                                                                    {
                                                                        menu.label
                                                                    }
                                                                </span>
                                                            </>
                                                        )}
                                                    </NavLink>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            );
                        },
                    )}
                </nav>

                {/* SIDEBAR FOOTER */}
                <div
                    className="
                        border-t
                        border-white/10
                        p-3
                    "
                >
                    <div
                        className="
                            mb-2
                            px-3
                            text-[9px]
                            uppercase
                            tracking-[0.14em]
                            text-slate-500
                        "
                    >
                        Rumah Sakit Harapan Indonesia
                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            bg-white/5
                            px-3
                            py-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-white/10
                                text-xs
                                font-bold
                                text-white
                            "
                        >
                            {initials}
                        </div>

                        <div
                            className="
                                min-w-0
                                flex-1
                            "
                        >
                            <div
                                className="
                                    truncate
                                    text-xs
                                    font-semibold
                                    text-white
                                "
                            >
                                {user?.name}
                            </div>

                            <div
                                className="
                                    truncate
                                    text-[10px]
                                    text-slate-400
                                "
                            >
                                {user?.role}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN AREA */}
            <div
                className="
                    min-h-screen
                    min-w-0
                    pl-64
                "
            >
                {/* HEADER */}
                <header
                    className="
                        sticky
                        top-0
                        z-30
                        flex
                        h-[86px]
                        items-center
                        border-b
                        border-slate-200
                        bg-white/95
                        px-7
                        backdrop-blur
                    "
                >
                    <div
                        className="
                            flex
                            w-full
                            items-center
                            justify-between
                            gap-6
                        "
                    >
                        {/* PAGE TITLE */}
                        <div className="min-w-[250px]">
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                    text-[11px]
                                    font-medium
                                    text-slate-400
                                "
                            >
                                <span>
                                    Rumah Sakit Harapan Indonesia
                                </span>

                                <span>/</span>

                                <span className="text-slate-500">
                                    {pageTitle}
                                </span>
                            </div>

                            <h1
                                className="
                                    mt-0.5
                                    text-lg
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {pageTitle}
                            </h1>
                        </div>

                        {/* SEARCH */}
                        <div
                            className="
                                hidden
                                max-w-md
                                flex-1
                                md:block
                            "
                        >
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="
                                        absolute
                                        left-3.5
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <input
                                    type="text"
                                    placeholder="Cari pasien, No. RM, diagnosis..."
                                    className="
                                        h-10
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        pl-10
                                        pr-4
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-[#5DDCC5]
                                        focus:bg-white
                                        focus:ring-2
                                        focus:ring-[#5DF8D8]/20
                                    "
                                />
                            </div>
                        </div>

                        {/* USER AREA */}
                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <button
                                type="button"
                                title="Notifikasi"
                                className="
                                    relative
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-slate-500
                                    transition
                                    hover:bg-slate-100
                                    hover:text-slate-700
                                "
                            >
                                <Bell size={19} />

                                <span
                                    className="
                                        absolute
                                        right-2.5
                                        top-2
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-rose-500
                                    "
                                />
                            </button>

                            <div
                                className="
                                    mx-1
                                    h-7
                                    w-px
                                    bg-slate-200
                                "
                            />

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-2
                                    py-1.5
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#093C5D]
                                        text-xs
                                        font-bold
                                        text-white
                                    "
                                >
                                    {initials}
                                </div>

                                <div
                                    className="
                                        hidden
                                        text-left
                                        lg:block
                                    "
                                >
                                    <div
                                        className="
                                            max-w-[150px]
                                            truncate
                                            text-xs
                                            font-semibold
                                            text-slate-700
                                        "
                                    >
                                        {user?.name}
                                    </div>

                                    <div
                                        className="
                                            text-[10px]
                                            font-medium
                                            text-slate-400
                                        "
                                    >
                                        {user?.role}
                                    </div>
                                </div>

                                <ChevronDown
                                    size={15}
                                    className="
                                        hidden
                                        text-slate-400
                                        lg:block
                                    "
                                />
                            </div>

                            <button
                                type="button"
                                onClick={
                                    handleLogout
                                }
                                title="Logout"
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-slate-400
                                    transition
                                    hover:bg-rose-50
                                    hover:text-rose-600
                                "
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main
                    className="
                        min-h-[calc(100vh-86px)]
                        bg-[#F5F7FA]
                        p-7
                    "
                >
                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-[1600px]
                        "
                    >
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}