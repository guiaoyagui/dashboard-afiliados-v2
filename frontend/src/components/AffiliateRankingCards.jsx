export default function AffiliateRankingCards({ rows }) {
  if (!rows?.length) return null;

  const top3 = [...rows]
    .filter(row => row.net !== undefined)
    .sort((a, b) => (b.net || 0) - (a.net || 0))
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {top3.map((row, index) => (
        <div
          key={row.id || index}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold">
            🏆 #{index + 1}
          </h3>

          <p className="text-xl mt-2">
            {row.name || "Sem nome"}
          </p>

          <p className="text-green-400 mt-1">
            ${ (Number(row.net) || 0).toFixed(2) }
          </p>

          <p className="text-gray-400 text-sm">
            FTDs: {Number(row.ftds) || 0}
          </p>
        </div>
      ))}
    </div>
  );
}
