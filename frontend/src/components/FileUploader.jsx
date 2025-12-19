import Papa from "papaparse";

export default function FileUploader({ onLoad }) {
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const formatted = result.data.map((row, index) => ({
          id: index + 1,

          // 👇 NOMES EXATOS DO CSV
          affiliate: row["Affiliate username"] || "—",
          registrations: Number(row["Registrations"] || 0),
          ftds: Number(row["FTDs"] || 0),
          commission: Number(row["Commissions"] || 0),
          net: Number(row["Net P&L"] || 0),
        }));

        console.log("CSV Smartico formatado:", formatted);

        onLoad(formatted);
      },
    });
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
      <label className="block text-sm mb-2 text-gray-400">
        Importar CSV Smartico (Afiliados)
      </label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="text-sm"
      />
    </div>
  );
}
