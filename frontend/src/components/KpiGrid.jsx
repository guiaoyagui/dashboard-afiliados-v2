import KpiCard from "./KpiCard";
import { formatCurrency, formatNumber } from "../utils/format";

export default function KpiGrid({ kpis }) {
  if (!kpis || kpis.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const safeValue = kpi.value ?? 0;
        
        const displayValue = kpi.type === "currency" 
          ? formatCurrency(safeValue) 
          : formatNumber(safeValue);

        return (
          <KpiCard 
            key={index}
            label={kpi.label} 
            value={displayValue}
            icon={kpi.icon}
            color={kpi.color}
          />
        );
      })}
    </div>
  );
}