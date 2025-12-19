import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Health check
 */
app.get("/api/ping", (req, res) => {
  res.json({ status: "ok", message: "Backend funcionando 🚀" });
});

/**
 * Affiliates endpoint (Operator)
 */
app.get("/api/affiliates", async (req, res) => {
  try {
    const {
      date_from,
      date_to,
      aggregation_period = "MONTH"
    } = req.query;

    const response = await axios.get(
      `${process.env.SMARTICO_BASE_URL}/api/af2_media_report_op`,
      {
        headers: {
          authorization: process.env.SMARTICO_API_KEY
        },
        params: {
          aggregation_period,
          group_by: "affiliate_id,username",
          date_from,
          date_to
        }
      }
    );

    // Normalizar dados para o frontend
    const affiliates = response.data.data.map(item => ({
      affiliate: item.username || `Affiliate ${item.affiliate_id}`,
      registrations: item.registration_count || 0,
      ftds: item.ftd_count || 0,
      commission: Number(item.commissions_total || 0),
      net_pl: Number(item.net_pl || 0)
    }));

    res.json({
      meta: response.data.meta,
      affiliates
    });

  } catch (error) {
    console.error("Smartico API error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Erro ao buscar dados da Smartico"
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${process.env.PORT}`);
});
