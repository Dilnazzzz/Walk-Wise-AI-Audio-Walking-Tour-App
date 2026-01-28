const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());

// Local OpenAI proxy: generate a tour in one request
app.post('/api/generateTour', async (req, res) => {
  try {
    const { stops, locale = 'en-US', tone = 'educational' } = req.body || {};
    if (!Array.isArray(stops) || stops.length === 0) {
      return res.status(400).json({ error: 'Missing stops[]' });
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });

    const system = `You are an expert tour guide. Create an engaging walking tour in ${locale}.
Respond ONLY with JSON matching this schema:
{
  "title": string, // short catchy title without quotes
  "overview": string, // ~100 words
  "guidance": string, // clear step-by-step walking path
  "stops": [ { "name": string, "description": string } ]
}
Use a ${tone} tone. Include all user-provided stops in logical order. Avoid markdown.`;

    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `Create a walking tour for these stops: ${stops.join(', ')}` },
      ],
      temperature: 0.7,
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: json?.error || 'OpenAI error' });

    const content = json?.choices?.[0]?.message?.content;
    if (!content) return res.status(500).json({ error: 'No content' });

    let data;
    try {
      data = JSON.parse(content);
    } catch (_) {
      const match = content.match(/\{[\s\S]*\}$/);
      data = match ? JSON.parse(match[0]) : null;
    }
    if (!data) return res.status(500).json({ error: 'Invalid JSON content' });

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Unknown error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
