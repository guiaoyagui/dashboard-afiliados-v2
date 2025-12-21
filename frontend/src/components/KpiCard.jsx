export default function KpiCard({ label, value, icon: Icon, color }) {
  // Mapa de cores para os ícones e fundos
  const colorStyles = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    green: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  };

  const activeStyle = colorStyles[color] || colorStyles.blue;

  return (
    <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl p-5 flex items-start justify-between hover:border-[#3a3a3a] transition-colors">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      
      {Icon && (
        <div className={`p-3 rounded-lg border ${activeStyle}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}