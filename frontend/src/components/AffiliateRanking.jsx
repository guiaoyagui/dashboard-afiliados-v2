export default function AffiliateRanking({ rows = [], type }) {
  if (!rows.length) return null;

  const sorted = [...rows].filter(r => r?.net !== undefined);

  if (!sorted.length) return null;

  sorted.sort((a, b) =>
    type === "best" ? b.net - a.net : a.net - b.net
  );

  const aff = sorted[0];

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
      <p className="text-sm text-gray-400 mb-2">
        {type === "best" ? "Melhor performance" : "Pior performance"}
      </p>

      <p className="text-xl font-semibold">
        {aff.affiliate || "—"}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          aff.net >= 0 ? "text-green-400" : "text-red-400"
        }`}
      >
        R$ {(aff.net ?? 0).toLocaleString("pt-BR")}
      </p>
    </div>
  );
}
