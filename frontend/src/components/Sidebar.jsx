import { NavLink } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

export default function Sidebar() {
  const { close } = useSidebar();

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg text-sm transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-400 hover:text-white hover:bg-[#1f1f1f]"
    }`;

  return (
    <aside className="w-64 bg-[#0f0f0f] border-r border-[#2a2a2a] p-6 h-full">
      <h2 className="text-lg font-bold mb-6">Dashboard</h2>

      <nav className="space-y-2">
        <NavLink to="/overview" className={linkClass} onClick={close}>
          Visão Geral
        </NavLink>

        <NavLink to="/affiliates" className={linkClass} onClick={close}>
          Afiliados
        </NavLink>
      </nav>
    </aside>
  );
}
