import { Menu } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

export default function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="md:hidden flex items-center gap-4 mb-6">
      <button
        onClick={toggle}
        className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a]"
      >
        <Menu size={20} />
      </button>
      <h1 className="font-semibold text-lg">Dashboard</h1>
    </header>
  );
}
