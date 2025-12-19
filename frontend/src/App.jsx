import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Overview from "./pages/Overview";
import Affiliates from "./pages/Affiliates";
import Layout from "./layout/Layout";
import { fetchAffiliateReport } from "./services/api";
import { mockRows } from "./utils/mockData";

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function load() {
    try {
      const data = await fetchAffiliateReport();
      setRows(data.rows);
    } catch {
      console.warn("Backend offline, usando mock");
      setRows(mockRows);
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-gray-400">
        Carregando dados...
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/overview" />} />
        <Route path="/overview" element={<Overview rows={rows} />} />
        <Route path="/affiliates" element={<Affiliates rows={rows} />} />
      </Route>
    </Routes>
  );
}
