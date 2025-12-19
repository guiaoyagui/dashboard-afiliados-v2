export default function KpiCard({ title, value, color = "text-white" }) {
  return (
    <div className="bg-[#1E1E1E] p-5 rounded-xl shadow-lg border border-gray-800">
      <span className="text-xs text-gray-400 font-bold uppercase">{title}</span>
      <div className={`text-2xl font-bold mt-1 ${color}`}>
        {value}
      </div>
    </div>
  );
}
