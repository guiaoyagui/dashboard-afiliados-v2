import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useSidebar } from "../context/SidebarContext";

export default function Layout({ children, activeTab, onTabChange }) {
  const { open, close } = useSidebar();

  return (
    <div className="min-h-screen w-full flex bg-[#121212] text-white overflow-x-hidden">
      {/* Overlay Mobile */}
      {open && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* Sidebar Lateral */}
      <div
        className={`
          fixed md:static z-50 min-h-screen bg-[#1a1a1a] border-r border-[#2a2a2a]
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-6 md:p-10 w-full max-w-[100vw]">
        <Header />
        <div className="mt-6">
          {children}
        </div>
      </main>
    </div>
  );
}