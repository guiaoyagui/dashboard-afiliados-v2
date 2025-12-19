import { useMemo } from "react";

// components
import KpiGrid from "../components/KpiGrid";
import FinancialChart from "../components/FinancialChart";
import AffiliateRanking from "../components/AffiliateRanking";

// utils
import { calculateKpis } from "../utils/metrics";

export default function Overview({ rows }) {
  // KPIs
  const kpis = useMemo(() => calculateKpis(rows), [rows]);

  // Dados do gráfico
  const financialData = useMemo(() => {
    if (!rows.length) return [];

    return rows.map((r, index) => ({
      day: r.dt ? r.dt.split("T")[0] : `Dia ${index + 1}`,
      Depositos: Number(r.deposit_total || 0),
      Lucro: Number(r.net_pl || 0),
    }));
  }, [rows]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <KpiGrid kpis={kpis} />

      {/* Gráfico */}
      {rows.length === 0 ? (
        <div className="bg-[#1c1c1c] rounded-xl p-10 text-center text-gray-400">
          Nenhum dado financeiro para exibir.
        </div>
      ) : (
        <FinancialChart data={financialData} />
      )}

      {/* Ranking rápido */}
      {rows.length > 0 && <AffiliateRanking rows={rows} />}
    </div>
  );
}
