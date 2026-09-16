type ModulePlaceholderProps = {
    title: string;
    description: string;
    owner?: string;
};

export function ModulePlaceholder({
    title,
    description,
    owner,
}: ModulePlaceholderProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="
                    text-2xl
                    font-bold
                    text-slate-900
                ">
                    {title}
                </h1>

                <p className="
                    mt-1
                    text-sm
                    text-slate-500
                ">
                    {description}
                </p>
            </div>

            <div className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-6
            ">
                <div className="
                    text-sm
                    font-semibold
                    text-slate-700
                ">
                    Modul sedang dalam tahap integrasi.
                </div>

                {owner && (
                    <div className="
                        mt-2
                        text-xs
                        text-slate-500
                    ">
                        PIC: {owner}
                    </div>
                )}

                <p className="
                    mt-4
                    text-sm
                    text-slate-500
                ">
                    Halaman ini merupakan integration
                    placeholder dan akan digantikan oleh
                    implementasi modul terkait.
                </p>
            </div>
        </div>
    );
}