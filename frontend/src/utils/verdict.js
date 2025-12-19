export function getVerdict(row) {
  const pnl = row['Net P&L'] || 0;
  const visits = row['Visits (unique)'] || 0;
  const ftds = row['FTDs'] || 0;
  const deposits = row['Deposits amount'] || 0;

  if (pnl < 0) {
    return { 
      label: 'PREJUÍZO', 
      color: 'bg-red-500/20 text-red-400 border border-red-500/30', 
      msg: 'Comissão maior que receita.'
    };
  }
  if (visits > 50 && ftds === 0) {
    return { 
      label: 'BAIXA CONVERSÃO', 
      color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30', 
      msg: 'Muito clique, nenhum depósito.'
    };
  }
  if (pnl > 100) {
    return { 
      label: 'EXCELENTE', 
      color: 'bg-green-500/20 text-green-400 border border-green-500/30', 
      msg: 'Afiliado lucrativo.'
    };
  }
  if (deposits > 0 && pnl >= 0) {
    return { 
      label: 'POTENCIAL', 
      color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', 
      msg: 'Trazendo resultados.'
    };
  }
  return { label: 'INICIANTE', color: 'bg-gray-700 text-gray-300 border border-gray-600', msg: 'Poucos dados.' };
}
