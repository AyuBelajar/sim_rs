export type AppRole =
    | 'ADMIN'
    | 'FRONT_OFFICE'
    | 'DOCTOR'
    | 'NURSE'
    | 'BILLING';

export type NavigationItem = {
    label: string;
    to: string;
    roles?: AppRole[];
};

export const navigationItems:
    NavigationItem[] = [
        {
            label: 'Dashboard',
            to: '/',
        },

        {
            label: 'Pasien',
            to: '/patients',
            roles: [
                'FRONT_OFFICE',
            ],
        },

        {
            label: 'Master Data',
            to: '/master-data',
            roles: [
                'ADMIN',
            ],
        },

        {
            label: 'Jadwal Dokter',
            to: '/schedules',
            roles: [
                'FRONT_OFFICE',
            ],
        },

        {
            label: 'Booking',
            to: '/bookings',
            roles: [
                'FRONT_OFFICE',
            ],
        },

        {
            label: 'Pendaftaran Rawat Jalan',
            to: '/admission/outpatient',
            roles: [
                'FRONT_OFFICE',
            ],
        },

        {
            label: 'Rawat Jalan',
            to: '/clinical',
            roles: [
                'DOCTOR',
            ],
        },

        {
            label: 'Rekam Medis',
            to: '/medical-record',
            roles: [
                'DOCTOR',
            ],
        },

        {
            label: 'Keperawatan',
            to: '/nursing',
            roles: [
                'NURSE',
            ],
        },

        {
            label: 'Billing',
            to: '/billing',
            roles: [
                'BILLING',
            ],
        },

        {
            label: 'Laporan',
            to: '/reports',
            roles: [
                'ADMIN',
            ],
        },
    ];

export function canAccessNavigation(
    userRole: string,
    roles?: AppRole[],
): boolean {
    if (!roles || roles.length === 0) {
        return true;
    }

    if (userRole === 'ADMIN') {
        return true;
    }

    return roles.includes(
        userRole as AppRole,
    );
}