import { useEffect, useState } from "react";
import { 
  ArrowLeft, Calendar, TrendingUp, User, Mail, Phone, 
  MessageCircle, Wallet, History, Tag, Users, Filter, DollarSign
} from "lucide-react";
import KpiGrid from "../components/KpiGrid";
import FinancialChart from "../components/FinancialChart";
import VerdictBadge from "../components/VerdictBadge";
import { calculateKpis } from "../utils/metrics";
import { getAffiliateVerdict } from "../utils/verdict";

export default function AffiliateDetails({ affiliate, onBack, dateFrom, dateTo }) {
  const [history, setHistory] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); 
  const [chartMetric, setChartMetric] = useState("profit");
  const [tableFilter, setTableFilter] = useState("all"); 
  
  // --- NOVO: COTAÇÃO DO DÓLAR (Editável) ---
  // Começa com 5.50, mas você pode mudar na tela para bater o valor exato
  const [exchangeRate, setExchangeRate] = useState(5.50); 

  const verdict = getAffiliateVerdict(affiliate);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString('pt-BR');
  };

  // --- FUNÇÃO DE CONVERSÃO PODEROSA ---
  const formatMoney = (valueInUSD) => {
    if (!valueInUSD) return "R$ 0,00";
    // Multiplica pelo valor que você digitou no input
    const valueInBRL = valueInUSD * exchangeRate;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valueInBRL);
  };

  // 1. CARREGA GRÁFICO
  useEffect(() => {
    async function fetchHistory() {
      if (!affiliate.id) return;
      try {
        setLoading(true);
        const url = `http://localhost:3333/api/affiliates/${affiliate.id}/history?date_from=${dateFrom}&date_to=${dateTo}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.history) {
          const formatted = data.history.map(h => ({
            ...h,
            name: new Date(h.name).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            // Convertemos aqui também para o gráfico ficar em Reais
            Lucro: (Number(h.net_pnl) || 0) * exchangeRate, 
            Depositos: Number(h.ftds) || 0,
            Registros: Number(h.registrations) || 0
          }));
          setHistory(formatted);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchHistory();
  }, [affiliate, dateFrom, dateTo, exchangeRate]); // Recarrega se mudar a cotação

  // 2. CARREGA JOGADORES
  useEffect(() => {
    if (activeTab === 'overview') return;
    async function fetchPlayers() {
      if (!affiliate.id) return;
      try {
        setLoadingPlayers(true);
        const url = `http://localhost:3333/api/affiliates/${affiliate.id}/players?date_from=${dateFrom}&date_to=${dateTo}`;
        const res = await fetch(url);
        const data = await res.json();
        
        const validPlayers = (data.players || []).filter(p => p.registeredAt || p.depositedAt || p.ftdAmount > 0);
        setPlayers(validPlayers);
      } catch (err) { console.error(err); } finally { setLoadingPlayers(false); }
    }
    fetchPlayers();
  }, [affiliate, activeTab, dateFrom, dateTo]);

  const cleanPhone = (phone) => phone ? phone.replace(/\D/g, '') : '';
  const countNewRegs = players.filter(p => p.registeredAt).length;
  const countFtds = players.filter(p => p.ftdAmount > 0 || p.depositedAt).length;

  const filteredList = players.filter(p => {
    if (tableFilter === "regs") return p.registeredAt; 
    if (tableFilter === "ftds") return p.ftdAmount > 0 || p.depositedAt; 
    return true; 
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. CABEÇALHO COM CONTROLE DE CÂMBIO */}
      <div className="flex flex-col xl:flex-row gap-6 border-b border-[#2a2a2a] pb-6 justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-[#252525] rounded-full text-gray-400 hover:text-white transition-colors"><ArrowLeft size={24} /></button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  {affiliate["Affiliate username"] || affiliate.name}
                </h1>
                <VerdictBadge verdict={verdict} />
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1"><User size={14} /> {affiliate.fullName || "Nome não cadastrado"}</span>
                {affiliate.label && <span className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-xs"><Tag size={10} /> {affiliate.label}</span>}
                <span className="flex items-center gap-1 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded bg-blue-500/5 text-xs"><Calendar size={12} /> {new Date(dateFrom).toLocaleDateString()} - {new Date(dateTo).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {/* INPUT DE CÂMBIO (A MÁGICA ACONTECE AQUI) */}
          <div className="flex items-center gap-3 bg-[#151515] p-2 rounded-lg border border-[#333] w-fit">
            <div className="flex items-center gap-1 text-green-500 text-sm font-bold">
              <DollarSign size={14}/> <span>Cotação USD:</span>
            </div>
            <input 
              type="number" 
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              step="0.01"
              className="bg-[#222] text-white text-sm w-16 px-2 py-1 rounded border border-[#444] focus:border-green-500 outline-none"
            />
            <span className="text-xs text-gray-500">Ajuste para bater o valor</span>
          </div>
        </div>
        
        {/* WIDGETS FINANCEIROS (AGORA CONVERTIDOS) */}
        <div className="flex gap-4 shrink-0 mt-4 xl:mt-0">
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-4 rounded-xl min-w-[160px] flex flex-col justify-center shadow-lg">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold mb-1"><Wallet size={12} className="text-yellow-500"/> Saldo a Pagar</div>
            <div className="text-xl font-bold text-white">{formatMoney(affiliate.balance)}</div>
          </div>
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-4 rounded-xl min-w-[160px] flex flex-col justify-center shadow-lg">
            <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-bold mb-1"><History size={12} className="text-blue-500"/> Total Pago</div>
            <div className="text-xl font-bold text-white">{formatMoney(affiliate.payments)}</div>
          </div>
        </div>
      </div>

      <div className="border-b border-[#2a2a2a] flex gap-6">
        <button onClick={() => setActiveTab('overview')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'overview' ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Visão Geral</button>
        <button onClick={() => setActiveTab('players')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'players' ? 'border-blue-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Relatório de Jogadores</button>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6 animate-fade-in">
          {/* KPI GRID NÃO FOI ALTERADO POIS USA DADOS AGREGADOS, MAS O GRÁFICO SIM */}
          <KpiGrid kpis={calculateKpis([affiliate])} />
          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-medium flex items-center gap-2"><TrendingUp size={18} className="text-blue-500"/> Evolução Diária</h3>
              <div className="flex bg-[#121212] rounded-lg p-1">
                  {[{ id: 'profit', label: 'Lucro' }, { id: 'ftds', label: 'FTDs' }, { id: 'regs', label: 'Registros' }].map(tab => (
                    <button key={tab.id} onClick={() => setChartMetric(tab.id)} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${chartMetric === tab.id ? 'bg-[#2a2a2a] text-white' : 'text-gray-500'}`}>{tab.label}</button>
                  ))}
              </div>
            </div>
            {loading ? <div className="h-[300px] flex items-center justify-center text-gray-500">Carregando...</div> : history.length > 0 ? <FinancialChart data={history} activeMetric={chartMetric} /> : <div className="h-[300px] flex items-center justify-center text-gray-500 border border-dashed border-[#333] rounded-lg">Sem dados.</div>}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setTableFilter("all")} className={`flex-1 p-3 rounded-xl border ${tableFilter === 'all' ? 'bg-[#252525] border-blue-500/50' : 'bg-[#1c1c1c] border-[#2a2a2a]'}`}><div className="text-xs text-gray-400">Total</div><div className="text-xl font-bold text-white">{players.length}</div></button>
            <button onClick={() => setTableFilter("regs")} className={`flex-1 p-3 rounded-xl border ${tableFilter === 'regs' ? 'bg-purple-500/10 border-purple-500/50' : 'bg-[#1c1c1c] border-[#2a2a2a]'}`}><div className="text-xs text-purple-300">Novos</div><div className="text-xl font-bold text-purple-400">{countNewRegs}</div></button>
            <button onClick={() => setTableFilter("ftds")} className={`flex-1 p-3 rounded-xl border ${tableFilter === 'ftds' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[#1c1c1c] border-[#2a2a2a]'}`}><div className="text-xs text-emerald-300">Pagantes</div><div className="text-xl font-bold text-emerald-400">{countFtds}</div></button>
          </div>

          <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-lg">
            {loadingPlayers ? <div className="p-20 text-center text-gray-500">Buscando jogadores...</div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#151515] text-xs uppercase font-semibold text-gray-400 border-b border-[#2a2a2a]">
                    <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">País</th><th className="px-6 py-4 text-center">Data Registro</th><th className="px-6 py-4 text-center">Data 1º Depósito</th><th className="px-6 py-4 text-right">Valor FTD (Estimado)</th></tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a]">
                    {filteredList.map((p, i) => (
                      <tr key={i} className="hover:bg-[#252525]">
                        <td className="px-6 py-4 text-white font-mono text-xs">{p.playerId}</td>
                        <td className="px-6 py-4 text-gray-400">{p.country}</td>
                        <td className="px-6 py-4 text-center text-gray-300">{p.registeredAt ? formatDate(p.registeredAt) : "-"}</td>
                        <td className="px-6 py-4 text-center text-white">{p.depositedAt ? <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-xs">{formatDate(p.depositedAt)}</span> : "-"}</td>
                        <td className="px-6 py-4 text-right">
                          {p.ftdAmount > 0 ? <span className="text-emerald-400 font-bold">{formatMoney(p.ftdAmount)}</span> : <span className="text-gray-600">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}