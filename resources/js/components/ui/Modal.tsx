import {
    useEffect,
    type ReactNode,
} from 'react';

import {
    X,
} from 'lucide-react';

type Props = {
    open: boolean;
    title: string;
    description?: string;
    children: ReactNode;
    onClose: () => void;
};

export function Modal({
    open,
    title,
    description,
    children,
    onClose,
}: Props) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const handler = (
            event: KeyboardEvent,
        ) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener(
            'keydown',
            handler,
        );

        document.body.style.overflow =
            'hidden';

        return () => {
            document.removeEventListener(
                'keydown',
                handler,
            );

            document.body.style.overflow =
                '';
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-slate-950/45
                p-4
                backdrop-blur-[2px]
            "
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="
                    flex
                    max-h-[92vh]
                    w-full
                    max-w-4xl
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
            >
                <div
                    className="
                        flex
                        shrink-0
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-slate-100
                        px-6
                        py-5
                    "
                >
                    <div>
                        <h2
                            id="modal-title"
                            className="
                                text-lg
                                font-bold
                                text-slate-900
                            "
                        >
                            {title}
                        </h2>

                        {description && (
                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup modal"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                    "
                >
                    {children}
                </div>
            </div>
        </div>
    );
}