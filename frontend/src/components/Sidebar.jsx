import { LayoutDashboard, Users, LogOut } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

export default function Sidebar({ activeTab, onTabChange }) {
  const { close } = useSidebar();

  const menuItems = [
    { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
    { id: "affiliates", label: "Afiliados", icon: Users },
  ];

  function handleNavigation(tabId) {
    if (onTabChange) {
      onTabChange(tabId);
    }
    // Fecha a sidebar no mobile ao clicar
    close();
  }

  return (
    // 'min-h-screen' garante que a sidebar vá até o fim da página
    <aside className="w-64 min-h-screen flex flex-col bg-[#1a1a1a] border-r border-[#2a2a2a]">
      {/* Logo / Título */}
      <div className="h-20 flex items-center px-8 border-b border-[#2a2a2a]">
        {/* Texto alterado para Vermelho e nome Seguro Affiliate */}
        <span className="text-xl font-bold text-red-600">
          Seguro Affiliate
        </span>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-red-600/10 text-red-500 border border-red-600/20"
                    : "text-gray-400 hover:bg-[#252525] hover:text-white"
                }
              `}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Rodapé da Sidebar */}
      <div className="p-4 border-t border-[#2a2a2a]">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-white hover:bg-[#252525] transition-colors">
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </aside>
  );
}