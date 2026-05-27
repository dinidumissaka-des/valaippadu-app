const express = require('express');
const { getCurrentConditions } = require('../services/openMeteoAdapter');

const router = express.Router();

router.get('/current', async (req, res) => {
  try {
    const data = await getCurrentConditions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
