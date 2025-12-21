import { Users, UserPlus, DollarSign, Wallet } from "lucide-react";

export function calculateKpis(rows) {
  if (!rows || rows.length === 0) return [];

  const totals = rows.reduce((acc, row) => {
    acc.registrations += Number(row["Registrations"] || row.registrations || 0);
    acc.ftds += Number(row["FTDs"] || row.ftds || 0);
    acc.commissions += Number(row["Commissions"] || row.commission || 0);
    acc.netPnl += Number(row["Net P&L"] || row.net_pnl || 0);
    return acc;
  }, { registrations: 0, ftds: 0, commissions: 0, netPnl: 0 });

  return [
    { 
      label: "Total de Registros", 
      value: totals.registrations, 
      type: "number",
      icon: Users,
      color: "blue"
    },
    { 
      label: "Novos Depósitos (FTDs)", 
      value: totals.ftds, 
      type: "number",
      icon: UserPlus,
      color: "purple"
    },
    { 
      label: "Comissões a Pagar", 
      value: totals.commissions, 
      type: "currency",
      icon: DollarSign,
      color: "yellow"
    },
    { 
      label: "Lucro Líquido (Net P&L)", 
      value: totals.netPnl, 
      type: "currency",
      icon: Wallet,
      color: "green"
    }
  ];
}