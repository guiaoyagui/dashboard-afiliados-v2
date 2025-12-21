import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- HELPERS ---
const findValue = (item, keys) => {
  if (!item) return 0;
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) return Number(item[key]);
  }
  return 0;
};

const findDate = (item) => {
  if (!item) return null;
  const candidates = [item.dt, item.period_date, item.PeriodDate, item.date, item.Date, item.day];
  for (const val of candidates) {
    if (val && typeof val === 'string' && val.length >= 10) return val;
  }
  return null;
};

// --- 1. LISTA DE AFILIADOS ---
async function fetchAllProfiles() {
  let allProfiles = [];
  let start = 0;
  let limit = 1000;
  let hasMore = true;
  console.log("📂 Buscando perfis...");
  while (hasMore) {
    try {
      const response = await axios.get(`${process.env.SMARTICO_BASE_URL}/api/af2_aff_op`, {
        headers: { authorization: process.env.SMARTICO_API_KEY },
        params: { range: `[${start},${start + limit}]` }
      });
      const data = response.data || [];
      if (!Array.isArray(data) || data.length === 0) { hasMore = false; } 
      else { allProfiles = [...allProfiles, ...data]; start += limit; if (data.length < limit) hasMore = false; await delay(100); }
    } catch (e) { hasMore = false; }
  }
  return allProfiles;
}

async function fetchFinancialReport(params) {
  let allData = [];
  let limit = 200; 
  let offset = 0;
  let hasMore = true;
  let lastFirstId = null;
  console.log(`💰 Buscando financeiro...`);
  while (hasMore) {
    try {
      const response = await axios.get(`${process.env.SMARTICO_BASE_URL}/api/af2_media_report_op`, {
        headers: { authorization: process.env.SMARTICO_API_KEY },
        params: { ...params, limit, offset }
      });
      const data = response.data.data || [];
      if (data.length === 0) break;
      const currentSig = JSON.stringify({id: data[0].affiliate_id, val: data[0].commissions_total});
      if (currentSig === lastFirstId) break;
      lastFirstId = currentSig;
      allData = [...allData, ...data];
      if (data.length < limit) hasMore = false; else { offset += limit; await delay(100); }
    } catch (e) { hasMore = false; }
  }
  return allData;
}

app.get("/api/affiliates", async (req, res) => {
  try {
    const { date_from, date_to } = req.query;
    const [profiles, financialData] = await Promise.all([
      fetchAllProfiles(),
      fetchFinancialReport({ aggregation_period: "MONTH", group_by: "affiliate_id,username", date_from, date_to })
    ]);
    const affiliateMap = {};
    const translateStatus = (s) => ({'Approved':'Ativo','Pending':'Pendente','Blocked':'Bloqueado'}[s] || s || 'Desconhecido');

    profiles.forEach(p => {
      if (p.affiliate_id === 468904 || (p.username && String(p.username).includes("DEFAULT"))) return;
      affiliateMap[p.affiliate_id] = {
        id: p.affiliate_id, name: p.username || `Affiliate ${p.affiliate_id}`, "Affiliate username": p.username,
        manager: p.manager_username || "Sem Gerente", country: p.country || "Global", deal: p.default_deal_info?.deal_group_name || "Padrão",
        status: translateStatus(p.aff_status_name), email: p.bo_user_email || "", phone: p.phone_number || "", skype: p.skype || "",
        fullName: [p.first_name, p.last_name].filter(Boolean).join(" "), balance: Number(p.balance || 0), payments: Number(p.payments || 0),
        label: p.label_name || "", created: p.create_date, registrations: 0, ftds: 0, commission: 0, net_pnl: 0
      };
    });

    financialData.forEach(item => {
      if (item.affiliate_id === 468904 || (item.username && String(item.username).includes("DEFAULT"))) return;
      const id = item.affiliate_id;
      if (!affiliateMap[id]) {
        affiliateMap[id] = {
          id: id, name: item.username || `Affiliate ${id}`, "Affiliate username": item.username,
          manager: "Sem Gerente", country: "Global", deal: "Padrão", status: "Ativo",
          email: "", phone: "", skype: "", fullName: "", balance: 0, payments: 0, label: "", created: null,
          registrations: 0, ftds: 0, commission: 0, net_pnl: 0
        };
      }
      affiliateMap[id].registrations += findValue(item, ['registration_count', 'RegistrationCount']);
      affiliateMap[id].ftds += findValue(item, ['ftd_count', 'FtdCount']);
      affiliateMap[id].commission += findValue(item, ['commissions_total', 'CommissionsTotal']);
      affiliateMap[id].net_pnl += findValue(item, ['net_pl', 'NetPL']);
    });

    const finalLista = Object.values(affiliateMap);
    finalLista.sort((a, b) => b.net_pnl - a.net_pnl);
    res.json({ affiliates: finalLista });
  } catch (error) { res.status(500).json({ error: "Erro interno" }); }
});

// =================================================================================
// ROTA 2: JOGADORES (CORREÇÃO: PRIORIDADE ID EXTERNO)
// =================================================================================
app.get("/api/affiliates/:id/players", async (req, res) => {
  try {
    const { id } = req.params;
    const { date_from, date_to } = req.query;

    console.log(`\n👥 Filtrando jogadores EXCLUSIVOS do ID: ${id}...`);

    const response = await axios.get(`${process.env.SMARTICO_BASE_URL}/api/af2_media_report_op`, {
      headers: { authorization: process.env.SMARTICO_API_KEY },
      params: { 
        date_from, 
        date_to,
        filter_affiliate_id: id, 
        aggregation_period: "DAY", 
        // Pede os dois IDs para podermos escolher
        group_by: "affiliate_id,registration_id,ext_customer_id,day", 
        limit: 2500
      }
    });

    const rawData = response.data.data || [];
    console.log(`   -> Total bruto: ${rawData.length}`);

    const playersMap = {};
    let blockedCount = 0;

    rawData.forEach(row => {
      // 1. FILTRO DE SEGURANÇA (Mantido)
      if (row.affiliate_id && String(row.affiliate_id) !== String(id)) {
         blockedCount++;
         return; 
      }

      // 2. CORREÇÃO CRÍTICA DO ID:
      // Prioriza 'ext_customer_id' (ID do SeguroPlay). 
      // Só usa 'registration_id' (ID Smartico) se o externo não existir.
      let displayId = row.ext_customer_id;
      
      // Se ext_customer_id for vazio, nulo ou '0', tenta o interno
      if (!displayId || displayId === "0" || displayId === "null" || displayId.trim() === "") {
          displayId = row.registration_id;
      }

      // Se ainda assim não tiver ID, ignora
      if (!displayId || displayId === "null" || displayId.trim() === "") return;

      // 3. Filtro de Atividade
      const regCount = findValue(row, ['registration_count', 'RegistrationCount']);
      const ftdCount = findValue(row, ['ftd_count', 'FtdCount']);
      const money = findValue(row, ['net_deposits', 'deposits', 'deposit_total', 'ftd_total']);

      if (regCount === 0 && ftdCount === 0 && money === 0) return;

      if (!playersMap[displayId]) {
        playersMap[displayId] = {
          playerId: displayId, // AGORA VAI APARECER O ID CERTO (75...)
          country: row.country || "BR",
          registeredAt: null,
          depositedAt: null,
          ftdAmount: 0
        };
      }

      const p = playersMap[displayId];
      const currentDate = findDate(row);

      if (currentDate) {
        if (regCount > 0) {
          if (!p.registeredAt || new Date(currentDate) < new Date(p.registeredAt)) {
            p.registeredAt = currentDate;
          }
        }
        if (ftdCount > 0 || money > 0) {
          if (!p.depositedAt || new Date(currentDate) < new Date(p.depositedAt)) {
            p.depositedAt = currentDate;
            if (money > 0) p.ftdAmount = money;
            else if (ftdCount > 0 && p.ftdAmount === 0) p.ftdAmount = 10; 
          }
        }
      }
    });

    const list = Object.values(playersMap);
    
    // Filtro Final
    const finalList = list.filter(p => p.registeredAt || p.depositedAt);

    finalList.sort((a,b) => {
        const da = new Date(a.registeredAt || a.depositedAt || 0);
        const db = new Date(b.registeredAt || b.depositedAt || 0);
        return db - da;
    });

    console.log(`   ⛔ Bloqueados: ${blockedCount}`);
    console.log(`   ✅ Jogadores Finais (IDs Corrigidos): ${finalList.length}`);
    res.json({ players: finalList });

  } catch (error) {
    console.error("❌ Erro jogadores:", error.message);
    res.json({ players: [] });
  }
});

// --- OUTRAS ROTAS ---
app.get("/api/affiliates/:id/history", async (req, res) => {
  try {
    const { id } = req.params;
    const { date_from, date_to } = req.query;
    const response = await axios.get(`${process.env.SMARTICO_BASE_URL}/api/af2_media_report_op`, {
      headers: { authorization: process.env.SMARTICO_API_KEY },
      params: { aggregation_period: "DAY", group_by: "day", filter_affiliate_id: id, date_from, date_to }
    });
    const rawData = response.data.data || [];
    const history = rawData.map(item => ({
      name: findDate(item),
      registrations: findValue(item, ['registration_count', 'RegistrationCount']),
      ftds: findValue(item, ['ftd_count', 'FtdCount']),
      commission: findValue(item, ['commissions_total', 'CommissionsTotal']),
      net_pnl: findValue(item, ['net_pl', 'NetPL'])
    }));
    res.json({ history });
  } catch (e) { res.json({ history: [] }); }
});

app.get("/api/overview/history", async (req, res) => {
  try {
    const response = await axios.get(`${process.env.SMARTICO_BASE_URL}/api/af2_media_report_op`, {
      headers: { authorization: process.env.SMARTICO_API_KEY },
      params: { aggregation_period: "DAY", group_by: "day", date_from: req.query.date_from, date_to: req.query.date_to }
    });
    const rawData = response.data.data || [];
    const history = rawData.map(item => ({
      name: findDate(item),
      registrations: findValue(item, ['registration_count', 'RegistrationCount']),
      ftds: findValue(item, ['ftd_count', 'FtdCount']),
      commission: findValue(item, ['commissions_total', 'CommissionsTotal']),
      net_pnl: findValue(item, ['net_pl', 'NetPL'])
    }));
    res.json({ history });
  } catch (e) { res.json({ history: [] }); }
});

const PORT = 3333;
app.listen(PORT, () => console.log(`🚀 Backend (Correção ID Externo) rodando em http://localhost:${PORT}`));