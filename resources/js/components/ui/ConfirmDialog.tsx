import {
    Modal,
} from './Modal';

type Props = {
    open: boolean;

    title: string;

    message: string;

    confirmLabel?: string;

    loading?: boolean;

    variant?: 'danger' | 'primary';

    onConfirm: () => void;

    onCancel: () => void;
};

export function ConfirmDialog({
    open,
    title,
    message,

    confirmLabel = 'Konfirmasi',

    loading = false,

    variant = 'primary',

    onConfirm,
    onCancel,
}: Props) {
    return (
        <Modal
            open={open}
            title={title}
            onClose={onCancel}
        >
            <div className="p-6">
                <p
                    className="
                        text-sm
                        leading-6
                        text-slate-600
                    "
                >
                    {message}
                </p>

                <div
                    className="
                        mt-6
                        flex
                        justify-end
                        gap-2
                    "
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-2
                            text-sm
                            font-medium
                        "
                    >
                        Batal
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`
                            rounded-lg
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-white
                            disabled:opacity-50

                            ${
                                variant ===
                                'danger'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-slate-900 hover:bg-slate-800'
                            }
                        `}
                    >
                        {loading
                            ? 'Memproses...'
                            : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}