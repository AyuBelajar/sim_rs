import {
    useState,
    type FormEvent,
} from 'react';

import {
    Navigate,
    useNavigate,
} from 'react-router-dom';

import {
    ApiError,
} from '../../api/http';

import {
    useAuth,
} from './AuthContext';

export function LoginPage() {
    const navigate = useNavigate();

    const {
        login,
        user,
    } = useAuth();

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    if (user) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    async function handleSubmit(
        event: FormEvent,
    ) {
        event.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await login(
                email,
                password,
            );

            navigate('/');
        } catch (error) {
            if (error instanceof ApiError) {
                setError(error.message);
            } else {
                setError(
                    'Tidak dapat terhubung ke server.',
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="
                min-h-screen
                bg-white
                lg:flex
            "
        >
            {/* LEFT BRANDING */}
            <section
                className="
                    relative
                    hidden
                    overflow-hidden
                    px-12
                    py-10
                    text-white
                    lg:flex
                    lg:w-[44%]
                    lg:flex-col
                    lg:justify-between
                "
                style={{
                    background:
                        'linear-gradient(145deg, #073554 0%, #0B466C 100%)',
                }}
            >
                {/* Decorative elements */}
                <div
                    className="
                        absolute
                        -bottom-28
                        -left-24
                        h-80
                        w-80
                        rounded-full
                        bg-white/[0.03]
                    "
                />

                <div
                    className="
                        absolute
                        bottom-16
                        left-36
                        h-52
                        w-52
                        rounded-full
                        bg-cyan-300/[0.04]
                    "
                />

                {/* Identity */}
                <div className="relative z-10">
                    <div
                        className="
                            flex
                            items-center
                            gap-4
                        "
                    >
                        <div
                            className="
                                flex
                                h-16
                                w-16
                                shrink-0
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-2xl
                                bg-white
                                p-1.5
                                shadow-sm
                            "
                        >
                            <img
                                src="/images/logo-harapan-indonesia.png"
                                alt="Logo Rumah Sakit Harapan Indonesia"
                                className="
                                    h-full
                                    w-full
                                    object-contain
                                "
                            />
                        </div>

                        <div>
                            <p
                                className="
                                    text-xl
                                    font-bold
                                    leading-tight
                                "
                            >
                                Rumah Sakit
                                <br />
                                Harapan Indonesia
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    text-[10px]
                                    font-medium
                                    uppercase
                                    tracking-[0.22em]
                                    text-cyan-100/70
                                "
                            >
                                Sistem Informasi Rumah Sakit
                            </p>
                        </div>
                    </div>

                    <div
                        className="
                            mt-8
                            h-px
                            w-full
                            max-w-md
                            bg-white/15
                        "
                    />

                    <p
                        className="
                            mt-3
                            text-[10px]
                            uppercase
                            tracking-[0.3em]
                            text-slate-300
                        "
                    >
                        Pelayanan Terintegrasi untuk Kesehatan
                    </p>

                    <div className="mt-16">
                        <h1
                            className="
                                max-w-lg
                                text-4xl
                                font-bold
                                leading-[1.15]
                                tracking-tight
                            "
                        >
                            Sistem Informasi
                            <br />
                            Manajemen Rumah Sakit
                        </h1>

                        <p
                            className="
                                mt-5
                                max-w-md
                                text-sm
                                leading-7
                                text-slate-300
                            "
                        >
                            Satu sistem terintegrasi untuk
                            pelayanan pasien, rawat jalan,
                            rekam medis, keperawatan,
                            billing, dan pelaporan.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="
                        relative
                        z-10
                        text-xs
                        leading-6
                        text-slate-300
                    "
                >
                    <p
                        className="
                            font-semibold
                            text-white
                        "
                    >
                        Rumah Sakit Harapan Indonesia
                    </p>

                    <p>
                        Sistem Informasi Manajemen Rumah Sakit
                    </p>

                    <div
                        className="
                            my-3
                            h-px
                            w-10
                            bg-cyan-200/70
                        "
                    />

                    <p className="text-slate-400">
                        Kesehatan • Kepedulian • Masa Depan
                    </p>
                </div>
            </section>

            {/* RIGHT LOGIN */}
            <section
                className="
                    relative
                    flex
                    min-h-screen
                    flex-1
                    items-center
                    justify-center
                    overflow-hidden
                    px-6
                    py-12
                "
            >
                {/* Hospital background */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-cover
                        bg-center
                    "
                    style={{
                        backgroundImage:
                            "url('/images/rs-harapan-indonesia.png')",
                    }}
                />

                {/* Overlay */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-white/75
                        backdrop-blur-[1px]
                    "
                />

                {/* Mobile branding */}
                <div
                    className="
                        absolute
                        left-6
                        top-6
                        z-10
                        flex
                        items-center
                        gap-3
                        lg:hidden
                    "
                >
                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            overflow-hidden
                            rounded-xl
                            bg-white
                            p-1
                            shadow-sm
                        "
                    >
                        <img
                            src="/images/logo-harapan-indonesia.png"
                            alt="Logo Rumah Sakit Harapan Indonesia"
                            className="
                                h-full
                                w-full
                                object-contain
                            "
                        />
                    </div>

                    <div>
                        <p
                            className="
                                text-sm
                                font-bold
                                leading-tight
                                text-slate-900
                            "
                        >
                            Rumah Sakit
                            <br />
                            Harapan Indonesia
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-[10px]
                                text-slate-500
                            "
                        >
                            Sistem Informasi Rumah Sakit
                        </p>
                    </div>
                </div>

                {/* Login Card */}
                <div
                    className="
                        relative
                        z-10
                        w-full
                        max-w-md
                        rounded-2xl
                        border
                        border-white/70
                        bg-white/90
                        p-8
                        shadow-xl
                        shadow-slate-900/10
                        backdrop-blur-md
                        sm:p-10
                    "
                >
                    <div className="mb-8">
                        <div
                            className="
                                mb-5
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-xl
                                bg-white
                                p-1.5
                                shadow-sm
                                ring-1
                                ring-slate-100
                            "
                        >
                            <img
                                src="/images/logo-harapan-indonesia.png"
                                alt="Logo Rumah Sakit Harapan Indonesia"
                                className="
                                    h-full
                                    w-full
                                    object-contain
                                "
                            />
                        </div>

                        <h2
                            className="
                                text-3xl
                                font-bold
                                tracking-tight
                                text-slate-900
                            "
                        >
                            Selamat Datang
                        </h2>

                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            Masuk untuk mengakses SIMRS
                            <br />
                            Rumah Sakit Harapan Indonesia.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                "
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value,
                                    )
                                }
                                required
                                autoComplete="email"
                                placeholder="nama@rumahsakit.id"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50/90
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-cyan-600
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-cyan-50
                                "
                            />
                        </div>

                        <div>
                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                "
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value,
                                        )
                                    }
                                    required
                                    autoComplete="current-password"
                                    placeholder="Masukkan password"
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50/90
                                        px-4
                                        py-3
                                        pr-24
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-cyan-600
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-cyan-50
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword,
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-xs
                                        font-medium
                                        text-slate-500
                                        transition
                                        hover:text-slate-800
                                    "
                                >
                                    {showPassword
                                        ? 'Sembunyikan'
                                        : 'Lihat'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-red-700
                                "
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                rounded-xl
                                bg-[#093C5D]
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-[#0B4B70]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            {loading
                                ? 'Memverifikasi...'
                                : 'Masuk'}
                        </button>
                    </form>

                    <div
                        className="
                            my-6
                            h-px
                            bg-slate-200
                        "
                    />

                    <p
                        className="
                            text-center
                            text-xs
                            leading-5
                            text-slate-400
                        "
                    >
                        Gunakan akun yang telah
                        didaftarkan administrator.
                    </p>
                </div>

                {/* Bottom label */}
                <div
                    className="
                        absolute
                        bottom-6
                        right-8
                        z-10
                        hidden
                        text-right
                        lg:block
                    "
                >
                    <p
                        className="
                            text-xs
                            font-semibold
                            text-slate-600
                        "
                    >
                        Rumah Sakit Harapan Indonesia
                    </p>

                    <p
                        className="
                            mt-1
                            text-[11px]
                            text-slate-400
                        "
                    >
                        Sistem Informasi Manajemen Rumah Sakit
                    </p>
                </div>
            </section>
        </div>
    );
}