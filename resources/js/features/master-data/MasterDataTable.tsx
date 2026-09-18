import {
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import {
    AlertCircle,
    Database,
    Search,
    X,
} from 'lucide-react';

import { api } from '../../api/http';


type Column<T> = {
    key: string;
    label: string;
    render?: (item: T) => ReactNode;
};


type Props<T> = {
    endpoint: string;
    columns: Column<T>[];
    getRowKey: (
        item: T,
    ) => string | number;

    searchPlaceholder?: string;
};


export function MasterDataTable<T>({
    endpoint,
    columns,
    getRowKey,
    searchPlaceholder =
        'Cari data...',
}: Props<T>) {
    const [items, setItems] =
        useState<T[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(
            null,
        );

    const [
        search,
        setSearch,
    ] = useState('');


    useEffect(() => {
        setLoading(true);
        setError(null);
        setSearch('');

        api<{ data: T[] }>(
            endpoint,
        )
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


    const filteredItems =
        useMemo(() => {
            const keyword =
                search
                    .trim()
                    .toLowerCase();

            if (!keyword) {
                return items;
            }

            return items.filter(
                (item) =>
                    Object.values(
                        item as Record<
                            string,
                            unknown
                        >,
                    ).some(
                        (value) => {
                            if (
                                value ===
                                    null ||
                                value ===
                                    undefined ||
                                typeof value ===
                                    'object'
                            ) {
                                return false;
                            }

                            return String(
                                value,
                            )
                                .toLowerCase()
                                .includes(
                                    keyword,
                                );
                        },
                    ),
            );
        }, [items, search]);


    return (
        <div className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
        ">
            {/* TOOLBAR */}
            <div className="
                flex
                flex-col
                gap-3
                border-b
                border-slate-100
                p-4
                sm:flex-row
                sm:items-center
                sm:justify-between
            ">
                <div className="
                    relative
                    w-full
                    sm:max-w-md
                ">
                    <Search
                        size={16}
                        className="
                            absolute
                            left-3.5
                            top-1/2
                            -translate-y-1/2
                            text-slate-400
                        "
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target
                                    .value,
                            )
                        }
                        placeholder={
                            searchPlaceholder
                        }
                        className="
                            h-10
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            pl-10
                            pr-10
                            text-sm
                            text-slate-700
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:border-[#5DDCC5]
                            focus:ring-2
                            focus:ring-[#5DF8D8]/20
                        "
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearch('')
                            }
                            className="
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                                transition
                                hover:text-slate-700
                            "
                        >
                            <X
                                size={15}
                            />
                        </button>
                    )}
                </div>

                {!loading &&
                    !error && (
                    <div className="
                        text-xs
                        text-slate-400
                    ">
                        <span className="
                            font-semibold
                            text-slate-600
                        ">
                            {
                                filteredItems
                                    .length
                            }
                        </span>
                        {' '}
                        dari
                        {' '}
                        <span className="
                            font-semibold
                            text-slate-600
                        ">
                            {items.length}
                        </span>
                        {' '}
                        data
                    </div>
                )}
            </div>


            {/* LOADING */}
            {loading && (
                <div className="
                    flex
                    min-h-[280px]
                    flex-col
                    items-center
                    justify-center
                    gap-3
                ">
                    <div className="
                        h-7
                        w-7
                        animate-spin
                        rounded-full
                        border-2
                        border-slate-200
                        border-t-[#093C5D]
                    " />

                    <p className="
                        text-xs
                        text-slate-400
                    ">
                        Memuat master
                        data...
                    </p>
                </div>
            )}


            {/* ERROR */}
            {!loading &&
                error && (
                <div className="
                    flex
                    min-h-[280px]
                    flex-col
                    items-center
                    justify-center
                    px-6
                    text-center
                ">
                    <div className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        bg-red-50
                        text-red-500
                    ">
                        <AlertCircle
                            size={21}
                        />
                    </div>

                    <p className="
                        mt-3
                        text-sm
                        font-semibold
                        text-slate-700
                    ">
                        Data tidak dapat
                        dimuat
                    </p>

                    <p className="
                        mt-1
                        text-xs
                        text-slate-400
                    ">
                        {error}
                    </p>
                </div>
            )}


            {/* EMPTY */}
            {!loading &&
                !error &&
                items.length ===
                    0 && (
                <EmptyState
                    title="Belum ada data"
                    description="Master data ini belum memiliki data yang tersimpan."
                />
            )}


            {/* SEARCH EMPTY */}
            {!loading &&
                !error &&
                items.length > 0 &&
                filteredItems.length ===
                    0 && (
                <EmptyState
                    title="Data tidak ditemukan"
                    description={`Tidak ada data yang cocok dengan pencarian "${search}".`}
                />
            )}


            {/* TABLE */}
            {!loading &&
                !error &&
                filteredItems.length >
                    0 && (
                <div className="
                    overflow-x-auto
                ">
                    <table className="
                        w-full
                        text-sm
                    ">
                        <thead className="
                            bg-slate-50
                        ">
                            <tr className="
                                border-b
                                border-slate-200
                            ">
                                {columns.map(
                                    (
                                        col,
                                    ) => (
                                        <th
                                            key={
                                                col.key
                                            }
                                            className="
                                                whitespace-nowrap
                                                px-5
                                                py-3.5
                                                text-left
                                                text-xs
                                                font-semibold
                                                text-slate-500
                                            "
                                        >
                                            {
                                                col.label
                                            }
                                        </th>
                                    ),
                                )}
                            </tr>
                        </thead>

                        <tbody className="
                            divide-y
                            divide-slate-100
                        ">
                            {filteredItems.map(
                                (
                                    item,
                                ) => (
                                    <tr
                                        key={getRowKey(
                                            item,
                                        )}
                                        className="
                                            transition
                                            hover:bg-slate-50/70
                                        "
                                    >
                                        {columns.map(
                                            (
                                                col,
                                            ) => (
                                                <td
                                                    key={
                                                        col.key
                                                    }
                                                    className="
                                                        px-5
                                                        py-4
                                                        text-slate-600
                                                    "
                                                >
                                                    {col.render
                                                        ? col.render(
                                                              item,
                                                          )
                                                        : String(
                                                              (
                                                                  item as Record<
                                                                      string,
                                                                      unknown
                                                                  >
                                                              )[
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
            )}


            {/* FOOTER */}
            {!loading &&
                !error &&
                items.length > 0 && (
                <div className="
                    border-t
                    border-slate-100
                    bg-slate-50/50
                    px-5
                    py-3.5
                    text-xs
                    text-slate-400
                ">
                    Menampilkan
                    {' '}
                    <span className="
                        font-semibold
                        text-slate-600
                    ">
                        {
                            filteredItems
                                .length
                        }
                    </span>
                    {' '}
                    data
                </div>
            )}
        </div>
    );
}


function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="
            flex
            min-h-[280px]
            flex-col
            items-center
            justify-center
            px-6
            text-center
        ">
            <div className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-slate-100
                text-slate-400
            ">
                <Database
                    size={21}
                />
            </div>

            <p className="
                mt-3
                text-sm
                font-semibold
                text-slate-700
            ">
                {title}
            </p>

            <p className="
                mt-1
                max-w-sm
                text-xs
                text-slate-400
            ">
                {description}
            </p>
        </div>
    );
}