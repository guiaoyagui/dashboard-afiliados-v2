import { useState } from "react";
import { Calendar, Filter } from "lucide-react";

export default function DateRangeFilter({ onFilter, initialDateFrom, initialDateTo }) {
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);

  const applyPreset = (days) => {
    const end = new Date();
    const start = new Date();
    
    if (days === 'thisMonth') {
      start.setDate(1); // Dia 1 do mês atual
    } else if (days === 'lastMonth') {
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      end.setDate(0); // Último dia do mês anterior
    } else {
      start.setDate(end.getDate() - days);
    }

    const fmt = (d) => d.toISOString().split('T')[0];
    
    setDateFrom(fmt(start));
    setDateTo(fmt(end));
    onFilter(fmt(start), fmt(end));
  };

  const handleApply = () => {
    onFilter(dateFrom, dateTo);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#1c1c1c] border border-[#2a2a2a] p-2 rounded-xl">
      
      {/* Atalhos Rápidos */}
      <div className="flex gap-1">
        <button onClick={() => applyPreset(0)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">Hoje</button>
        <button onClick={() => applyPreset(7)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">7D</button>
        <button onClick={() => applyPreset(30)} className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors">30D</button>
        <button onClick={() => applyPreset('thisMonth')} className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg transition-colors">Mês</button>
      </div>

      <div className="w-px h-6 bg-[#333] hidden sm:block"></div>

      {/* Inputs de Data */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input 
            type="date" 
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-[#121212] border border-[#333] text-white text-xs rounded-lg pl-8 pr-2 py-1.5 focus:outline-none focus:border-blue-500"
          />
        </div>
        <span className="text-gray-500 text-xs">até</span>
        <div className="relative">
          <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input 
            type="date" 
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-[#121212] border border-[#333] text-white text-xs rounded-lg pl-8 pr-2 py-1.5 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Botão Filtrar */}
      <button 
        onClick={handleApply}
        className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition-colors"
        title="Aplicar Filtro"
      >
        <Filter size={16} />
      </button>
    </div>
  );
}