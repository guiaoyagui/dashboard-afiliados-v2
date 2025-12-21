import { useState, useEffect, useMemo } from "react";
import { Filter, X, User, Globe, Briefcase, Tag } from "lucide-react";

export default function AffiliateFilters({ rows = [], onFilter }) {
  // Estado dos filtros
  const [filters, setFilters] = useState({
    manager: "",
    country: "",
    deal: "",
    status: ""
  });

  // Extrai opções únicas dinamicamente dos dados
  const options = useMemo(() => {
    const getOptions = (key) => [...new Set(rows.map(r => r[key]).filter(Boolean))].sort();
    return {
      managers: getOptions("manager"),
      countries: getOptions("country"),
      deals: getOptions("deal"),
      statuses: getOptions("status")
    };
  }, [rows]);

  // Aplica os filtros sempre que mudar
  useEffect(() => {
    const filtered = rows.filter(row => {
      return (
        (!filters.manager || row.manager === filters.manager) &&
        (!filters.country || row.country === filters.country) &&
        (!filters.deal || row.deal === filters.deal) &&
        (!filters.status || row.status === filters.status)
      );
    });
    onFilter(filtered);
  }, [filters, rows, onFilter]);

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ manager: "", country: "", deal: "", status: "" });
  };

  // Componente visual de Select
  const FilterSelect = ({ label, icon: Icon, value, onChange, options }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
        <Icon size={12} /> {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#121212] border border-[#333] text-gray-200 text-xs rounded-lg px-3 py-2 focus:border-blue-500 focus:outline-none transition-colors"
      >
        <option value="">Todos</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5 w-full h-full flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Filter size={18} className="text-blue-500" />
          Filtros
        </h3>
        {(filters.manager || filters.country || filters.deal || filters.status) && (
          <button 
            onClick={clearFilters}
            className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded"
          >
            <X size={10} /> Limpar
          </button>
        )}
      </div>

      <div className="space-y-5">
        <FilterSelect 
          label="Gerente" 
          icon={User} 
          value={filters.manager} 
          options={options.managers} 
          onChange={(v) => handleChange("manager", v)} 
        />
        
        <FilterSelect 
          label="Status" 
          icon={Tag} 
          value={filters.status} 
          options={options.statuses} 
          onChange={(v) => handleChange("status", v)} 
        />

        <FilterSelect 
          label="País" 
          icon={Globe} 
          value={filters.country} 
          options={options.countries} 
          onChange={(v) => handleChange("country", v)} 
        />

        <FilterSelect 
          label="Tipo de Acordo" 
          icon={Briefcase} 
          value={filters.deal} 
          options={options.deals} 
          onChange={(v) => handleChange("deal", v)} 
        />
      </div>

      <div className="mt-auto pt-6 border-t border-[#2a2a2a]">
        <div className="text-xs text-center text-gray-500">
          Mostrando <strong className="text-white">{rows.length}</strong> afiliados
        </div>
      </div>
    </div>
  );
}