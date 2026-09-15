import {
    useCallback,
    useEffect,
    useState,
    type FormEvent,
} from 'react';

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
    ] =
        useState<
            PatientListResponse | null
        >(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [
        searchInput,
        setSearchInput,
    ] =
        useState('');

    const [search, setSearch] =
        useState('');

    const [gender, setGender] =
        useState('');

    const [page, setPage] =
        useState(1);

    const [
        formOpen,
        setFormOpen,
    ] =
        useState(false);

    const [
        editingPatient,
        setEditingPatient,
    ] =
        useState<Patient | null>(
            null,
        );

    const loadPatients =
        useCallback(
            async () => {
                setLoading(true);
                setError(null);

                try {
                    const data =
                        await getPatients(
                            {
                                search:
                                    search ||
                                    undefined,

                                gender:
                                    gender ||
                                    undefined,

                                page,
                                perPage: 10,
                            },
                        );

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

    async function handleDelete(
        patient: Patient,
    ) {
        const confirmed =
            window.confirm(
                `Hapus ${patient.full_name}?`,
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
                error instanceof ApiError
            ) {
                setError(
                    error.message,
                );
            }
        }
    }

    return (
        <div>
            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >
                <div>
                    <h1
                        className="
                            text-2xl
                            font-bold
                        "
                    >
                        Data Pasien
                    </h1>

                    <p
                        className="
                            text-sm
                            text-slate-500
                            mt-1
                        "
                    >
                        Kelola data pasien
                        rumah sakit.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingPatient(
                            null,
                        );

                        setFormOpen(
                            true,
                        );
                    }}
                    className="
                        px-4 py-2.5
                        rounded-lg
                        font-semibold
                        text-sm
                    "
                    style={{
                        background:
                            '#FFDF82',
                        color:
                            '#093C5D',
                    }}
                >
                    + Tambah Pasien
                </button>
            </div>

            <div
                className="
                    bg-white
                    border
                    border-slate-200
                    rounded-xl
                    mt-6
                    overflow-hidden
                "
            >
                <div
                    className="
                        p-4
                        border-b
                    "
                >
                    <form
                        onSubmit={
                            handleSearch
                        }
                        className="
                            flex gap-3
                        "
                    >
                        <input
                            value={
                                searchInput
                            }
                            onChange={(e) =>
                                setSearchInput(
                                    e.target.value,
                                )
                            }
                            placeholder="Cari nama, No. RM, NIK, telepon..."
                            className="
                                flex-1
                                border
                                rounded-lg
                                px-3 py-2
                            "
                        />

                        <select
                            value={gender}
                            onChange={(e) => {
                                setGender(
                                    e.target.value,
                                );

                                setPage(1);
                            }}
                            className="
                                border
                                rounded-lg
                                px-3
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
                            className="
                                text-white
                                rounded-lg
                                px-5
                            "
                            style={{
                                background:
                                    '#093C5D',
                            }}
                        >
                            Cari
                        </button>
                    </form>
                </div>

                {error && (
                    <div
                        className="
                            m-4
                            bg-red-50
                            text-red-700
                            border
                            border-red-200
                            rounded-lg
                            p-3
                        "
                    >
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table
                        className="
                            w-full
                            text-sm
                        "
                    >
                        <thead
                            className="
                                bg-slate-50
                                border-b
                            "
                        >
                            <tr>
                                <th className="text-left px-5 py-3">
                                    No. RM
                                </th>

                                <th className="text-left px-5 py-3">
                                    Nama
                                </th>

                                <th className="text-left px-5 py-3">
                                    NIK
                                </th>

                                <th className="text-left px-5 py-3">
                                    Gender
                                </th>

                                <th className="text-left px-5 py-3">
                                    Umur
                                </th>

                                <th className="text-left px-5 py-3">
                                    Telepon
                                </th>

                                <th className="text-right px-5 py-3">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="
                                            text-center
                                            py-12
                                        "
                                    >
                                        Memuat data...
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
                                                border-b
                                                hover:bg-slate-50
                                            "
                                        >
                                            <td className="px-5 py-4 font-semibold">
                                                {
                                                    patient.medical_record_no
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                {
                                                    patient.full_name
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                {
                                                    patient.nik ??
                                                    '-'
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                {patient.gender ===
                                                'LAKI_LAKI'
                                                    ? 'Laki-laki'
                                                    : 'Perempuan'}
                                            </td>

                                            <td className="px-5 py-4">
                                                {patient.age !==
                                                null
                                                    ? `${patient.age} th`
                                                    : '-'}
                                            </td>

                                            <td className="px-5 py-4">
                                                {
                                                    patient.phone ??
                                                    '-'
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingPatient(
                                                                patient,
                                                            );

                                                            setFormOpen(
                                                                true,
                                                            );
                                                        }}
                                                        className="
                                                            border
                                                            rounded-md
                                                            px-3 py-1.5
                                                        "
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                patient,
                                                            )
                                                        }
                                                        className="
                                                            border
                                                            border-red-200
                                                            text-red-600
                                                            rounded-md
                                                            px-3 py-1.5
                                                        "
                                                    >
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
                                            text-center
                                            py-16
                                            text-slate-400
                                        "
                                    >
                                        Data pasien
                                        tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {response &&
                    response.meta.total >
                        0 && (
                    <div
                        className="
                            p-4
                            border-t
                            flex
                            justify-between
                            items-center
                        "
                    >
                        <span className="text-sm text-slate-500">
                            {response.meta.from}
                            {' - '}
                            {response.meta.to}
                            {' dari '}
                            {response.meta.total}
                        </span>

                        <div className="flex gap-2">
                            <button
                                disabled={
                                    page <= 1
                                }
                                onClick={() =>
                                    setPage(
                                        page -
                                            1,
                                    )
                                }
                                className="
                                    border
                                    rounded-lg
                                    px-3 py-2
                                    disabled:opacity-40
                                "
                            >
                                Sebelumnya
                            </button>

                            <button
                                disabled={
                                    page >=
                                    response.meta
                                        .last_page
                                }
                                onClick={() =>
                                    setPage(
                                        page +
                                            1,
                                    )
                                }
                                className="
                                    border
                                    rounded-lg
                                    px-3 py-2
                                    disabled:opacity-40
                                "
                            >
                                Berikutnya
                            </button>
                        </div>
                    </div>
                )}
            </div>

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