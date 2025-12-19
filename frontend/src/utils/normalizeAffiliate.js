export function normalizeAffiliate(raw) {
  return {
    id: String(raw.affiliate_id ?? raw.id),
    name: raw.affiliate_name ?? raw.name ?? "Sem nome",
    clicks: Number(raw.clicks) || 0,
    registrations: Number(raw.registrations) || 0,
    ftds: Number(raw.ftds) || 0,
    deposits: Number(raw.total_deposits ?? raw.deposits) || 0,
    net_pnl: Number(raw.net_pnl ?? raw.netRevenue) || 0,
    commission: Number(raw.commission) || 0,
  };
}
