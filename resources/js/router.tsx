import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import {
    LoginPage,
} from './features/auth/LoginPage';

import {
    ProtectedRoute,
} from './features/auth/ProtectedRoute';

import {
    DashboardPage,
} from './features/dashboard/DashboardPage';

import {
    AppLayout,
} from './layouts/AppLayout';

import {
    PatientsPage,
} from './features/patients/PatientsPage';

import {
    RoleRoute,
} from './features/auth/RoleRoute';

import {
    ForbiddenPage,
} from './features/auth/ForbiddenPage';

function ComingSoon({
    title,
}: {
    title: string;
}) {
    return (
        <div className="
            bg-white
            border
            border-slate-200
            rounded-xl
            p-8
        ">
            <h1 className="
                text-xl
                font-bold
                text-slate-900
            ">
                {title}
            </h1>

            <p className="
                mt-2
                text-sm
                text-slate-500
            ">
                Modul sedang dalam
                pengembangan.
            </p>
        </div>
    );
}

const router =
    createBrowserRouter([
        {
            path: '/login',
            element:
                <LoginPage />,
        },

        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <AppLayout />
                </ProtectedRoute>
            ),

            children: [
                {
                    index: true,
                    element:
                        <DashboardPage />,
                },

                {
                    path: 'patients',
                    element: (
                        <RoleRoute
                            roles={['FRONT_OFFICE']}
                        >
                            <PatientsPage />
                        </RoleRoute>
                    ),
                },

                {
                    path:
                        'admission/outpatient',
                    element: (
                        <ComingSoon
                            title="Pendaftaran Rawat Jalan"
                        />
                    ),
                },

                {
                    path: 'clinical',
                    element: (
                        <ComingSoon
                            title="Rawat Jalan"
                        />
                    ),
                },

                {
                    path:
                        'medical-record',
                    element: (
                        <ComingSoon
                            title="Rekam Medis"
                        />
                    ),
                },

                {
                    path: 'billing',
                    element: (
                        <ComingSoon
                            title="Billing"
                        />
                    ),
                },

                {
                    path: 'reports',
                    element: (
                        <ComingSoon
                            title="Laporan"
                        />
                    ),
                },
                
                {
                    path: 'forbidden',
                    element: (
                        <ForbiddenPage />
                    ),
                }
            ],
        },
    ]);

export function AppRouter() {
    return (
        <RouterProvider
            router={router}
        />
    );
}