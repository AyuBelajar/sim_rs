import { useState } from 'react';

import { MasterDataTable } from './MasterDataTable';

type TabKey =
    | 'hospital-units'
    | 'payers'
    | 'healthcare-facilities'
    | 'medical-services'
    | 'doctors';

const tabs: {
    key: TabKey;
    label: string;
    endpoint: string;
}[] = [
    {
        key: 'hospital-units',
        label: 'Unit/Poli',
        endpoint: '/api/hospital-units',
    },
    {
        key: 'payers',
        label: 'Penjamin',
        endpoint: '/api/payers',
    },
    {
        key: 'healthcare-facilities',
        label: 'Faskes',
        endpoint:
            '/api/healthcare-facilities',
    },
    {
        key: 'medical-services',
        label: 'Tarif Layanan',
        endpoint: '/api/medical-services',
    },
    {
        key: 'doctors',
        label: 'Dokter',
        endpoint: '/api/doctors',
    },
];

export function MasterDataPage() {
    const [active, setActive] =
        useState<TabKey>(
            'hospital-units',
        );

    const activeTab = tabs.find(
        (tab) => tab.key === active,
    )!;

    return (
        <div className="p-6 space-y-5">
            <div>
                <h1 className="text-xl font-bold text-slate-800">
                    Master Data
                </h1>

                <p className="text-sm text-slate-500 mt-0.5">
                    Hospital unit, payer,
                    staff, dan doctor.
                </p>
            </div>

            <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() =>
                            setActive(
                                tab.key,
                            )
                        }
                        className={`flex-1 py-3 text-sm font-medium transition-all border-b-2 ${
                            active ===
                            tab.key
                                ? 'border-b-[#093C5D] text-[#093C5D] bg-slate-50'
                                : 'border-b-transparent text-slate-400'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {active === 'hospital-units' && (
                <MasterDataTable
                    endpoint={
                        activeTab.endpoint
                    }
                    getRowKey={(item: any) =>
                        item.id
                    }
                    columns={[
                        {
                            key: 'code',
                            label: 'Kode',
                        },
                        {
                            key: 'name',
                            label: 'Nama',
                        },
                        {
                            key: 'unit_type',
                            label: 'Tipe',
                        },
                        {
                            key: 'location',
                            label: 'Lokasi',
                        },
                    ]}
                />
            )}

            {active === 'payers' && (
                <MasterDataTable
                    endpoint={
                        activeTab.endpoint
                    }
                    getRowKey={(item: any) =>
                        item.id
                    }
                    columns={[
                        {
                            key: 'code',
                            label: 'Kode',
                        },
                        {
                            key: 'name',
                            label: 'Nama',
                        },
                        {
                            key: 'category',
                            label: 'Kategori',
                        },
                    ]}
                />
            )}

            {active ===
                'healthcare-facilities' && (
                <MasterDataTable
                    endpoint={
                        activeTab.endpoint
                    }
                    getRowKey={(item: any) =>
                        item.id
                    }
                    columns={[
                        {
                            key: 'bpjs_code',
                            label:
                                'Kode BPJS',
                        },
                        {
                            key: 'name',
                            label: 'Nama',
                        },
                        {
                            key: 'facility_type',
                            label: 'Tipe',
                        },
                        {
                            key: 'address',
                            label: 'Alamat',
                        },
                    ]}
                />
            )}

            {active ===
                'medical-services' && (
                <MasterDataTable
                    endpoint={
                        activeTab.endpoint
                    }
                    getRowKey={(item: any) =>
                        item.id
                    }
                    columns={[
                        {
                            key: 'code',
                            label: 'Kode',
                        },
                        {
                            key: 'category',
                            label: 'Kategori',
                        },
                        {
                            key: 'name',
                            label: 'Nama',
                        },
                        {
                            key: 'default_tariff',
                            label: 'Tarif',
                            render: (
                                item: any,
                            ) =>
                                `Rp${Number(
                                    item.default_tariff,
                                ).toLocaleString(
                                    'id-ID',
                                )}`,
                        },
                    ]}
                />
            )}

            {active === 'doctors' && (
                <MasterDataTable
                    endpoint={
                        activeTab.endpoint
                    }
                    getRowKey={(item: any) =>
                        item.id
                    }
                    columns={[
                        {
                            key: 'full_name',
                            label: 'Nama',
                        },
                        {
                            key: 'specialization',
                            label:
                                'Spesialisasi',
                        },
                        {
                            key: 'sip_no',
                            label: 'No. SIP',
                        },
                        {
                            key: 'units',
                            label: 'Unit',
                            render: (
                                item: any,
                            ) =>
                                item.units
                                    ?.map(
                                        (
                                            u: any,
                                        ) =>
                                            u.unit_name,
                                    )
                                    .join(
                                        ', ',
                                    ) ||
                                '-',
                        },
                    ]}
                />
            )}
        </div>
    );
}