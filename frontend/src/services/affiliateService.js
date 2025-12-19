const API_URL = "http://localhost:3333/api/affiliates";

export async function uploadAffiliateCSV(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Erro ao enviar CSV");
  }

  return response.json();
}
