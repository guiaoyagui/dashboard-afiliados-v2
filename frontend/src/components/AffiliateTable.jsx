export default function AffiliateTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-gray-400 text-sm">
        Nenhum afiliado carregado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-400 border-b border-[#2a2a2a]">
          <tr>
            <th className="py-2">Afiliado</th>
            <th className="py-2 text-center">Registros</th>
            <th className="py-2 text-center">FTDs</th>
            <th className="py-2 text-right">Comissão ($)</th>
            <th className="py-2 text-right">Net P&L ($)</th>
          </tr>
        </thead>

        <tbody>
          {data.map((aff, index) => (
            <tr
              key={index}
              className="border-b border-[#1f1f1f] hover:bg-[#1a1a1a]"
            >
              <td className="py-2">{aff.affiliate}</td>
              <td className="py-2 text-center">{aff.registrations}</td>
              <td className="py-2 text-center">{aff.ftds}</td>
              <td className="py-2 text-right">
                ${aff.commission.toFixed(2)}
              </td>
              <td className="py-2 text-right">
                ${aff.net.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
