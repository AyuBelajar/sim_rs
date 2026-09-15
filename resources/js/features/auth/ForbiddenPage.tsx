import {
    Link,
} from 'react-router-dom';

export function ForbiddenPage() {
    return (
        <div
            className="
                min-h-[70vh]
                flex
                items-center
                justify-center
            "
        >
            <div
                className="
                    max-w-md
                    text-center
                "
            >
                <div
                    className="
                        text-6xl
                        font-bold
                        text-slate-200
                    "
                >
                    403
                </div>

                <h1
                    className="
                        mt-4
                        text-xl
                        font-bold
                        text-slate-900
                    "
                >
                    Akses Ditolak
                </h1>

                <p
                    className="
                        mt-2
                        text-sm
                        leading-6
                        text-slate-500
                    "
                >
                    Anda tidak memiliki
                    hak akses untuk membuka
                    modul ini.
                </p>

                <Link
                    to="/"
                    className="
                        inline-flex
                        mt-5
                        rounded-lg
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                    "
                    style={{
                        background:
                            '#FFDF82',

                        color:
                            '#093C5D',
                    }}
                >
                    Kembali ke Dashboard
                </Link>
            </div>
        </div>
    );
}