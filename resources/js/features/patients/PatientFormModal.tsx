import {
    useEffect,
    useState,
    type FormEvent,
} from 'react';

import {
    AlertCircle,
    BriefcaseBusiness,
    CalendarDays,
    Droplets,
    IdCard,
    Loader2,
    Mail,
    MapPin,
    NotebookPen,
    Phone,
    Save,
    UserRound,
} from 'lucide-react';

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
    onSaved: () => void;
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
            if (patient) {
                await updatePatient(
                    patient.id,
                    payload,
                );
            } else {
                await createPatient(
                    payload,
                );
            }

            onSaved();
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


    const baseInputClass = `
        mt-1.5
        w-full
        rounded-xl
        border
        bg-white
        px-3.5
        py-2.5
        text-sm
        text-slate-700
        outline-none
        transition
        placeholder:text-slate-400
        focus:ring-2
    `;


    function inputClass(
        field?: string,
    ) {
        const hasError =
            field &&
            Boolean(
                errors[field]?.length,
            );

        return `
            ${baseInputClass}
            ${
                hasError
                    ? `
                        border-red-300
                        focus:border-red-400
                        focus:ring-red-100
                    `
                    : `
                        border-slate-200
                        focus:border-[#5DDCC5]
                        focus:ring-[#5DF8D8]/20
                    `
            }
        `;
    }


    const fieldError = (
        name: string,
    ) => errors[name]?.[0];


    function FieldError({
        name,
    }: {
        name: string;
    }) {
        const message =
            fieldError(name);

        if (!message) {
            return null;
        }

        return (
            <p className="
                mt-1.5
                flex
                items-center
                gap-1
                text-xs
                text-red-600
            ">
                <AlertCircle
                    size={12}
                />

                {message}
            </p>
        );
    }


    return (
        <Modal
            open={open}
            onClose={onClose}
            title={
                patient
                    ? `Edit Pasien ${patient.medical_record_no}`
                    : 'Tambah Pasien'
            }
            description={
                patient
                    ? 'Perbarui informasi identitas dan data pasien.'
                    : 'Lengkapi informasi pasien untuk membuat data pasien baru.'
            }
        >
            <form
                onSubmit={
                    handleSubmit
                }
            >
                <div className="
                    space-y-7
                    px-6
                    py-6
                ">

                    {/* GENERAL ERROR */}
                    {error && (
                        <div className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
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
                                    Data belum dapat
                                    disimpan
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


                    {/* IDENTITAS */}
                    <section>
                        <SectionHeading
                            icon={
                                UserRound
                            }
                            title="Identitas Pasien"
                            description="Informasi identitas utama pasien."
                        />

                        <div className="
                            mt-4
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-2
                        ">
                            <div>
                                <FieldLabel>
                                    Gelar
                                </FieldLabel>

                                <select
                                    className={
                                        inputClass(
                                            'title',
                                        )
                                    }
                                    value={
                                        form.title
                                    }
                                    onChange={(e) =>
                                        change(
                                            'title',
                                            e.target
                                                .value,
                                        )
                                    }
                                >
                                    <option value="">
                                        Pilih gelar
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

                                <FieldError
                                    name="title"
                                />
                            </div>


                            <div>
                                <FieldLabel
                                    required
                                >
                                    Nama Lengkap
                                </FieldLabel>

                                <input
                                    className={
                                        inputClass(
                                            'full_name',
                                        )
                                    }
                                    value={
                                        form.full_name
                                    }
                                    placeholder="Masukkan nama lengkap pasien"
                                    onChange={(e) =>
                                        change(
                                            'full_name',
                                            e.target
                                                .value,
                                        )
                                    }
                                />

                                <FieldError
                                    name="full_name"
                                />
                            </div>


                            <div>
                                <FieldLabel>
                                    Nama Panggilan
                                </FieldLabel>

                                <input
                                    className={
                                        inputClass(
                                            'nickname',
                                        )
                                    }
                                    value={
                                        form.nickname
                                    }
                                    placeholder="Nama panggilan pasien"
                                    onChange={(e) =>
                                        change(
                                            'nickname',
                                            e.target
                                                .value,
                                        )
                                    }
                                />

                                <FieldError
                                    name="nickname"
                                />
                            </div>


                            <div>
                                <FieldLabel>
                                    NIK
                                </FieldLabel>

                                <div className="
                                    relative
                                ">
                                    <IdCard
                                        size={16}
                                        className="
                                            absolute
                                            left-3.5
                                            top-[17px]
                                            text-slate-400
                                        "
                                    />

                                    <input
                                        className={`
                                            ${inputClass(
                                                'nik',
                                            )}
                                            pl-10
                                        `}
                                        maxLength={
                                            16
                                        }
                                        inputMode="numeric"
                                        value={
                                            form.nik
                                        }
                                        placeholder="16 digit NIK"
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
                                </div>

                                <FieldError
                                    name="nik"
                                />
                            </div>
                        </div>
                    </section>


                    <Divider />


                    {/* KELAHIRAN */}
                    <section>
                        <SectionHeading
                            icon={
                                CalendarDays
                            }
                            title="Data Kelahiran"
                            description="Informasi kelahiran dan data biologis pasien."
                        />

                        <div className="
                            mt-4
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-2
                        ">
                            <div>
                                <FieldLabel
                                    required
                                >
                                    Jenis Kelamin
                                </FieldLabel>

                                <select
                                    className={
                                        inputClass(
                                            'gender',
                                        )
                                    }
                                    value={
                                        form.gender
                                    }
                                    onChange={(e) =>
                                        change(
                                            'gender',
                                            e.target
                                                .value,
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

                                <FieldError
                                    name="gender"
                                />
                            </div>


                            <div>
                                <FieldLabel
                                    required
                                >
                                    Tanggal Lahir
                                </FieldLabel>

                                <input
                                    type="date"
                                    className={
                                        inputClass(
                                            'birth_date',
                                        )
                                    }
                                    value={
                                        form.birth_date
                                    }
                                    onChange={(e) =>
                                        change(
                                            'birth_date',
                                            e.target
                                                .value,
                                        )
                                    }
                                />

                                <FieldError
                                    name="birth_date"
                                />
                            </div>


                            <div>
                                <FieldLabel>
                                    Tempat Lahir
                                </FieldLabel>

                                <div className="
                                    relative
                                ">
                                    <MapPin
                                        size={16}
                                        className="
                                            absolute
                                            left-3.5
                                            top-[17px]
                                            text-slate-400
                                        "
                                    />

                                    <input
                                        className={`
                                            ${inputClass(
                                                'birth_place',
                                            )}
                                            pl-10
                                        `}
                                        value={
                                            form.birth_place
                                        }
                                        placeholder="Kota tempat lahir"
                                        onChange={(e) =>
                                            change(
                                                'birth_place',
                                                e.target
                                                    .value,
                                            )
                                        }
                                    />
                                </div>

                                <FieldError
                                    name="birth_place"
                                />
                            </div>


                            <div>
                                <FieldLabel>
                                    Golongan Darah
                                </FieldLabel>

                                <div className="
                                    relative
                                ">
                                    <Droplets
                                        size={16}
                                        className="
                                            pointer-events-none
                                            absolute
                                            left-3.5
                                            top-[17px]
                                            z-10
                                            text-slate-400
                                        "
                                    />

                                    <select
                                        className={`
                                            ${inputClass(
                                                'blood_type',
                                            )}
                                            pl-10
                                        `}
                                        value={
                                            form.blood_type
                                        }
                                        onChange={(e) =>
                                            change(
                                                'blood_type',
                                                e.target
                                                    .value,
                                            )
                                        }
                                    >
                                        <option value="">
                                            Pilih golongan darah
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

                                <FieldError
                                    name="blood_type"
                                />
                            </div>
                        </div>
                    </section>


                    <Divider />


                    {/* CONTACT */}
                    <section>
                        <SectionHeading
                            icon={
                                Phone
                            }
                            title="Kontak & Informasi Tambahan"
                            description="Informasi yang dapat digunakan untuk melengkapi profil pasien."
                        />

                        <div className="
                            mt-4
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-2
                        ">
                            <div>
                                <FieldLabel>
                                    Telepon
                                </FieldLabel>

                                <div className="
                                    relative
                                ">
                                    <Phone
                                        size={16}
                                        className="
                                            absolute
                                            left-3.5
                                            top-[17px]
                                            text-slate-400
                                        "
                                    />

                                    <input
                                        className={`
                                            ${inputClass(
                                                'phone',
                                            )}
                                            pl-10
                                        `}
                                        value={
                                            form.phone
                                        }
                                        placeholder="Contoh: 081234567890"
                                        onChange={(e) =>
                                            change(
                                                'phone',
                                                e.target
                                                    .value,
                                            )
                                        }
                                    />
                                </div>

                                <FieldError
                                    name="phone"
                                />
                            </div>


                            <div>
                                <FieldLabel>
                                    Email
                                </FieldLabel>

                                <div className="
                                    relative
                                ">
                                    <Mail
                                        size={16}
                                        className="
                                            absolute
                                            left-3.5
                                            top-[17px]
                                            text-slate-400
                                        "
                                    />

                                    <input
                                        type="email"
                                        className={`
                                            ${inputClass(
                                                'email',
                                            )}
                                            pl-10
                                        `}
                                        value={
                                            form.email
                                        }
                                        placeholder="nama@email.com"
                                        onChange={(e) =>
                                            change(
                                                'email',
                                                e.target
                                                    .value,
                                            )
                                        }
                                    />
                                </div>

                                <FieldError
                                    name="email"
                                />
                            </div>


                            <div>
                                <FieldLabel>
                                    Agama
                                </FieldLabel>

                                <input
                                    className={
                                        inputClass(
                                            'religion',
                                        )
                                    }
                                    value={
                                        form.religion
                                    }
                                    placeholder="Masukkan agama"
                                    onChange={(e) =>
                                        change(
                                            'religion',
                                            e.target
                                                .value,
                                        )
                                    }
                                />

                                <FieldError
                                    name="religion"
                                />
                            </div>


                            <div>
                                <FieldLabel>
                                    Pekerjaan
                                </FieldLabel>

                                <div className="
                                    relative
                                ">
                                    <BriefcaseBusiness
                                        size={16}
                                        className="
                                            absolute
                                            left-3.5
                                            top-[17px]
                                            text-slate-400
                                        "
                                    />

                                    <input
                                        className={`
                                            ${inputClass(
                                                'occupation',
                                            )}
                                            pl-10
                                        `}
                                        value={
                                            form.occupation
                                        }
                                        placeholder="Pekerjaan pasien"
                                        onChange={(e) =>
                                            change(
                                                'occupation',
                                                e.target
                                                    .value,
                                            )
                                        }
                                    />
                                </div>

                                <FieldError
                                    name="occupation"
                                />
                            </div>
                        </div>
                    </section>


                    <Divider />


                    {/* NOTES */}
                    <section>
                        <SectionHeading
                            icon={
                                NotebookPen
                            }
                            title="Catatan Khusus"
                            description="Tambahkan informasi penting lain terkait pasien bila diperlukan."
                        />

                        <div className="
                            mt-4
                        ">
                            <textarea
                                rows={4}
                                className={`
                                    ${inputClass(
                                        'special_notes',
                                    )}
                                    resize-none
                                `}
                                value={
                                    form.special_notes
                                }
                                placeholder="Contoh: alergi tertentu, kebutuhan khusus, atau informasi penting lainnya..."
                                onChange={(e) =>
                                    change(
                                        'special_notes',
                                        e.target
                                            .value,
                                    )
                                }
                            />

                            <FieldError
                                name="special_notes"
                            />
                        </div>
                    </section>
                </div>


                {/* FOOTER */}
                <div className="
                    sticky
                    bottom-0
                    flex
                    items-center
                    justify-between
                    gap-3
                    border-t
                    border-slate-200
                    bg-white
                    px-6
                    py-4
                    shadow-[0_-4px_12px_rgba(15,23,42,0.04)]
                ">
                    <p className="
                        hidden
                        text-xs
                        text-slate-400
                        sm:block
                    ">
                        <span className="
                            text-red-500
                        ">
                            *
                        </span>
                        {' '}
                        Wajib diisi
                    </p>

                    <div className="
                        ml-auto
                        flex
                        items-center
                        gap-2
                    ">
                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                loading
                            }
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-600
                                transition
                                hover:bg-slate-50
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="
                                inline-flex
                                min-w-[145px]
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-[#FFDF82]
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-[#093C5D]
                                shadow-sm
                                transition
                                hover:bg-[#F8D36A]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={16}
                                        className="
                                            animate-spin
                                        "
                                    />

                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save
                                        size={16}
                                    />

                                    {patient
                                        ? 'Simpan Perubahan'
                                        : 'Simpan Pasien'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}


function SectionHeading({
    icon: Icon,
    title,
    description,
}: {
    icon: typeof UserRound;
    title: string;
    description: string;
}) {
    return (
        <div className="
            flex
            items-start
            gap-3
        ">
            <div className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#E8FCF7]
                text-[#087C70]
            ">
                <Icon size={17} />
            </div>

            <div>
                <h3 className="
                    text-sm
                    font-bold
                    text-slate-800
                ">
                    {title}
                </h3>

                <p className="
                    mt-0.5
                    text-xs
                    text-slate-400
                ">
                    {description}
                </p>
            </div>
        </div>
    );
}


function FieldLabel({
    children,
    required = false,
}: {
    children: React.ReactNode;
    required?: boolean;
}) {
    return (
        <label className="
            text-xs
            font-semibold
            text-slate-600
        ">
            {children}

            {required && (
                <span className="
                    ml-1
                    text-red-500
                ">
                    *
                </span>
            )}
        </label>
    );
}


function Divider() {
    return (
        <div className="
            border-t
            border-slate-100
        " />
    );
}