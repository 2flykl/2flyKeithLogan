require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const SUNO_COOKIE = process.env.SUNO_COOKIE;
const SUNO_BASE = 'https://studio-api.suno.ai'; // base for Suno internal API (may need adjustment)

// Health endpoint
app.get('/api/suno/health', (req, res) => {
  if (!SUNO_COOKIE) {
    return res.json({ status: 'UNAVAILABLE', credits: 0, message: 'SUNO_COOKIE missing' });
  }
  // Simple static health response (could ping Suno for real status)
  res.json({ status: 'READY', credits: 8420, message: 'SUNO READY' });
});

// Generate endpoint – proxies request to Suno
app.post('/api/suno/generate', async (req, res) => {
  if (!SUNO_COOKIE) {
    return res.status(401).json({ error: 'SUNO_COOKIE missing' });
  }
  const { genre, mood, bpm, drums, instrument } = req.body;
  const prompt = `[Style: ${genre}, ${mood}] [Tempo: ${bpm} BPM] [Drums: ${drums}] [Instruments: ${instrument}]`;
  try {
    const sunoRes = await fetch(`${SUNO_BASE}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': SUNO_COOKIE,
        'User-Agent': 'Flyzone-Bridge/1.0'
      },
      body: JSON.stringify({ prompt })
    });
    if (!sunoRes.ok) {
      const err = await sunoRes.text();
      return res.status(sunoRes.status).json({ error: err });
    }
    const data = await sunoRes.json();
    res.json({
      status: 'complete',
      audioUrl: data?.audio_url || data?.url || null,
      title: data?.title || 'Suno Generation',
      generationId: data?.id || `suno_${Date.now()}`,
      credits: 8420 // placeholder – real quota handling omitted
    });
  } catch (e) {
    console.error('Suno bridge error', e);
    res.status(500).json({ error: 'Bridge error' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Suno bridge listening on port ${PORT}`));
