import Papa from "papaparse";

export default function FileUploader({ onLoad }) {
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Converte números e datas automaticamente
      complete: (result) => {
        // Mapeia os nomes das colunas do CSV para o formato que o dashboard espera
        const formatted = result.data.map((row, index) => ({
          id: index + 1,
          name: row["Affiliate username"] || "Sem nome",
          registrations: Number(row["Registrations"]) || 0,
          ftds: Number(row["FTDs"]) || 0,
          commission: Number(row["Commissions"]) || 0,
          net_pnl: Number(row["Net P&L"]) || 0,
          // Mantém o objeto original caso precise de outros campos
          ...row 
        }));

        console.log("Análise carregada:", formatted);
        onLoad(formatted);
      },
      error: (error) => {
        alert("Erro ao ler o arquivo CSV: " + error.message);
      }
    });
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 shadow-lg">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#333] hover:border-blue-500 rounded-lg p-8 transition-colors cursor-pointer relative">
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <p className="text-blue-500 font-medium mb-1">Clique para enviar ou arraste o arquivo</p>
          <p className="text-xs text-gray-500 uppercase">Apenas arquivos .CSV (Relatórios Smartico)</p>
        </div>
      </div>
    </div>
  );
}