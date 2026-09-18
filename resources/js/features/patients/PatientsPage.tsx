import {
    useCallback,
    useEffect,
    useState,
    type FormEvent,
} from 'react';

import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Mars,
    Phone,
    Plus,
    Search,
    Trash2,
    UserRound,
    Users,
    Venus,
    X,
} from 'lucide-react';

import { ApiError } from '../../api/http';

import {
    deletePatient,
    getPatients,
} from './patientApi';

import {
    PatientFormModal,
} from './PatientFormModal';

import type {
    Patient,
    PatientListResponse,
} from './types';


export function PatientsPage() {
    const [
        response,
        setResponse,
    ] = useState<
        PatientListResponse | null
    >(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [
        searchInput,
        setSearchInput,
    ] = useState('');

    const [search, setSearch] =
        useState('');

    const [gender, setGender] =
        useState('');

    const [page, setPage] =
        useState(1);

    const [
        formOpen,
        setFormOpen,
    ] = useState(false);

    const [
        editingPatient,
        setEditingPatient,
    ] = useState<Patient | null>(
        null,
    );


    const loadPatients =
        useCallback(
            async () => {
                setLoading(true);
                setError(null);

                try {
                    const data =
                        await getPatients({
                            search:
                                search ||
                                undefined,

                            gender:
                                gender ||
                                undefined,

                            page,
                            perPage: 10,
                        });

                    setResponse(data);
                } catch (error) {
                    if (
                        error instanceof
                        ApiError
                    ) {
                        setError(
                            error.message,
                        );
                    } else {
                        setError(
                            'Gagal mengambil data pasien.',
                        );
                    }
                } finally {
                    setLoading(false);
                }
            },
            [
                search,
                gender,
                page,
            ],
        );


    useEffect(() => {
        loadPatients();
    }, [loadPatients]);


    function handleSearch(
        event: FormEvent,
    ) {
        event.preventDefault();

        setPage(1);
        setSearch(
            searchInput.trim(),
        );
    }


    function handleResetFilter() {
        setSearchInput('');
        setSearch('');
        setGender('');
        setPage(1);
    }


    async function handleDelete(
        patient: Patient,
    ) {
        const confirmed =
            window.confirm(
                `Hapus data pasien ${patient.full_name}?`,
            );

        if (!confirmed) {
            return;
        }

        try {
            await deletePatient(
                patient.id,
            );

            await loadPatients();
        } catch (error) {
            if (
                error instanceof
                ApiError
            ) {
                setError(
                    error.message,
                );
            }
        }
    }


    const totalPatients =
        response?.meta.total ?? 0;

    const maleOnCurrentPage =
        response?.data.filter(
            (patient) =>
                patient.gender ===
                'LAKI_LAKI',
        ).length ?? 0;

    const femaleOnCurrentPage =
        response?.data.filter(
            (patient) =>
                patient.gender ===
                'PEREMPUAN',
        ).length ?? 0;

    const hasActiveFilter =
        Boolean(search || gender);


    return (
        <div className="space-y-6">

            {/* PAGE HEADER */}
            <div className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">
                <div>
                    <h1 className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-slate-900
                    ">
                        Data Pasien
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-slate-500
                    ">
                        Kelola identitas dan
                        informasi pasien rumah
                        sakit.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setEditingPatient(
                            null,
                        );

                        setFormOpen(true);
                    }}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#FFDF82]
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-[#093C5D]
                        shadow-sm
                        transition
                        hover:bg-[#F8D36A]
                    "
                >
                    <Plus size={17} />

                    Tambah Pasien
                </button>
            </div>


            {/* SUMMARY */}
            <div className="
                grid
                grid-cols-1
                gap-4
                md:grid-cols-3
            ">
                <div className="
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                ">
                    <div className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#E8FCF7]
                        text-[#087C70]
                    ">
                        <Users size={21} />
                    </div>

                    <div>
                        <p className="
                            text-xs
                            font-medium
                            text-slate-500
                        ">
                            Total Pasien
                        </p>

                        <p className="
                            mt-1
                            text-xl
                            font-bold
                            text-slate-800
                        ">
                            {loading
                                ? '...'
                                : totalPatients}
                        </p>

                        <p className="
                            text-[11px]
                            text-slate-400
                        ">
                            Pasien terdaftar
                        </p>
                    </div>
                </div>


                <div className="
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                ">
                    <div className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    ">
                        <Mars size={21} />
                    </div>

                    <div>
                        <p className="
                            text-xs
                            font-medium
                            text-slate-500
                        ">
                            Laki-laki
                        </p>

                        <p className="
                            mt-1
                            text-xl
                            font-bold
                            text-slate-800
                        ">
                            {loading
                                ? '...'
                                : maleOnCurrentPage}
                        </p>

                        <p className="
                            text-[11px]
                            text-slate-400
                        ">
                            Pada halaman ini
                        </p>
                    </div>
                </div>


                <div className="
                    flex
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                ">
                    <div className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-rose-50
                        text-rose-500
                    ">
                        <Venus size={21} />
                    </div>

                    <div>
                        <p className="
                            text-xs
                            font-medium
                            text-slate-500
                        ">
                            Perempuan
                        </p>

                        <p className="
                            mt-1
                            text-xl
                            font-bold
                            text-slate-800
                        ">
                            {loading
                                ? '...'
                                : femaleOnCurrentPage}
                        </p>

                        <p className="
                            text-[11px]
                            text-slate-400
                        ">
                            Pada halaman ini
                        </p>
                    </div>
                </div>
            </div>


            {/* DATA CARD */}
            <section className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            ">

                {/* CARD HEADER */}
                <div className="
                    border-b
                    border-slate-100
                    px-5
                    py-4
                ">
                    <div>
                        <h2 className="
                            text-sm
                            font-bold
                            text-slate-800
                        ">
                            Daftar Pasien
                        </h2>

                        <p className="
                            mt-0.5
                            text-xs
                            text-slate-400
                        ">
                            Cari dan kelola data
                            pasien yang telah
                            terdaftar.
                        </p>
                    </div>
                </div>


                {/* FILTER */}
                <div className="
                    border-b
                    border-slate-100
                    bg-slate-50/50
                    p-4
                ">
                    <form
                        onSubmit={
                            handleSearch
                        }
                        className="
                            flex
                            flex-col
                            gap-3
                            lg:flex-row
                        "
                    >
                        <div className="
                            relative
                            flex-1
                        ">
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
                                value={
                                    searchInput
                                }
                                onChange={(e) =>
                                    setSearchInput(
                                        e.target
                                            .value,
                                    )
                                }
                                placeholder="Cari nama, No. RM, NIK, atau telepon..."
                                className="
                                    h-10
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    pl-10
                                    pr-4
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-[#5DDCC5]
                                    focus:ring-2
                                    focus:ring-[#5DF8D8]/20
                                "
                            />
                        </div>

                        <select
                            value={gender}
                            onChange={(e) => {
                                setGender(
                                    e.target.value,
                                );

                                setPage(1);
                            }}
                            className="
                                h-10
                                min-w-[170px]
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-sm
                                text-slate-600
                                outline-none
                                focus:border-[#5DDCC5]
                                focus:ring-2
                                focus:ring-[#5DF8D8]/20
                            "
                        >
                            <option value="">
                                Semua gender
                            </option>

                            <option value="LAKI_LAKI">
                                Laki-laki
                            </option>

                            <option value="PEREMPUAN">
                                Perempuan
                            </option>
                        </select>

                        <button
                            type="submit"
                            className="
                                h-10
                                rounded-xl
                                bg-[#093C5D]
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#0B4A70]
                            "
                        >
                            Cari
                        </button>

                        {hasActiveFilter && (
                            <button
                                type="button"
                                onClick={
                                    handleResetFilter
                                }
                                className="
                                    inline-flex
                                    h-10
                                    items-center
                                    justify-center
                                    gap-1.5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-4
                                    text-sm
                                    font-medium
                                    text-slate-500
                                    transition
                                    hover:bg-slate-50
                                "
                            >
                                <X size={15} />
                                Reset
                            </button>
                        )}
                    </form>
                </div>


                {/* ERROR */}
                {error && (
                    <div className="
                        m-4
                        flex
                        items-start
                        gap-3
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        p-4
                        text-sm
                        text-red-700
                    ">
                        <AlertCircle
                            size={18}
                            className="
                                mt-0.5
                                shrink-0
                            "
                        />

                        <div>
                            <p className="
                                font-semibold
                            ">
                                Gagal memuat data
                            </p>

                            <p className="
                                mt-0.5
                                text-xs
                            ">
                                {error}
                            </p>
                        </div>
                    </div>
                )}


                {/* TABLE */}
                <div className="
                    overflow-x-auto
                ">
                    <table className="
                        w-full
                        text-sm
                    ">
                        <thead className="
                            border-b
                            border-slate-200
                            bg-slate-50
                        ">
                            <tr className="
                                text-xs
                                font-semibold
                                text-slate-500
                            ">
                                <th className="
                                    px-5
                                    py-3.5
                                    text-left
                                ">
                                    No. RM
                                </th>

                                <th className="
                                    px-5
                                    py-3.5
                                    text-left
                                ">
                                    Pasien
                                </th>

                                <th className="
                                    px-5
                                    py-3.5
                                    text-left
                                ">
                                    NIK
                                </th>

                                <th className="
                                    px-5
                                    py-3.5
                                    text-left
                                ">
                                    Gender
                                </th>

                                <th className="
                                    px-5
                                    py-3.5
                                    text-left
                                ">
                                    Umur
                                </th>

                                <th className="
                                    px-5
                                    py-3.5
                                    text-left
                                ">
                                    Telepon
                                </th>

                                <th className="
                                    px-5
                                    py-3.5
                                    text-right
                                ">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody className="
                            divide-y
                            divide-slate-100
                        ">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="
                                            px-5
                                            py-14
                                            text-center
                                        "
                                    >
                                        <div className="
                                            flex
                                            flex-col
                                            items-center
                                            gap-3
                                        ">
                                            <div className="
                                                h-7
                                                w-7
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-slate-200
                                                border-t-[#093C5D]
                                            " />

                                            <span className="
                                                text-xs
                                                text-slate-400
                                            ">
                                                Memuat data
                                                pasien...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : response &&
                              response.data
                                  .length >
                                  0 ? (
                                response.data.map(
                                    (
                                        patient,
                                    ) => (
                                        <tr
                                            key={
                                                patient.id
                                            }
                                            className="
                                                transition
                                                hover:bg-slate-50/70
                                            "
                                        >
                                            <td className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            ">
                                                <span className="
                                                    font-semibold
                                                    text-[#093C5D]
                                                ">
                                                    {
                                                        patient.medical_record_no
                                                    }
                                                </span>
                                            </td>

                                            <td className="
                                                px-5
                                                py-4
                                            ">
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
                                                        <UserRound
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="
                                                            whitespace-nowrap
                                                            font-semibold
                                                            text-slate-700
                                                        ">
                                                            {
                                                                patient.full_name
                                                            }
                                                        </p>

                                                        {patient.nickname && (
                                                            <p className="
                                                                mt-0.5
                                                                text-[11px]
                                                                text-slate-400
                                                            ">
                                                                {
                                                                    patient.nickname
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                                text-slate-500
                                            ">
                                                {patient.nik ??
                                                    '-'}
                                            </td>

                                            <td className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            ">
                                                {patient.gender ===
                                                'LAKI_LAKI' ? (
                                                    <span className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        bg-blue-50
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        text-blue-700
                                                    ">
                                                        <Mars
                                                            size={
                                                                13
                                                            }
                                                        />
                                                        Laki-laki
                                                    </span>
                                                ) : (
                                                    <span className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-full
                                                        bg-rose-50
                                                        px-2.5
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        text-rose-600
                                                    ">
                                                        <Venus
                                                            size={
                                                                13
                                                            }
                                                        />
                                                        Perempuan
                                                    </span>
                                                )}
                                            </td>

                                            <td className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                                text-slate-500
                                            ">
                                                {patient.age !==
                                                null
                                                    ? `${patient.age} th`
                                                    : '-'}
                                            </td>

                                            <td className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                                text-slate-500
                                            ">
                                                {patient.phone ? (
                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-1.5
                                                    ">
                                                        <Phone
                                                            size={
                                                                13
                                                            }
                                                            className="
                                                                text-slate-300
                                                            "
                                                        />

                                                        {
                                                            patient.phone
                                                        }
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>

                                            <td className="
                                                whitespace-nowrap
                                                px-5
                                                py-4
                                            ">
                                                <div className="
                                                    flex
                                                    justify-end
                                                    gap-2
                                                ">
                                                    <button
                                                        type="button"
                                                        title="Edit pasien"
                                                        onClick={() => {
                                                            setEditingPatient(
                                                                patient,
                                                            );

                                                            setFormOpen(
                                                                true,
                                                            );
                                                        }}
                                                        className="
                                                            inline-flex
                                                            h-8
                                                            items-center
                                                            gap-1.5
                                                            rounded-lg
                                                            border
                                                            border-slate-200
                                                            bg-white
                                                            px-2.5
                                                            text-xs
                                                            font-medium
                                                            text-slate-600
                                                            transition
                                                            hover:border-[#8BE9D8]
                                                            hover:bg-[#F3FFFC]
                                                            hover:text-[#087C70]
                                                        "
                                                    >
                                                        <Edit3
                                                            size={
                                                                13
                                                            }
                                                        />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Hapus pasien"
                                                        onClick={() =>
                                                            handleDelete(
                                                                patient,
                                                            )
                                                        }
                                                        className="
                                                            inline-flex
                                                            h-8
                                                            items-center
                                                            gap-1.5
                                                            rounded-lg
                                                            border
                                                            border-red-200
                                                            bg-white
                                                            px-2.5
                                                            text-xs
                                                            font-medium
                                                            text-red-600
                                                            transition
                                                            hover:bg-red-50
                                                        "
                                                    >
                                                        <Trash2
                                                            size={
                                                                13
                                                            }
                                                        />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="
                                            px-5
                                            py-16
                                            text-center
                                        "
                                    >
                                        <div className="
                                            mx-auto
                                            flex
                                            max-w-sm
                                            flex-col
                                            items-center
                                        ">
                                            <div className="
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-slate-100
                                                text-slate-400
                                            ">
                                                <Users
                                                    size={
                                                        21
                                                    }
                                                />
                                            </div>

                                            <p className="
                                                mt-3
                                                text-sm
                                                font-semibold
                                                text-slate-600
                                            ">
                                                Data pasien
                                                tidak ditemukan
                                            </p>

                                            <p className="
                                                mt-1
                                                text-xs
                                                text-slate-400
                                            ">
                                                Coba ubah kata
                                                pencarian atau
                                                filter yang
                                                digunakan.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


                {/* PAGINATION */}
                {response &&
                    response.meta.total >
                        0 && (
                    <div className="
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-slate-100
                        bg-slate-50/50
                        px-5
                        py-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">
                        <div className="
                            text-xs
                            text-slate-500
                        ">
                            Menampilkan
                            {' '}
                            <span className="
                                font-semibold
                                text-slate-700
                            ">
                                {response.meta.from}
                                {' - '}
                                {response.meta.to}
                            </span>
                            {' '}
                            dari
                            {' '}
                            <span className="
                                font-semibold
                                text-slate-700
                            ">
                                {
                                    response.meta
                                        .total
                                }
                            </span>
                            {' '}
                            pasien
                        </div>

                        <div className="
                            flex
                            items-center
                            gap-2
                        ">
                            <span className="
                                mr-2
                                hidden
                                text-xs
                                text-slate-400
                                sm:block
                            ">
                                Halaman
                                {' '}
                                {page}
                                {' '}
                                dari
                                {' '}
                                {
                                    response.meta
                                        .last_page
                                }
                            </span>

                            <button
                                type="button"
                                disabled={
                                    page <= 1
                                }
                                onClick={() =>
                                    setPage(
                                        page - 1,
                                    )
                                }
                                className="
                                    inline-flex
                                    h-9
                                    items-center
                                    gap-1
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                <ChevronLeft
                                    size={14}
                                />
                                Sebelumnya
                            </button>

                            <button
                                type="button"
                                disabled={
                                    page >=
                                    response.meta
                                        .last_page
                                }
                                onClick={() =>
                                    setPage(
                                        page + 1,
                                    )
                                }
                                className="
                                    inline-flex
                                    h-9
                                    items-center
                                    gap-1
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    text-xs
                                    font-medium
                                    text-slate-600
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                Berikutnya
                                <ChevronRight
                                    size={14}
                                />
                            </button>
                        </div>
                    </div>
                )}
            </section>


            {/* PATIENT FORM */}
            <PatientFormModal
                open={formOpen}
                patient={
                    editingPatient
                }
                onClose={() => {
                    setFormOpen(false);
                    setEditingPatient(
                        null,
                    );
                }}
                onSaved={
                    loadPatients
                }
            />
        </div>
    );
}