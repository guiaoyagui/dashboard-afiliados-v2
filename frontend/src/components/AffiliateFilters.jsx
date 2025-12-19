import { useState } from "react";

export default function AffiliateFilters({ rows, onFilter }) {
  const affiliates = [...new Set(rows.map(r => r.affiliate))].filter(Boolean);
  const brands = [...new Set(rows.map(r => r.brand))].filter(Boolean);

  const [filters, setFilters] = useState({
    affiliate: "",
    brand: "",
    dateFrom: "",
    dateTo: "",
  });

  function applyFilters(updated) {
    let filtered = [...rows];

    if (updated.affiliate) {
      filtered = filtered.filter(
        r => r.affiliate === updated.affiliate
      );
    }

    if (updated.brand) {
      filtered = filtered.filter(
        r => r.brand === updated.brand
      );
    }

    if (updated.dateFrom) {
      filtered = filtered.filter(
        r => new Date(r.date) >= new Date(updated.dateFrom)
      );
    }

    if (updated.dateTo) {
      filtered = filtered.filter(
        r => new Date(r.date) <= new Date(updated.dateTo)
      );
    }

    onFilter(filtered);
  }

  function handleChange(key, value) {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    applyFilters(updated);
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
      
      {/* Afiliado */}
      <select
        className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-2 text-sm"
        value={filters.affiliate}
        onChange={e => handleChange("affiliate", e.target.value)}
      >
        <option value="">Todos Afiliados</option>
        {affiliates.map(a => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      {/* Marca */}
      <select
        className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-2 text-sm"
        value={filters.brand}
        onChange={e => handleChange("brand", e.target.value)}
      >
        <option value="">Todas Marcas</option>
        {brands.map(b => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>

      {/* Data início */}
      <input
        type="date"
        className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-2 text-sm"
        value={filters.dateFrom}
        onChange={e => handleChange("dateFrom", e.target.value)}
      />

      {/* Data fim */}
      <input
        type="date"
        className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-2 text-sm"
        value={filters.dateTo}
        onChange={e => handleChange("dateTo", e.target.value)}
      />
    </div>
  );
}
