export default function VerdictBadge({ verdict }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${verdict.color}`}>
        {verdict.label}
      </span>
      <span className="text-[11px] text-gray-500 mt-1">{verdict.msg}</span>
    </div>
  );
}
