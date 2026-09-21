type Props = {
    value: number;
    label: string;
    accent: 'emerald' | 'slate' | 'amber' | 'green';
};

const borderMap: Record<Props['accent'], string> = {
    emerald: 'border-l-emerald-400',
    slate: 'border-l-slate-400',
    amber: 'border-l-amber-400',
    green: 'border-l-green-400',
};

export function StatCard({ value, label, accent }: Props) {
    return (
        <div className={`rounded-xl border border-slate-200 border-l-4 ${borderMap[accent]} bg-white p-5`}>
            <div className="text-3xl font-bold text-slate-800">{value}</div>
            <div className="text-sm text-slate-500 mt-1">{label}</div>
        </div>
    );
}