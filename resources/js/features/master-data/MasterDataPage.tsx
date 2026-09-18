import {
    Building2,
    CircleDollarSign,
    HandCoins,
    Hospital,
    Stethoscope,
} from 'lucide-react';

import {
    useState,
    type ReactNode,
} from 'react';

import {
    MasterDataTable,
} from './MasterDataTable';


type TabKey =
    | 'hospital-units'
    | 'payers'
    | 'healthcare-facilities'
    | 'medical-services'
    | 'doctors';


type Tab = {
    key: TabKey;
    label: string;
    description: string;
    endpoint: string;
    icon: ReactNode;
};


const tabs: Tab[] = [
    {
        key: 'hospital-units',
        label: 'Unit / Poli',
        description:
            'Unit pelayanan rumah sakit',
        endpoint:
            '/api/hospital-units',
        icon: (
            <Building2
                size={17}
            />
        ),
    },

    {
        key: 'payers',
        label: 'Penjamin',
        description:
            'Penjamin biaya pasien',
        endpoint:
            '/api/payers',
        icon: (
            <HandCoins
                size={17}
            />
        ),
    },

    {
        key:
            'healthcare-facilities',
        label: 'Faskes',
        description:
            'Fasilitas kesehatan rujukan',
        endpoint:
            '/api/healthcare-facilities',
        icon: (
            <Hospital
                size={17}
            />
        ),
    },

    {
        key: 'medical-services',
        label: 'Tarif Layanan',
        description:
            'Layanan dan tarif medis',
        endpoint:
            '/api/medical-services',
        icon: (
            <CircleDollarSign
                size={17}
            />
        ),
    },

    {
        key: 'doctors',
        label: 'Dokter',
        description:
            'Data dokter dan spesialisasi',
        endpoint:
            '/api/doctors',
        icon: (
            <Stethoscope
                size={17}
            />
        ),
    },
];


export function MasterDataPage() {
    const [active, setActive] =
        useState<TabKey>(
            'hospital-units',
        );

    const activeTab =
        tabs.find(
            (tab) =>
                tab.key === active,
        )!;


    return (
        <div className="
            space-y-6
        ">
            {/* HEADER */}
            <div>
                <h1 className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-slate-900
                ">
                    Master Data
                </h1>

                <p className="
                    mt-1
                    text-sm
                    text-slate-500
                ">
                    Kelola dan lihat data
                    referensi yang digunakan
                    dalam pelayanan dan
                    operasional rumah sakit.
                </p>
            </div>


            {/* MASTER DATA CATEGORY */}
            <div className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-2
                xl:grid-cols-5
            ">
                {tabs.map(
                    (tab) => {
                        const isActive =
                            active ===
                            tab.key;

                        return (
                            <button
                                key={
                                    tab.key
                                }
                                type="button"
                                onClick={() =>
                                    setActive(
                                        tab.key,
                                    )
                                }
                                className={`
                                    flex
                                    items-center
                                    gap-3
                                    rounded-2xl
                                    border
                                    p-4
                                    text-left
                                    transition
                                    ${
                                        isActive
                                            ? `
                                                border-[#8BE9D8]
                                                bg-[#F0FFFB]
                                                shadow-sm
                                            `
                                            : `
                                                border-slate-200
                                                bg-white
                                                hover:border-slate-300
                                                hover:shadow-sm
                                            `
                                    }
                                `}
                            >
                                <div
                                    className={`
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        ${
                                            isActive
                                                ? `
                                                    bg-[#DDF9F3]
                                                    text-[#087C70]
                                                `
                                                : `
                                                    bg-slate-100
                                                    text-slate-500
                                                `
                                        }
                                    `}
                                >
                                    {tab.icon}
                                </div>

                                <div className="
                                    min-w-0
                                ">
                                    <p
                                        className={`
                                            text-sm
                                            font-semibold
                                            ${
                                                isActive
                                                    ? 'text-[#093C5D]'
                                                    : 'text-slate-700'
                                            }
                                        `}
                                    >
                                        {
                                            tab.label
                                        }
                                    </p>

                                    <p className="
                                        mt-0.5
                                        truncate
                                        text-[11px]
                                        text-slate-400
                                    ">
                                        {
                                            tab.description
                                        }
                                    </p>
                                </div>
                            </button>
                        );
                    },
                )}
            </div>


            {/* SECTION TITLE */}
            <div>
                <h2 className="
                    text-lg
                    font-bold
                    text-slate-800
                ">
                    {activeTab.label}
                </h2>

                <p className="
                    mt-0.5
                    text-xs
                    text-slate-400
                ">
                    {activeTab.description}
                </p>
            </div>


            {/* UNIT */}
            {active ===
                'hospital-units' && (
                <MasterDataTable
                    endpoint={
                        activeTab.endpoint
                    }
                    searchPlaceholder="Cari kode, nama unit, tipe, atau lokasi..."
                    getRowKey={(
                        item: any,
                    ) => item.id}
                    columns={[
                        {
                            key: 'code',
                            label: 'Kode',
                            render: (
                                item: any,
                            ) => (
                                <span className="
                                    font-semibold
                                    text-[#093C5D]
                                ">
                                    {item.code ??
                                        '-'}
                                </span>
                            ),
                        },
                        {
                            key: 'name',
                            label:
                                'Nama Unit / Poli',
                            render: (
                                item: any,
                            ) => (
                                <span className="
                                    font-semibold
                                    text-slate-700
                                ">
                                    {item.name ??
                                        '-'}
                                </span>
                            ),
                        },
                        {
                            key: 'unit_type',
                            label: 'Tipe',
                            render: (
                                item: any,
                            ) => (
                                <Badge>
                                    {formatLabel(
                                        item.unit_type,
                                    )}
                                </Badge>
                            ),
                        },
                        {
                            key: 'location',
                            label: 'Lokasi',
                        },
                    ]}
                />
            )}


            {/* PAYER */}
            {active ===
                'payers' && (
                <MasterDataTable
                    endpoint={
                        activeTab.endpoint
                    }
                    searchPlaceholder="Cari kode, nama, atau kategori penjamin..."
                    getRowKey={(
                        item: any,
                    ) => item.id}
                    columns={[
                        {
                            key: 'code',
                            label: 'Kode',
                            render: (
                                item: any,
                            ) => (
                                <span className="
                                    font-semibold
                                    text-[#093C5D]
                                ">
                                    {item.code ??
                                        '-'}
                                </span>
                            ),
                        },
                        {
                            key: 'name',
                            label:
                                'Nama Penjamin',
                            render: (
                                item: any,
                            ) => (
                                <span className="
                                    font-semibold
                                    text-slate-700
                                ">
                                    {item.name ??
                                        '-'}
                                </span>
                            ),
                        },
                        {
                            key: 'category',
                            label:
                                'Kategori',
                            render: (
                                item: any,
                            ) => (
                                <Badge>
                                    {formatLabel(
                                        item.category,
                                    )}
                                </Badge>
                            ),
                        },
                    ]}
                />
            )}


            {/* FASKES */}
            {active ===
                'healthcare-facilities' && (
                <MasterDataTable
                    endpoint={
                        activeTab.endpoint
                    }
                    searchPlaceholder="Cari kode BPJS, nama faskes, tipe, atau alamat..."
                    getRowKey={(
                        item: any,
                    ) => item.id}
                    columns={[
                        {
                            key: 'bpjs_code',
                            label:
                                'Kode BPJS',
                            render: (
                                item: any,
                            ) => (
                                <span className="
                                    font-semibold
                                    text-[#093C5D]
                                ">
                                    {item.bpjs_code ??
                                        '-'}
                                </span>
                            ),
                        },
                        {
                            key: 'name',
                            label:
                                'Nama Faskes',
                            render: (
                                item: any,
                            ) => (
                                <span className="
                                    font-semibold
                                    text-slate-700
                                ">
                                    {item.name ??
                                        '-'}
                                </span>
                            ),
                        },
                        {
                            key: 'facility_type',
                            label: 'Tipe',
                            render: (
                                item: any,
                            ) => (
                                <Badge>
                                    {formatLabel(
                                        item.facility_type,
                                    )}
                                </Badge>
                            ),
                        },
                        {
                            key: 'address',
                            label: 'Alamat',
                        },
                    ]}
                />
            )}


            {/* SERVICES */}
            {active ===
                'medical-services' && (
                <MasterDataTable
                    endpoint={
                        activeTab.endpoint
                    }
                    searchPlaceholder="Cari kode, kategori, atau nama layanan..."
                    getRowKey={(
                        item: any,
                    ) => item.id}
                    columns={[
                        {
                            key: 'code',
                            label: 'Kode',
                            render: (
                                item: any,
                            ) => (
                                <span className="
                                    font-semibold
                                    text-[#093C5D]
                                ">
                                    {item.code ??
                                        '-'}
                                </span>
                            ),
                        },
                        {
                            key: 'category',
                            label:
                                'Kategori',
                            render: (
                                item: any,
                            ) => (
                                <Badge>
                                    {formatLabel(
                                        item.category,
                                    )}
                                </Badge>
                            ),
                        },
                        {
                            key: 'name',
                            label:
                                'Nama Layanan',
                            render: (
                                item: any,
                            ) => (
                                <span className="
                                    font-semibold
                                    text-slate-700
                                ">
                                    {item.name ??
                                        '-'}
                                </span>
                            ),
                        },
                        {
                            key:
                                'default_tariff',
                            label: 'Tarif',
                            render: (
                                item: any,
                            ) => (
                                <span className="
                                    whitespace-nowrap
                                    font-semibold
                                    text-slate-700
                                ">
                                    {formatRupiah(
                                        item.default_tariff,
                                    )}
                                </span>
                            ),
                        },
                    ]}
                />
            )}


            {/* DOCTOR */}
            {active ===
                'doctors' && (
                <MasterDataTable
                    endpoint={
                        activeTab.endpoint
                    }
                    searchPlaceholder="Cari nama dokter, spesialisasi, atau No. SIP..."
                    getRowKey={(
                        item: any,
                    ) => item.id}
                    columns={[
                        {
                            key: 'full_name',
                            label:
                                'Nama Dokter',
                            render: (
                                item: any,
                            ) => (
                                <div className="
                                    flex
                                    items-center
                                    gap-3
                                ">
                                    <div className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#E8FCF7]
                                        text-[#087C70]
                                    ">
                                        <Stethoscope
                                            size={
                                                16
                                            }
                                        />
                                    </div>

                                    <span className="
                                        font-semibold
                                        text-slate-700
                                    ">
                                        {item.full_name ??
                                            '-'}
                                    </span>
                                </div>
                            ),
                        },
                        {
                            key:
                                'specialization',
                            label:
                                'Spesialisasi',
                            render: (
                                item: any,
                            ) => (
                                <Badge>
                                    {item.specialization ??
                                        '-'}
                                </Badge>
                            ),
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
                                            unit: any,
                                        ) =>
                                            unit.unit_name,
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


function Badge({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <span className="
            inline-flex
            whitespace-nowrap
            rounded-full
            bg-[#E8FCF7]
            px-2.5
            py-1
            text-xs
            font-medium
            text-[#087C70]
        ">
            {children || '-'}
        </span>
    );
}


function formatLabel(
    value?: string | null,
) {
    if (!value) {
        return '-';
    }

    return value
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(
            /\b\w/g,
            (letter: string) =>
                letter.toUpperCase(),
        );
}


function formatRupiah(
    value: string | number | null,
) {
    const number =
        Number(value);

    if (
        Number.isNaN(number)
    ) {
        return '-';
    }

    return new Intl.NumberFormat(
        'id-ID',
        {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        },
    ).format(number);
}