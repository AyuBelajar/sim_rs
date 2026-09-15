import {
    useEffect,
    type ReactNode,
} from 'react';

type Props = {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
};

export function Modal({
    open,
    title,
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
                fixed inset-0 z-50
                flex items-center justify-center
                bg-slate-950/40
                p-4
            "
        >
            <div
                className="
                    w-full max-w-4xl
                    max-h-[92vh]
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-2xl
                "
            >
                <div
                    className="
                        h-16 px-6
                        border-b border-slate-200
                        flex items-center
                        justify-between
                    "
                >
                    <h2 className="font-semibold">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            w-9 h-9
                            rounded-lg
                            hover:bg-slate-100
                        "
                    >
                        ✕
                    </button>
                </div>

                <div
                    className="
                        overflow-y-auto
                        max-h-[calc(92vh-4rem)]
                    "
                >
                    {children}
                </div>
            </div>
        </div>
    );
}