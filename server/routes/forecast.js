const express = require('express');
const { getForecast } = require('../services/openMeteoAdapter');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await getForecast();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
