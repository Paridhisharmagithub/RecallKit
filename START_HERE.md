# Start RecallKit (Groq edition) on Windows

## Before you begin

- Your existing Node.js **20.18.0** and npm **10.8.2** are suitable. No Node upgrade is required.
- Create a Groq API key at https://console.groq.com/keys.
- Extract this ZIP. Open PowerShell in the extracted `RecallKit-Groq` folder (the folder containing `package.json`).

## 1. Install dependencies

```powershell
npm install
```

## 2. Create your local environment file

```powershell
Copy-Item .env.example .env
notepad .env
```

Replace the placeholder with your real Groq key:

```env
GROQ_API_KEY=gsk_your_actual_key
GROQ_MODEL=openai/gpt-oss-20b
PORT=3001
AI_TIMEOUT_MS=90000
```

Save `.env`. Never put the key in React code or commit `.env` to GitHub.

## 3. Test the Groq integration

```powershell
node test-groq.js
```

This makes a real Groq request using strict JSON Schema and validates the response with the local Zod schema. It prints a summary, not your API key.

## 4. Start the app

```powershell
npm start
```

Open http://localhost:5173. Keep the terminal open while using the app. The frontend runs on port 5173 and Vite proxies `/api` requests to the Express backend on port 3001.

Check the backend at http://localhost:3001/api/health. The health response identifies the configured provider and model but never exposes the API key.

## 5. Verify the application

1. Click the **React Hooks** sample chip.
2. Click **Generate my study set**.
3. Flip a flashcard, mark one as known, and shuffle the deck.
4. Complete the quiz and retest incorrect answers.
5. Expand a key concept and mark it as understood.
6. Open Progress and confirm the figures reflect your activity.
7. Generate a second study set and confirm cards and concepts reset to the new material.

## Useful checks

```powershell
npm run check
npm test
npm run build
```

## Troubleshooting

- `MISSING_API_KEY`: confirm `.env` is in the project root and contains `GROQ_API_KEY`.
- `INVALID_API_KEY`: check the key in https://console.groq.com/keys, update `.env`, and restart `npm start`.
- `RATE_LIMITED`: review current usage and limits in the Groq console, then retry when allowed.
- `PROVIDER_UNAVAILABLE`: Groq may be temporarily unavailable; try again later.
- `MODEL_NOT_FOUND`: check that `GROQ_MODEL` is `openai/gpt-oss-20b` or another currently supported model.
- Port 5173 or 3001 is already in use: stop the process using that port and restart.

## Keep your key private

Do not share `.env`, paste the key into frontend code, or commit `.env` to GitHub. The `.gitignore` excludes it.
