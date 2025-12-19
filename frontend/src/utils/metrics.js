import _ from "lodash";

export function calculateKpis(rows = []) {
  return {
    deposits: _.sumBy(rows, r => r['Deposits amount'] || 0),
    commissions: _.sumBy(rows, r => r['Commissions'] || 0),
    netPnl: _.sumBy(rows, r => r['Net P&L'] || 0),
    ftds: _.sumBy(rows, r => r['FTDs'] || 0),
  };
}

export function calculateConversion(visits = 0, ftds = 0) {
  return visits > 0 ? ((ftds / visits) * 100).toFixed(1) : 0;
}
