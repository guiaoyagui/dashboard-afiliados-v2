export function normalizeAffiliate(raw) {
  // Mapeia os campos do CSV original para o padrão do sistema
  return {
    id: String(raw["Affiliate username"] || raw.affiliate_id || raw.id || "0"),
    name: raw["Affiliate username"] || raw.affiliate_name || raw.name || "Sem nome",
    clicks: Number(raw.clicks) || 0,
    registrations: Number(raw["Registrations"] || raw.registrations) || 0,
    ftds: Number(raw["FTDs"] || raw.ftds) || 0,
    deposits: Number(raw.total_deposits || raw.deposits) || 0,
    net_pnl: Number(raw["Net P&L"] || raw.net_pnl || raw.netRevenue) || 0,
    commission: Number(raw["Commissions"] || raw.commission) || 0,
  };
}