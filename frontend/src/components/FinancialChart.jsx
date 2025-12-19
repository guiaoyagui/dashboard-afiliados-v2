import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function FinancialChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 text-gray-400">
        Nenhum dado financeiro para exibir.
      </div>
    );
  }

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-xl shadow-lg border border-gray-800">
      <h3 className="font-bold text-lg mb-4">Performance Financeira</h3>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="depGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
            />
            <Legend />

            <Area
              type="monotone"
              dataKey="deposits"
              name="Depósitos"
              stroke="#3b82f6"
              fill="url(#depGradient)"
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="net_pnl"
              name="Net P&L"
              stroke="#10b981"
              fill="url(#pnlGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
