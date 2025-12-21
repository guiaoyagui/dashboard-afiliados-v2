import { useState, useEffect, useMemo } from "react";
import { Calendar, TrendingUp, Users, Activity, Filter, Crown, Sparkles } from "lucide-react";
import KpiGrid from "../components/KpiGrid";
import FinancialChart from "../components/FinancialChart";
import { calculateKpis } from "../utils/metrics";

export default function Overview({ rows }) {
  const [chartMetric, setChartMetric] = useState("profit");
  const [historyData, setHistoryData] = useState([]); 
  const [loadingChart, setLoadingChart] = useState(true);
  const [selectedGraphAffiliate, setSelectedGraphAffiliate] = useState("all");
  
  // Estado para alternar entre "Top Baleias" e "Top Novos"
  const [rankingMode, setRankingMode] = useState("whales"); // 'whales' ou 'new'

  // ... (Lógica do Gráfico e AffiliateOptions mantém igual) ...
  const affiliateOptions = useMemo(() => rows.map(r => ({ id: r.id, name: r["Affiliate username"] || r.name })).sort((a, b) => a.name.localeCompare(b.name)), [rows]);
  const formatDate = (dateString) => { /* ... igual ... */ return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); };

  useEffect(() => {
    // ... (UseEffect do gráfico mantém igual) ...
    async function fetchTrend() { /* ... igual ... */ setLoadingChart(false); }
    fetchTrend();
  }, [selectedGraphAffiliate]);

  const kpis = useMemo(() => calculateKpis(rows), [rows]);

  // --- LÓGICA DOS RANKINGS ---
  const rankingList = useMemo(() => {
    if (rankingMode === "whales") {
      // TOP BALEIAS: Ordena puramente por lucro (Net P&L)
      return [...rows]
        .sort((a, b) => (b.net_pnl || 0) - (a.net_pnl || 0))
        .slice(0, 5);
    } else {
      // TOP NOVOS: Criados nos últimos 60 dias E que tenham algum lucro
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      
      return [...rows]
        .filter(r => r.created && new Date(r.created) > sixtyDaysAgo && (r.net_pnl > 0))
        .sort((a, b) => (b.net_pnl || 0) - (a.net_pnl || 0))
        .slice(0, 5);
    }
  }, [rows, rankingMode]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a2a2a] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="text-blue-500" size={20}/> Performance Geral
          </h2>
          <p className="text-sm text-gray-400">Visão consolidada da operação</p>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-[#1c1c1c] border border-[#2a2a2a] px-3 py-2 rounded-lg text-sm text-gray-300">
          <Calendar size={14} /> <span>Mês Atual</span>
        </div>
      </div>

      <KpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICO (Esquerda) */}
        <div className="lg:col-span-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6 shadow-lg">
          {/* ... (Controles do gráfico mantêm iguais) ... */}
          <div className="flex flex-col gap-4 mb-6">
             <div className="flex items-center justify-between">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-500"/> Evolução Diária
                </h3>
                <div className="flex items-center gap-2 bg-[#121212] border border-[#333] rounded-lg px-2 py-1">
                  <Filter size={14} className="text-gray-500"/>
                  <select 
                    className="bg-[#121212] text-white text-xs focus:outline-none cursor-pointer w-[150px] py-1"
                    value={selectedGraphAffiliate}
                    onChange={(e) => setSelectedGraphAffiliate(e.target.value)}
                  >
                    <option value="all">Todos (Geral)</option>
                    <optgroup label="Afiliados">{affiliateOptions.map(aff => <option key={aff.id} value={aff.id}>{aff.name}</option>)}</optgroup>
                  </select>
                </div>
             </div>
             <div className="flex bg-[#121212] rounded-lg p-1 self-start">
               {[{ id: 'profit', label: 'Lucro' }, { id: 'ftds', label: 'FTDs' }, { id: 'regs', label: 'Registros' }].map(tab => (
                 <button key={tab.id} onClick={() => setChartMetric(tab.id)} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartMetric === tab.id ? 'bg-[#2a2a2a] text-white shadow border border-[#333]' : 'text-gray-500 hover:text-gray-300'}`}>{tab.label}</button>
               ))}
             </div>
          </div>

          {loadingChart ? <div className="h-[300px] flex items-center justify-center text-gray-500">Carregando...</div> : historyData.length > 0 ? <FinancialChart data={historyData} activeMetric={chartMetric} /> : <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-[#333] rounded-lg">Sem dados.</div>}
        </div>

        {/* WIDGET DE RANKING (Direita) */}
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6 shadow-lg flex flex-col h-[400px]">
          
          {/* Abas do Ranking */}
          <div className="flex items-center gap-2 mb-4 border-b border-[#2a2a2a] pb-2">
            <button 
              onClick={() => setRankingMode("whales")}
              className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-all ${rankingMode === 'whales' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Crown size={14} /> Baleias (Top Lucro)
            </button>
            <button 
              onClick={() => setRankingMode("new")}
              className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-all ${rankingMode === 'new' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Sparkles size={14} /> Novos Talentos
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
            {rankingList.length > 0 ? rankingList.map((aff, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#252525]/40 rounded-lg border border-[#2a2a2a] hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {i + 1}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-white font-medium truncate w-[80px]" title={aff.name}>{aff.name}</p>
                    <p className="text-[10px] text-gray-500">{aff.ftds} FTDs</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-400">
                    USD {Number(aff.net_pnl || 0).toLocaleString('pt-BR', { notation: "compact" })}
                  </p>
                  {rankingMode === "new" && (
                    <p className="text-[9px] text-purple-400">Novo! ({(new Date(aff.created)).toLocaleDateString()})</p>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-center text-gray-500 text-xs mt-10">
                {rankingMode === "new" ? "Nenhum afiliado novo com lucro nos últimos 60 dias." : "Sem dados."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}