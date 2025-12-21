import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

// O SEGREDO ESTÁ AQUI: Um Tooltip que lê os dados diretamente
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // payload[0].payload contém o objeto de dados completo daquele dia
    const data = payload[0].payload;

    return (
      <div className="bg-[#151515] border border-[#333] p-3 rounded-lg shadow-2xl min-w-[140px] z-50">
        <p className="text-gray-400 text-xs mb-2 font-medium border-b border-[#333] pb-1">
          {label}
        </p>
        
        <div className="flex flex-col gap-1.5">
          {/* LUCRO */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-gray-300 text-xs">Lucro</span>
            </div>
            <span className="font-bold text-emerald-400">
              USD {Number(data.Lucro).toFixed(2)}
            </span>
          </div>

          {/* FTDs */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-gray-300 text-xs">FTDs</span>
            </div>
            <span className="font-bold text-white">
              {data.Depositos}
            </span>
          </div>

          {/* REGISTROS */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="text-gray-300 text-xs">Regs</span>
            </div>
            <span className="font-bold text-white">
              {data.Registros}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function FinancialChart({ data, activeMetric = "profit" }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        Aguardando dados...
      </div>
    );
  }

  // Configuração de cores baseada na aba selecionada
  const config = {
    profit: { key: "Lucro", color: "#10b981" },     // Verde
    ftds:   { key: "Depositos", color: "#3b82f6" }, // Azul
    regs:   { key: "Registros", color: "#8b5cf6" }  // Roxo
  };

  const current = config[activeMetric] || config.profit;

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={current.color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={current.color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          
          <XAxis 
            dataKey="name" 
            stroke="#666" 
            tick={{fill: '#888', fontSize: 10}} 
            tickLine={false} 
            axisLine={false} 
            minTickGap={30}
          />
          
          <YAxis 
            stroke="#666" 
            tick={{fill: '#888', fontSize: 10}} 
            tickLine={false} 
            axisLine={false} 
          />
          
          <Tooltip content={<CustomTooltip />} />

          <Area 
            type="monotone" 
            dataKey={current.key} 
            stroke={current.color} 
            fillOpacity={1} 
            fill="url(#colorMetric)" 
            strokeWidth={2}
            animationDuration={1000}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}