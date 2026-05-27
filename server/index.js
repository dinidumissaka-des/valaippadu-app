require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const weatherRoutes     = require('./routes/weather');
const forecastRoutes    = require('./routes/forecast');
const coordinatorRoutes = require('./routes/coordinator');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/weather',     weatherRoutes);
app.use('/api/weather/forecast', forecastRoutes);
app.use('/api/coordinator', coordinatorRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.listen(PORT, () => console.log(`Valaippadu server running on :${PORT}`));

module.exports = app;
