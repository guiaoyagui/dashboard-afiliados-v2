import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Copy, Check } from "lucide-react";
import VerdictBadge from "./VerdictBadge";
import { getAffiliateVerdict } from "../utils/verdict";

export default function AffiliateTable({ data, onSelect }) {
  const [sortConfig, setSortConfig] = useState({ key: "net", direction: "desc" });
  const [copiedId, setCopiedId] = useState(null);

  // 1. Processamento e Veredito
  const processedData = useMemo(() => {
    if (!data) return [];
    
    return data.map((item) => {
      // Garante que são números
      const regs = Number(item.registrations || 0);
      const ftds = Number(item.ftds || 0);
      const com = Number(item.commission || 0);
      const net = Number(item.net_pnl || 0);
      
      const verdict = getAffiliateVerdict({ ...item, registrations: regs, ftds, net_pnl: net });

      return {
        ...item,
        registrations: regs,
        ftds,
        commission: com,
        net,
        verdict
      };
    });
  }, [data]);

  // 2. Ordenação
  const sortedData = useMemo(() => {
    let sortableItems = [...processedData];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'verdict') {
            if (a.verdict.label < b.verdict.label) return sortConfig.direction === "asc" ? -1 : 1;
            if (a.verdict.label > b.verdict.label) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        }
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [processedData, sortConfig]);

  const requestSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") direction = "asc";
    setSortConfig({ key, direction });
  };

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return <ArrowUpDown size={14} className="opacity-30 ml-1" />;
    return sortConfig.direction === "asc" ? <ArrowUp size={14} className="text-blue-500 ml-1" /> : <ArrowDown size={14} className="text-blue-500 ml-1" />;
  };

  const handleCopy = (e, text) => {
    e.stopPropagation(); // Impede que o clique no botão abra o perfil
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-gray-500">Nenhum dado para exibir.</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#151515] text-xs uppercase font-semibold text-gray-400 border-b border-[#2a2a2a]">
          <tr>
            <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => requestSort("name")}>
              <div className="flex items-center">Afiliado {getSortIcon("name")}</div>
            </th>
            <th className="px-6 py-4 text-center cursor-pointer hover:text-white" onClick={() => requestSort("verdict")}>
               <div className="flex items-center justify-center">Status {getSortIcon("verdict")}</div>
            </th>
            <th className="px-6 py-4 text-center cursor-pointer hover:text-white" onClick={() => requestSort("registrations")}>
               <div className="flex items-center justify-center">Regs {getSortIcon("registrations")}</div>
            </th>
            <th className="px-6 py-4 text-center cursor-pointer hover:text-white" onClick={() => requestSort("ftds")}>
               <div className="flex items-center justify-center">FTDs {getSortIcon("ftds")}</div>
            </th>
            <th className="px-6 py-4 text-right cursor-pointer hover:text-white" onClick={() => requestSort("net")}>
               <div className="flex items-center justify-end">Lucro (USD) {getSortIcon("net")}</div>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#2a2a2a]">
          {sortedData.map((aff, index) => (
            <tr 
              key={index} 
              // AQUI ESTÁ A CORREÇÃO: O evento onClick chama a função onSelect
              onClick={() => onSelect && onSelect(aff)}
              className="hover:bg-[#252525] transition-colors group cursor-pointer"
            >
              <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                <span className="truncate max-w-[150px]" title={aff["Affiliate username"] || aff.name}>
                  {aff["Affiliate username"] || aff.name || "Desconhecido"}
                </span>
                <button 
                  onClick={(e) => handleCopy(e, aff["Affiliate username"] || aff.name)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-blue-400"
                  title="Copiar ID"
                >
                  {copiedId === (aff["Affiliate username"] || aff.name) ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
                </button>
              </td>

              <td className="px-6 py-4 text-center">
                <VerdictBadge verdict={aff.verdict} />
              </td>
              
              <td className="px-6 py-4 text-center text-gray-300">
                {aff.registrations}
              </td>

              <td className="px-6 py-4 text-center font-bold text-white">
                {aff.ftds}
              </td>
              
              <td className={`px-6 py-4 text-right font-bold ${aff.net >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                USD {aff.net.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}