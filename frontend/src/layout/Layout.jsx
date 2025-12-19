import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

export default function Layout() {
  const { open, close } = useSidebar();

  return (
    <div className="min-h-screen w-full flex bg-[#121212] text-white overflow-x-hidden">
      {/* Overlay mobile */}
      {open && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static z-50 h-full
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      {/* Conteúdo */}
      <main className="flex-1 p-6 md:p-10">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
