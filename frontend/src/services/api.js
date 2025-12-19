import axios from "axios";

export async function fetchAffiliateReport() {
  const res = await axios.get("http://localhost:3001/api/smartico/report");
  return res.data;
}
