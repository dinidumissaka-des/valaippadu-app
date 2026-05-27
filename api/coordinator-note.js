// Vercel serverless adapter for POST/DELETE /api/coordinator/note
const { setCoordinatorNote, clearCoordinatorNote } = require('../server/services/openMeteoAdapter');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method === 'POST') {
    const { text, override_zone } = req.body ?? {};
    if (!text) return res.status(400).json({ error: 'text required' });
    const note = setCoordinatorNote(text, override_zone);
    return res.status(200).json({ success: true, posted_at: note.posted_at });
  }

  if (req.method === 'DELETE') {
    clearCoordinatorNote();
    return res.status(200).json({ success: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
