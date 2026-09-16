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
    RoleRoute,
} from './features/auth/RoleRoute';

import {
    ForbiddenPage,
} from './features/auth/ForbiddenPage';

import {
    DashboardPage,
} from './features/dashboard/DashboardPage';

import {
    PatientsPage,
} from './features/patients/PatientsPage';

import {
    AppLayout,
} from './layouts/AppLayout';

import {
    ModulePlaceholder,
} from './components/ModulePlaceholder';

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
                            roles={[
                                'FRONT_OFFICE',
                            ]}
                        >
                            <PatientsPage />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'master-data',
                    element: (
                        <RoleRoute
                            roles={[
                                'ADMIN',
                            ]}
                        >
                            <ModulePlaceholder
                                title="Master Data"
                                description="Hospital unit, payer, staff, dan doctor."
                                owner="Ayu"
                            />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'schedules',
                    element: (
                        <RoleRoute
                            roles={[
                                'FRONT_OFFICE',
                            ]}
                        >
                            <ModulePlaceholder
                                title="Jadwal Dokter"
                                description="Jadwal dokter dan kuota pelayanan."
                                owner="Ayu"
                            />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'bookings',
                    element: (
                        <RoleRoute
                            roles={[
                                'FRONT_OFFICE',
                            ]}
                        >
                            <ModulePlaceholder
                                title="Booking"
                                description="Booking pasien dan validasi kuota."
                                owner="Ipeh"
                            />
                        </RoleRoute>
                    ),
                },

                {
                    path:
                        'admission/outpatient',
                    element: (
                        <RoleRoute
                            roles={[
                                'FRONT_OFFICE',
                            ]}
                        >
                            <ModulePlaceholder
                                title="Pendaftaran Rawat Jalan"
                                description="Registrasi pasien rawat jalan dan verifikasi."
                                owner="Ipeh"
                            />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'clinical',
                    element: (
                        <RoleRoute
                            roles={[
                                'DOCTOR',
                            ]}
                        >
                            <ModulePlaceholder
                                title="Rawat Jalan"
                                description="Encounter dan pelayanan klinis dokter."
                                owner="Sava"
                            />
                        </RoleRoute>
                    ),
                },

                {
                    path:
                        'medical-record',
                    element: (
                        <RoleRoute
                            roles={[
                                'DOCTOR',
                            ]}
                        >
                            <ModulePlaceholder
                                title="Rekam Medis"
                                description="SOAP, diagnosis, tindakan, terapi, dan rekam klinis."
                                owner="Sava"
                            />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'nursing',
                    element: (
                        <RoleRoute
                            roles={[
                                'NURSE',
                            ]}
                        >
                            <ModulePlaceholder
                                title="Keperawatan"
                                description="Pengkajian dan dokumentasi pelayanan keperawatan."
                                owner="Vega"
                            />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'billing',
                    element: (
                        <RoleRoute
                            roles={[
                                'BILLING',
                            ]}
                        >
                            <ModulePlaceholder
                                title="Billing"
                                description="Tagihan, invoice, pembayaran, dan status billing."
                                owner="Vega"
                            />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'reports',
                    element: (
                        <RoleRoute
                            roles={[
                                'ADMIN',
                            ]}
                        >
                            <ModulePlaceholder
                                title="Laporan"
                                description="Laporan operasional dan ringkasan SIMRS."
                                owner="Vega"
                            />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'forbidden',
                    element:
                        <ForbiddenPage />,
                },
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