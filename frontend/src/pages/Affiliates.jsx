import { useEffect, useState } from "react";

export default function Affiliates() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3333/api/affiliates")
      .then(res => res.json())
      .then(data => {
        setAffiliates(data.affiliates || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-gray-400">Carregando afiliados...</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <Kpi title="Afiliados" value={affiliates.length} />
        <Kpi
          title="Registros"
          value={affiliates.reduce((a, b) => a + b.registrations, 0)}
        />
        <Kpi
          title="Comissão Total"
          value={`$${affiliates
            .reduce((a, b) => a + b.commission, 0)
            .toFixed(2)}`}
        />
      </div>

      {/* Ranking */}
      <div className="bg-zinc-900 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">🏆 Top 10 Afiliados</h2>
        {affiliates
          .sort((a, b) => b.commission - a.commission)
          .slice(0, 10)
          .map((a, i) => (
            <div key={i} className="flex justify-between py-1">
              <span>#{i + 1} {a.affiliate}</span>
              <span className="font-semibold">${a.commission.toFixed(2)}</span>
            </div>
          ))}
      </div>

      {/* Tabela */}
      <table className="w-full text-sm">
        <thead className="text-gray-400 border-b border-zinc-800">
          <tr>
            <th className="text-left py-2">Afiliado</th>
            <th>Registros</th>
            <th>FTDs</th>
            <th>Comissão</th>
            <th>Net P&L</th>
          </tr>
        </thead>
        <tbody>
          {affiliates.map((a, i) => (
            <tr key={i} className="border-b border-zinc-800">
              <td className="py-2">{a.affiliate}</td>
              <td className="text-center">{a.registrations}</td>
              <td className="text-center">{a.ftds}</td>
              <td className="text-center">${a.commission.toFixed(2)}</td>
              <td className="text-center">${a.net_pl.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="bg-zinc-900 rounded-xl p-4">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
