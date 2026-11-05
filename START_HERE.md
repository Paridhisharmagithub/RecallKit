# Start Here — RecallKit

## Prerequisites
- Node.js 20.18.0 or newer
- npm
- Groq API key

## 1. Install Dependencies

```powershell
npm install
```

## 2. Configure Environment Variables

Create `.env` from `.env.example`:

```powershell
Copy-Item .env.example .env
```

Add your Groq API key to `.env`:

```env
GROQ_API_KEY=your_actual_key
GROQ_MODEL=openai/gpt-oss-20b
PORT=3001
AI_TIMEOUT_MS=90000
```

Never commit `.env` to GitHub.

## 3. Test AI Integration

```powershell
npm run test:groq
```

## 4. Start RecallKit

```powershell
npm start
```

Open http://localhost:5173.

## 5. Verify Backend

Open http://localhost:3001/api/health.

## 6. Additional Commands

```powershell
npm run check
npm test
npm run build
```

For detailed architecture, features, error handling, AI usage, and known limitations, refer to [README.md](README.md).