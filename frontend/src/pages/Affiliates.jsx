import { useState, useMemo } from "react";
import AffiliateFilters from "../components/AffiliateFilters";
import AffiliateTable from "../components/AffiliateTable"; // Certifique-se que o import está correto

export default function Affiliates({ rows = [], onSelectAffiliate }) {
  const [filteredRows, setFilteredRows] = useState(rows);

  // Garante que a lista atualiza se os dados mudarem
  useMemo(() => {
    setFilteredRows(rows);
  }, [rows]);

  // Totais (KPIs) baseados no que está filtrado
  const totals = useMemo(() => {
    return filteredRows.reduce((acc, row) => ({
      registrations: acc.registrations + (Number(row.registrations) || 0),
      ftds: acc.ftds + (Number(row.ftds) || 0),
      commission: acc.commission + (Number(row.commission) || 0),
      net_pnl: acc.net_pnl + (Number(row.net_pnl) || 0)
    }), { registrations: 0, ftds: 0, commission: 0, net_pnl: 0 });
  }, [filteredRows]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* KPIs Gerais (Topo) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Afiliados Listados" value={filteredRows.length} />
        <KpiCard title="Total Registros" value={totals.registrations} />
        <KpiCard title="Total FTDs" value={totals.ftds} />
        <KpiCard title="Total Lucro" value={`USD ${totals.net_pnl.toFixed(2)}`} color="green" />
      </div>

      {/* Layout Principal: Sidebar + Tabela */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Barra Lateral de Filtros (Esquerda) */}
        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-6">
          <AffiliateFilters rows={rows} onFilter={setFilteredRows} />
        </aside>

        {/* Tabela (Direita) */}
        <div className="flex-1 w-full min-w-0">
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-lg">
            {/* Passamos 'data' para a tabela (verifique se sua tabela usa 'data' ou 'affiliates' como prop) */}
            <AffiliateTable 
              data={filteredRows} 
              onSelect={onSelectAffiliate} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, color }) {
  const textColor = color === "green" ? "text-emerald-400" : "text-white";
  return (
    <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5">
      <p className="text-gray-400 text-xs uppercase font-semibold mb-1">{title}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}