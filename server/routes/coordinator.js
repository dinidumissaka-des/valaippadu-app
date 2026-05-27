const express = require('express');
const { setCoordinatorNote, clearCoordinatorNote } = require('../services/openMeteoAdapter');

const router = express.Router();

router.post('/note', (req, res) => {
  const { text, override_zone } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }
  const note = setCoordinatorNote(text, override_zone);
  res.json({ success: true, posted_at: note.posted_at });
});

router.delete('/note', (req, res) => {
  clearCoordinatorNote();
  res.json({ success: true });
});

module.exports = router;
