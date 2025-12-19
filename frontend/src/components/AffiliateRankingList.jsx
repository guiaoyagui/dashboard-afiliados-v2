export default function AffiliateRankingList({ rows }) {
  const ranking = [...rows]
    .sort((a, b) => b.commission - a.commission)
    .slice(0, 10);

  return (
    <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">🏆 Ranking de Afiliados</h2>

      <ul className="space-y-3">
        {ranking.map((row, index) => (
          <li
            key={row.id}
            className="flex items-center justify-between bg-[#111] p-3 rounded-lg"
          >
            <div>
              <p className="text-sm text-gray-400">#{index + 1}</p>
              <p className="font-semibold">{row.affiliate}</p>
            </div>

            <p className="text-green-400 font-semibold">
              ${Number(row.commission || 0).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
