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
    const navigate =
        useNavigate();

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
        <div className="min-h-screen flex bg-white">
            <section
                className="
                    hidden lg:flex
                    lg:w-[45%]
                    relative
                    flex-col
                    justify-between
                    px-12
                    py-12
                    overflow-hidden
                    text-white
                "
                style={{
                    background: '#093C5D',
                }}
            >
                <div>
                    <div
                        className="
                            w-12 h-12
                            rounded-xl
                            flex items-center
                            justify-center
                            font-bold
                            text-lg
                            mb-8
                        "
                        style={{
                            background:
                                '#FFDF82',
                            color:
                                '#093C5D',
                        }}
                    >
                        RS
                    </div>

                    <h1 className="
                        text-3xl
                        font-bold
                        leading-tight
                        max-w-md
                    ">
                        Sistem Informasi
                        Manajemen Rumah Sakit
                    </h1>

                    <p className="
                        mt-4
                        text-sm
                        leading-6
                        text-slate-300
                        max-w-md
                    ">
                        Satu sistem terintegrasi untuk
                        pelayanan pasien, rawat jalan,
                        rekam medis, keperawatan,
                        billing, dan pelaporan.
                    </p>
                </div>

                <div className="
                    text-xs
                    text-slate-400
                ">
                    SIMRS • Internal Hospital System
                </div>
            </section>

            <section className="
                flex-1
                flex
                items-center
                justify-center
                px-6
                py-12
            ">
                <div className="
                    w-full
                    max-w-md
                ">
                    <div className="mb-8">
                        <h2 className="
                            text-2xl
                            font-bold
                            text-slate-900
                        ">
                            Selamat Datang
                        </h2>

                        <p className="
                            mt-1.5
                            text-sm
                            text-slate-500
                        ">
                            Masuk untuk mengakses SIMRS.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <div>
                            <label className="
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                mb-1.5
                            ">
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
                                    border
                                    border-slate-200
                                    rounded-lg
                                    px-3.5
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-cyan-600
                                    focus:ring-2
                                    focus:ring-cyan-50
                                "
                            />
                        </div>

                        <div>
                            <label className="
                                block
                                text-sm
                                font-medium
                                text-slate-700
                                mb-1.5
                            ">
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
                                        border
                                        border-slate-200
                                        rounded-lg
                                        px-3.5
                                        py-2.5
                                        pr-20
                                        text-sm
                                        outline-none
                                        focus:border-cyan-600
                                        focus:ring-2
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
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-xs
                                        font-medium
                                        text-slate-500
                                    "
                                >
                                    {showPassword
                                        ? 'Sembunyikan'
                                        : 'Lihat'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                px-3.5
                                py-3
                                text-sm
                                text-red-700
                            ">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                rounded-lg
                                py-2.5
                                text-sm
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
                                ? 'Memverifikasi...'
                                : 'Masuk'}
                        </button>
                    </form>

                    <p className="
                        text-xs
                        text-slate-400
                        text-center
                        mt-4
                    ">
                        Gunakan akun yang telah
                        didaftarkan administrator.
                    </p>
                </div>
            </section>
        </div>
    );
}