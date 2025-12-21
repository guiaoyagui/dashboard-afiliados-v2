export function getAffiliateVerdict(aff) {
  const regs = Number(aff.registrations || 0);
  const ftds = Number(aff.ftds || 0);
  const net = Number(aff.net_pnl || aff.net || 0);
  
  // Cálculo da conversão (Reg -> FTD)
  const conversion = regs > 0 ? (ftds / regs) * 100 : 0;

  // 1. TOP PERFORMER (O Sonho de todo gerente)
  // Tem volume (5+ FTDs), Lucro positivo e conversão saudável (>10%)
  if (ftds >= 5 && net > 0 && conversion >= 10) {
    return { label: "💎 Top Player", color: "blue", tip: "Alta qualidade e volume" };
  }

  // 2. POTENCIAL (Está começando bem)
  // Pouco volume, mas boa conversão
  if (ftds > 0 && ftds < 5 && conversion >= 15) {
    return { label: "🚀 Potencial", color: "green", tip: "Iniciante com boa qualidade" };
  }

  // 3. ALERTA DE PREJUÍZO (O vilão do Net P&L)
  // Está negativo
  if (net < 0) {
    return { label: "🔻 Prejuízo", color: "red", tip: "Net P&L Negativo. Renegociar deal." };
  }

  // 4. TRÁFEGO SUSPEITO/RUIM (Muita gente, ninguém deposita)
  // Mais de 10 registros e conversão abaixo de 5%
  if (regs > 10 && conversion < 5) {
    return { label: "⚠️ Tráfego Ruim", color: "yellow", tip: "Baixa conversão. Verificar fraude." };
  }

  // 5. SEM DEPÓSITOS (Só curioso)
  if (regs > 0 && ftds === 0) {
    return { label: "👻 Sem FTDs", color: "gray", tip: "Traz registros mas ninguém deposita" };
  }

  // 6. INATIVO
  return { label: "💤 Sem Tráfego", color: "zinc", tip: "Nenhum clique ou registro" };
}