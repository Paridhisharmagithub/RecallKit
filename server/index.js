import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateStudySet, GenerationError } from './groq.js';

const app = express();
const PORT = Number(process.env.PORT || 3001);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'recallkit-api',
    provider: 'groq',
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
  });
});

app.post('/api/generate', async (req, res) => {
  const notes = req.body?.notes;

  if (typeof notes !== 'string' || !notes.trim()) {
    return res.status(400).json({
      error: { code: 'INVALID_INPUT', message: 'Please enter some study material first.' },
    });
  }

  if (notes.length > 10000) {
    return res.status(413).json({
      error: { code: 'INPUT_TOO_LONG', message: 'Please keep your study material under 10,000 characters.' },
    });
  }

  try {
    const data = await generateStudySet(notes.trim());
    return res.json({ data });
  } catch (error) {
    const known = error instanceof GenerationError;
    const status = known ? error.status : 500;
    const message = known ? error.message : 'Something went wrong on the server. Please try again.';
    const code = known ? error.code : 'INTERNAL_ERROR';

    if (!known) console.error('Unexpected generation error:', error);
    return res.status(status).json({ error: { code, message } });
  }
});

// Convert malformed JSON and oversized request bodies into readable API errors.
app.use((error, _req, res, next) => {
  if (res.headersSent) return next(error);

  if (error?.type === 'entity.too.large') {
    return res.status(413).json({
      error: { code: 'BODY_TOO_LARGE', message: 'The request is too large. Please shorten your notes.' },
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      error: { code: 'INVALID_JSON_BODY', message: 'The request body was not valid JSON.' },
    });
  }

  return next(error);
});

// When deployed as one service, serve the Vite production build from Express.
const distPath = path.join(projectRoot, 'dist');
app.use(express.static(distPath));
app.get(/.*/, (_req, res, next) => {
  if (res.headersSent) return next();
  return res.sendFile(path.join(distPath, 'index.html'), (error) => {
    if (error) next();
  });
});

app.listen(PORT, () => {
  console.log(`RecallKit API listening on http://localhost:${PORT}`);
});
