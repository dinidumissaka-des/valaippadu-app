// Vercel serverless adapter for GET /api/weather/current
const { getCurrentConditions } = require('../server/services/openMeteoAdapter');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  try {
    const data = await getCurrentConditions();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
