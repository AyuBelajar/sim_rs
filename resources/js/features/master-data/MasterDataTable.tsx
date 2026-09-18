import {
    useEffect,
    useState,
} from 'react';

import { api } from '../../api/http';

type Column<T> = {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
};

type Props<T> = {
    endpoint: string;
    columns: Column<T>[];
    getRowKey: (item: T) => string | number;
};

export function MasterDataTable<T>({
    endpoint,
    columns,
    getRowKey,
}: Props<T>) {
    const [items, setItems] =
        useState<T[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        api<{ data: T[] }>(endpoint)
            .then((res) =>
                setItems(res.data),
            )
            .catch(() =>
                setError(
                    'Gagal memuat data.',
                ),
            )
            .finally(() =>
                setLoading(false),
            );
    }, [endpoint]);

    if (loading) {
        return (
            <p className="text-sm text-slate-400 py-6 text-center">
                Memuat data...
            </p>
        );
    }

    if (error) {
        return (
            <p className="text-sm text-red-500 py-6 text-center">
                {error}
            </p>
        );
    }

    if (items.length === 0) {
        return (
            <p className="text-sm text-slate-400 py-6 text-center">
                Belum ada data.
            </p>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50">
                    <tr className="border-b border-slate-100">
                        {columns.map(
                            (col) => (
                                <th
                                    key={
                                        col.key
                                    }
                                    className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                                >
                                    {
                                        col.label
                                    }
                                </th>
                            ),
                        )}
                    </tr>
                </thead>

                <tbody>
                    {items.map(
                        (item) => (
                            <tr
                                key={getRowKey(
                                    item,
                                )}
                                className="border-b border-slate-50 hover:bg-slate-50"
                            >
                                {columns.map(
                                    (
                                        col,
                                    ) => (
                                        <td
                                            key={
                                                col.key
                                            }
                                            className="px-4 py-3 text-slate-700"
                                        >
                                            {col.render
                                                ? col.render(
                                                      item,
                                                  )
                                                : String(
                                                      (item as any)[
                                                          col
                                                              .key
                                                      ] ??
                                                          '-',
                                                  )}
                                        </td>
                                    ),
                                )}
                            </tr>
                        ),
                    )}
                </tbody>
            </table>
        </div>
    );
}