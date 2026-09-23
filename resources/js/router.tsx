import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import { MedicalRecordPage } from './features/medical-record/MedicalRecordPage';
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
    ClinicalEncounterPage,
} from './features/clinical/ClinicalEncounterPage';

import {
    SchedulesPage,
} from './features/scheduling/SchedulesPage';

import {
    MasterDataPage,
} from './features/master-data/MasterDataPage';

import {
    OutpatientRegistrationPage,
} from './features/registrations/OutpatientRegistrationPage';

import { BookingsPage } from './features/bookings/BookingsPage';

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
                        <RoleRoute roles={['ADMIN']}>
                            <MasterDataPage />
                        </RoleRoute>
                    ),
                },
                {
                    path: 'schedules',
                    element: (
                        <RoleRoute roles={['FRONT_OFFICE', 'DOCTOR']}>
                            <SchedulesPage />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'bookings',
                    element: (
                        <RoleRoute roles={['FRONT_OFFICE']}>
                            <BookingsPage />
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
                            <OutpatientRegistrationPage />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'clinical',
                    element: (
                        <RoleRoute
                            roles={[
                                'DOCTOR',
                                'ADMIN',
                            ]}
                        >
                            <ClinicalEncounterPage />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'clinical/:encounterId',
                    element: (
                        <RoleRoute
                            roles={[
                                'DOCTOR',
                                'ADMIN',
                            ]}
                        >
                            <ClinicalEncounterPage />
                        </RoleRoute>
                    ),
                },

                {
                    path: 'medical-record',
                    element: (
                        <RoleRoute
                            roles={[
                                'DOCTOR',
                                'ADMIN',
                            ]}
                        >
                            <MedicalRecordPage />
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