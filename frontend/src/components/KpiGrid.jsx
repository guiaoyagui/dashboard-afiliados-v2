import KpiCard from "./KpiCard";

export default function KpiGrid({ kpis }) {
  if (!kpis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <KpiCard
        title="Net P&L"
        value={`R$ ${kpis.netPnl.toFixed(2)}`}
        color={kpis.netPnl >= 0 ? "text-green-400" : "text-red-400"}
      />

      <KpiCard
        title="Comissões"
        value={`R$ ${kpis.commissions.toFixed(2)}`}
      />

      <KpiCard
        title="FTDs"
        value={kpis.ftds}
        color="text-blue-400"
      />

      <KpiCard
        title="ROI"
        value={
          kpis.commissions > 0
            ? `${((kpis.netPnl / kpis.commissions) * 100).toFixed(0)}%`
            : "0%"
        }
      />
    </div>
  );
}
