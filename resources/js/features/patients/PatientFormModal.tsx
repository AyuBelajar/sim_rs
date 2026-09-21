import {
    useEffect,
    useState,
    type FormEvent,
} from 'react';

import { ApiError } from '../../api/http';
import { Modal } from '../../components/ui/Modal';

import {
    createPatient,
    updatePatient,
} from './patientApi';

import type {
    Patient,
    PatientPayload,
} from './types';

type Props = {
    open: boolean;
    patient: Patient | null;

    onClose: () => void;
    onSaved: (patient: Patient) => void;
    submitLabel?: string;
};

type FormState = {
    title: string;
    full_name: string;
    nickname: string;
    nik: string;

    gender:
        | 'LAKI_LAKI'
        | 'PEREMPUAN';

    birth_place: string;
    birth_date: string;

    blood_type: string;

    phone: string;
    email: string;

    religion: string;
    occupation: string;

    special_notes: string;
};

const emptyForm: FormState = {
    title: '',
    full_name: '',
    nickname: '',
    nik: '',

    gender: 'LAKI_LAKI',

    birth_place: '',
    birth_date: '',

    blood_type: '',

    phone: '',
    email: '',

    religion: '',
    occupation: '',

    special_notes: '',
};

const RELIGION_OPTIONS = [
    'Islam',
    'Kristen',
    'Katolik',
    'Hindu',
    'Buddha',
    'Konghucu',
];

const OCCUPATION_OPTIONS = [
    'Pelajar/Mahasiswa',
    'PNS/ASN',
    'Karyawan Swasta',
    'Wiraswasta',
    'Petani/Nelayan',
    'Ibu Rumah Tangga',
    'Tidak Bekerja',
];

function nullable(
    value: string,
): string | null {
    const valueClean =
        value.trim();

    return valueClean === ''
        ? null
        : valueClean;
}

export function PatientFormModal({
    open,
    patient,
    onClose,
    onSaved,
    submitLabel = 'Simpan',
}: Props) {
    const [form, setForm] =
        useState<FormState>(
            emptyForm,
        );

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [errors, setErrors] =
        useState<
            Record<string, string[]>
        >({});

    const [religionOther, setReligionOther] =
        useState(false);

    const [occupationOther, setOccupationOther] =
        useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setError(null);
        setErrors({});

        if (!patient) {
            setForm({
                ...emptyForm,
            });

            setReligionOther(false);
            setOccupationOther(false);

            return;
        }

        setForm({
            title:
                patient.title ?? '',

            full_name:
                patient.full_name,

            nickname:
                patient.nickname ?? '',

            nik:
                patient.nik ?? '',

            gender:
                patient.gender,

            birth_place:
                patient.birth_place ?? '',

            birth_date:
                patient.birth_date ?? '',

            blood_type:
                patient.blood_type ?? '',

            phone:
                patient.phone ?? '',

            email:
                patient.email ?? '',

            religion:
                patient.religion ?? '',

            occupation:
                patient.occupation ?? '',

            special_notes:
                patient.special_notes ?? '',
        });

        setReligionOther(
            !!patient.religion &&
            !RELIGION_OPTIONS.includes(patient.religion),
        );

        setOccupationOther(
            !!patient.occupation &&
            !OCCUPATION_OPTIONS.includes(patient.occupation),
        );
    }, [open, patient]);

    function change(
        key: keyof FormState,
        value: string,
    ) {
        setForm(
            (current) => ({
                ...current,
                [key]: value,
            }),
        );

        setErrors(
            (current) => ({
                ...current,
                [key]: [],
            }),
        );
    }

    function handleTitleChange(value: string) {
        const genderMap: Record<string, FormState['gender']> = {
            'Tn.': 'LAKI_LAKI',
            'Ny.': 'PEREMPUAN',
            'Nn.': 'PEREMPUAN',
        };

        setForm((current) => ({
            ...current,
            title: value,
            gender: genderMap[value] ?? current.gender,
        }));

        setErrors((current) => ({ ...current, title: [] }));
    }

    function handleReligionChange(value: string) {
        if (value === 'Lainnya') {
            setReligionOther(true);
            change('religion', '');
        } else {
            setReligionOther(false);
            change('religion', value);
        }
    }

    function handleOccupationChange(value: string) {
        if (value === 'Lainnya') {
            setOccupationOther(true);
            change('occupation', '');
        } else {
            setOccupationOther(false);
            change('occupation', value);
        }
    }

    async function handleSubmit(
        event: FormEvent,
    ) {
        event.preventDefault();

        setLoading(true);
        setError(null);
        setErrors({});

        const payload: PatientPayload = {
            title:
                nullable(form.title),

            full_name:
                form.full_name.trim(),

            nickname:
                nullable(
                    form.nickname,
                ),

            nik:
                nullable(form.nik),

            gender:
                form.gender,

            birth_place:
                nullable(
                    form.birth_place,
                ),

            birth_date:
                form.birth_date,

            blood_type:
                form.blood_type
                    ? form.blood_type as
                        PatientPayload['blood_type']
                    : null,

            phone:
                nullable(form.phone),

            email:
                nullable(form.email),

            religion:
                nullable(
                    form.religion,
                ),

            occupation:
                nullable(
                    form.occupation,
                ),

            special_notes:
                nullable(
                    form.special_notes,
                ),
        };

        try {
            let saved: Patient;

            if (patient) {
                const response = await updatePatient(
                    patient.id,
                    payload,
                );
                saved = response.data;
            } else {
                const response = await createPatient(
                    payload,
                );
                saved = response.data;
            }

            onSaved(saved);
            onClose();
        } catch (error) {
            if (
                error instanceof ApiError
            ) {
                const response =
                    error.payload as {
                        message?: string;

                        errors?: Record<
                            string,
                            string[]
                        >;
                    };

                setError(
                    response?.message ??
                        error.message,
                );

                if (response?.errors) {
                    setErrors(
                        response.errors,
                    );
                }
            } else {
                setError(
                    'Tidak dapat terhubung ke server.',
                );
            }
        } finally {
            setLoading(false);
        }
    }

    const inputClass = `
        w-full
        rounded-lg
        border border-slate-200
        px-3 py-2.5
        text-sm
        outline-none
        focus:border-cyan-600
        focus:ring-2
        focus:ring-cyan-50
    `;

    const fieldError = (
        name: string,
    ) => errors[name]?.[0];

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={
                patient
                    ? `Edit ${patient.medical_record_no}`
                    : 'Tambah Pasien'
            }
        >
            <form
                onSubmit={
                    handleSubmit
                }
            >
                <div
                    className="
                        grid grid-cols-1
                        md:grid-cols-2
                        gap-5 p-6
                    "
                >
                    <div>
                        <label className="text-sm font-medium">
                            Gelar
                        </label>

                        <select
                            className={inputClass}
                            value={form.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                        >
                            <option value="">
                                -
                            </option>

                            <option value="Tn.">
                                Tn.
                            </option>

                            <option value="Ny.">
                                Ny.
                            </option>

                            <option value="Nn.">
                                Nn.
                            </option>

                            <option value="An.">
                                An.
                            </option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm font-medium">
                            Nama Lengkap *
                        </label>

                        <input
                            className={inputClass}
                            value={
                                form.full_name
                            }
                            onChange={(e) =>
                                change(
                                    'full_name',
                                    e.target.value,
                                )
                            }
                        />

                        {fieldError(
                            'full_name',
                        ) && (
                            <p className="text-xs text-red-600 mt-1">
                                {fieldError(
                                    'full_name',
                                )}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm font-medium">
                            Nama Panggilan
                        </label>

                        <input
                            className={inputClass}
                            value={
                                form.nickname
                            }
                            onChange={(e) =>
                                change(
                                    'nickname',
                                    e.target.value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            NIK
                        </label>

                        <input
                            className={inputClass}
                            maxLength={16}
                            value={form.nik}
                            onChange={(e) =>
                                change(
                                    'nik',
                                    e.target.value.replace(
                                        /\D/g,
                                        '',
                                    ),
                                )
                            }
                        />

                        {fieldError(
                            'nik',
                        ) && (
                            <p className="text-xs text-red-600 mt-1">
                                {fieldError(
                                    'nik',
                                )}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Jenis Kelamin *
                        </label>

                        <select
                            className={inputClass}
                            value={
                                form.gender
                            }
                            onChange={(e) =>
                                change(
                                    'gender',
                                    e.target.value,
                                )
                            }
                        >
                            <option value="LAKI_LAKI">
                                Laki-laki
                            </option>

                            <option value="PEREMPUAN">
                                Perempuan
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Tanggal Lahir *
                        </label>

                        <input
                            type="date"
                            className={inputClass}
                            value={
                                form.birth_date
                            }
                            onChange={(e) =>
                                change(
                                    'birth_date',
                                    e.target.value,
                                )
                            }
                        />

                        {fieldError(
                            'birth_date',
                        ) && (
                            <p className="text-xs text-red-600 mt-1">
                                {fieldError(
                                    'birth_date',
                                )}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Tempat Lahir
                        </label>

                        <input
                            className={inputClass}
                            value={
                                form.birth_place
                            }
                            onChange={(e) =>
                                change(
                                    'birth_place',
                                    e.target.value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Golongan Darah
                        </label>

                        <select
                            className={inputClass}
                            value={
                                form.blood_type
                            }
                            onChange={(e) =>
                                change(
                                    'blood_type',
                                    e.target.value,
                                )
                            }
                        >
                            <option value="">
                                -
                            </option>
                            <option value="A">
                                A
                            </option>
                            <option value="B">
                                B
                            </option>
                            <option value="AB">
                                AB
                            </option>
                            <option value="O">
                                O
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Telepon
                        </label>

                        <input
                            className={inputClass}
                            value={
                                form.phone
                            }
                            onChange={(e) =>
                                change(
                                    'phone',
                                    e.target.value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            className={inputClass}
                            value={
                                form.email
                            }
                            onChange={(e) =>
                                change(
                                    'email',
                                    e.target.value,
                                )
                            }
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Agama
                        </label>

                        <select
                            className={inputClass}
                            value={
                                religionOther
                                    ? 'Lainnya'
                                    : form.religion
                            }
                            onChange={(e) =>
                                handleReligionChange(
                                    e.target.value,
                                )
                            }
                        >
                            <option value="">
                                -- Pilih --
                            </option>

                            {RELIGION_OPTIONS.map(
                                (option) => (
                                    <option
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                ),
                            )}

                            <option value="Lainnya">
                                Lainnya
                            </option>
                        </select>

                        {religionOther && (
                            <input
                                className={`${inputClass} mt-2`}
                                placeholder="Sebutkan agama"
                                value={form.religion}
                                onChange={(e) =>
                                    change(
                                        'religion',
                                        e.target.value,
                                    )
                                }
                            />
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Pekerjaan
                        </label>

                        <select
                            className={inputClass}
                            value={
                                occupationOther
                                    ? 'Lainnya'
                                    : form.occupation
                            }
                            onChange={(e) =>
                                handleOccupationChange(
                                    e.target.value,
                                )
                            }
                        >
                            <option value="">
                                -- Pilih --
                            </option>

                            {OCCUPATION_OPTIONS.map(
                                (option) => (
                                    <option
                                        key={option}
                                        value={option}
                                    >
                                        {option}
                                    </option>
                                ),
                            )}

                            <option value="Lainnya">
                                Lainnya
                            </option>
                        </select>

                        {occupationOther && (
                            <input
                                className={`${inputClass} mt-2`}
                                placeholder="Sebutkan pekerjaan"
                                value={form.occupation}
                                onChange={(e) =>
                                    change(
                                        'occupation',
                                        e.target.value,
                                    )
                                }
                            />
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm font-medium">
                            Catatan Khusus
                        </label>

                        <textarea
                            rows={3}
                            className={inputClass}
                            value={
                                form.special_notes
                            }
                            onChange={(e) =>
                                change(
                                    'special_notes',
                                    e.target.value,
                                )
                            }
                        />
                    </div>

                    {error && (
                        <div
                            className="
                                md:col-span-2
                                rounded-lg
                                border border-red-200
                                bg-red-50
                                px-4 py-3
                                text-sm
                                text-red-700
                            "
                        >
                            {error}
                        </div>
                    )}
                </div>

                <div
                    className="
                        border-t
                        bg-slate-50
                        px-6 py-4
                        flex justify-end
                        gap-2
                    "
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            border
                            rounded-lg
                            px-4 py-2
                        "
                    >
                        Batal
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            rounded-lg
                            px-5 py-2
                            font-semibold
                            disabled:opacity-60
                        "
                        style={{
                            background:
                                '#FFDF82',
                            color:
                                '#093C5D',
                        }}
                    >
                        {loading
                            ? 'Memproses...'
                            : submitLabel}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
