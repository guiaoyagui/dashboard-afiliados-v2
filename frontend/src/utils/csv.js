import Papa from "papaparse";

export function parseCsv(file, onComplete) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    complete: ({ data }) => {
      const rows = data.map((r, i) => ({ _id: i + 1, ...r }));
      onComplete(rows);
    }
  });
}
