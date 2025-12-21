import { useState, useEffect } from "react";
import Layout from "./layout/Layout";
import Overview from "./pages/Overview";
import Affiliates from "./pages/Affiliates";
import AffiliateDetails from "./pages/AffiliateDetails";
import FileUploader from "./components/FileUploader";
import DateRangeFilter from "./components/DateRangeFilter"; // <--- Importe o novo componente

export default function App() {
  const [rows, setRows] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("idle");

  // Estado Global de Datas (Padrão: Este Mês)
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      from: firstDay.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    };
  });

  // Função central para carregar dados
  const loadFromApi = async (from, to) => {
    setLoading(true);
    try {
      // Atualiza o estado da data se vierem novos valores
      if (from && to) setDateRange({ from, to });
      
      const qFrom = from || dateRange.from;
      const qTo = to || dateRange.to;

      console.log(`Buscando dados de ${qFrom} até ${qTo}...`);

      const response = await fetch(`http://localhost:3333/api/affiliates?date_from=${qFrom}&date_to=${qTo}`);
      
      if (!response.ok) throw new Error("Falha na conexão");

      const data = await response.json();

      if (data.affiliates) {
        const normalized = data.affiliates.map(item => ({
          ...item,
          "Affiliate username": item.name,
          "Registrations": item.registrations,
          "FTDs": item.ftds,
          "Commissions": item.commission,
          "Net P&L": item.net_pnl,
          net_pnl: item.net_pnl,
          balance: Number(item.balance || 0),
          payments: Number(item.payments || 0)
        }));

        setRows(normalized);
        setApiStatus("success");
      }
    } catch (error) {
      console.error("API Offline ou Erro:", error);
      setApiStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // Carrega ao abrir a página
  useEffect(() => {
    loadFromApi();
  }, []);

  const renderContent = () => {
    if (selectedAffiliate) {
      return (
        <AffiliateDetails 
          affiliate={selectedAffiliate} 
          // Passamos as datas globais para o detalhe usar no gráfico
          dateFrom={dateRange.from} 
          dateTo={dateRange.to}
          onBack={() => setSelectedAffiliate(null)} 
        />
      );
    }

    if (activeTab === "overview") return <Overview rows={rows} />;
    
    if (activeTab === "affiliates") {
      return (
        <Affiliates 
          rows={rows} 
          onSelectAffiliate={(aff) => setSelectedAffiliate(aff)} 
        />
      );
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={(tab) => {
      setActiveTab(tab);
      setSelectedAffiliate(null);
    }}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard de Afiliados</h1>
            <div className="flex items-center gap-2 mt-1">
              {loading ? (
                <span className="text-yellow-500 text-sm animate-pulse">● Atualizando dados...</span>
              ) : apiStatus === "success" ? (
                <span className="text-green-500 text-sm">● Dados de {new Date(dateRange.from).toLocaleDateString()} a {new Date(dateRange.to).toLocaleDateString()}</span>
              ) : (
                <span className="text-gray-400 text-sm">● Modo Offline</span>
              )}
            </div>
          </div>
          
          {/* Seletor de Data e Upload */}
          <div className="flex flex-col sm:flex-row gap-3">
            <DateRangeFilter 
              initialDateFrom={dateRange.from}
              initialDateTo={dateRange.to}
              onFilter={(from, to) => loadFromApi(from, to)} // Recarrega ao mudar data
            />
            <FileUploader onLoad={(data) => {
              setRows(data);
              setApiStatus("manual");
              setActiveTab("overview");
            }} />
          </div>
        </div>

        <main>
          {rows.length > 0 ? (
            renderContent()
          ) : (
            <div className="flex flex-col items-center justify-center p-20 bg-[#1c1c1c] rounded-xl border border-[#2a2a2a] text-center mt-6">
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-white">Carregando dados ({dateRange.from} a {dateRange.to})...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-white mb-2">Sem dados disponíveis</h2>
                  <p className="text-gray-400 max-w-sm mb-4">
                    Tente mudar o período de datas ou verifique o backend.
                  </p>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}