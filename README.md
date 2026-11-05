# RecallKit — AI Study Assistant (Groq edition)

RecallKit turns free-form study notes into an interactive learning workspace with flashcards, a multiple-choice quiz, and a key-concept checklist. This is a single-provider Groq setup using one server-side API key and one configured model.

## Features

- Free-form notes input (up to 10,000 characters)
- Groq API integration through a Node/Express backend
- Strict JSON Schema output with `openai/gpt-oss-20b`
- Zod validation on the server and again in the browser
- Flashcards: flip, previous/next, shuffle, mark known or review again
- Multiple-choice quiz with submitted-answer feedback and explanations
- Retest only incorrectly answered questions
- Expandable key concepts with mastered/unmastered tracking
- Progress calculated from actual interactions in the current session
- Loading, empty, error, timeout, rate-limit and invalid-output states
- Request cancellation and request-ID protection against stale responses
- Responsive mobile-first interface

## Technology stack

- React 19 + Vite 6.4
- JavaScript (ES modules)
- Custom responsive CSS
- Node.js + Express 5
- Groq Chat Completions API using Node's built-in `fetch`
- Model: `openai/gpt-oss-20b`
- Strict JSON Schema structured output
- Zod 4 for runtime validation
- Lucide React icons

## Requirements

- Node.js **20.18.0 or newer** (the project is configured for the user's existing Node 20.18.0 setup)
- npm
- A Groq API key from https://console.groq.com/keys

No Node.js upgrade is required for the pinned Vite 6 toolchain.

## Run locally (Windows PowerShell)

1. Extract the ZIP and open PowerShell in the extracted `RecallKit-Groq` folder (the folder containing `package.json`).
2. Install dependencies:

   ```powershell
   npm install
   ```

3. Create the local environment file:

   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

4. Add your Groq key to `.env`:

   ```env
   GROQ_API_KEY=gsk_your_actual_key_here
   GROQ_MODEL=openai/gpt-oss-20b
   PORT=3001
   AI_TIMEOUT_MS=90000
   ```

5. Start the frontend and backend together:

   ```powershell
   npm start
   ```

6. Open http://localhost:5173.

The Vite server proxies `/api` requests to Express on port 3001. The backend health endpoint is http://localhost:3001/api/health. It reports the configured provider and model, but never returns the API key.

## Test Groq before using the UI

After adding `GROQ_API_KEY` to `.env`, run:

```powershell
node test-groq.js
```

This makes a real Groq structured-output request with sample React notes. It parses the response and validates it with the same Zod schema used by the application. The script prints only a summary of the generated study set.

## Checks and production build

```powershell
npm run check
npm test
npm run build
```

For a single-service deployment:

- Build command: `npm install && npm run build`
- Start command: `npm run start:prod`
- Required environment variable: `GROQ_API_KEY`
- Optional variables: `GROQ_MODEL`, `PORT`, `AI_TIMEOUT_MS`

Never place the Groq key in frontend code or a `VITE_` variable.

## How the AI integration works

1. React posts `{ "notes": "..." }` to `POST /api/generate`.
2. Express validates the incoming text and its 10,000-character limit.
3. The backend sends the prompt and strict JSON Schema to Groq's OpenAI-compatible Chat Completions endpoint.
4. The response is parsed as JSON and validated using `StudySetSchema`.
5. Only validated study-set data is returned to React.
6. React validates the payload again before rendering the interactive workspace.

The API key is read only on the server from `process.env.GROQ_API_KEY`. Node's built-in `fetch` is used, so no Groq SDK is required.

## Error handling

- Empty or oversized input is rejected before calling the model.
- Empty model output, malformed JSON and invalid data shapes return controlled errors.
- Invalid API keys, model-not-found errors, rate limits, provider outages and timeouts receive readable messages.
- The frontend aborts an earlier fetch when a newer generation starts.
- A request ID ensures an older response cannot overwrite a newer result.
- Flashcards and concept state reset when a new study set is generated.

## AI usage note

Update this note before submitting so it accurately reflects your work. Suggested wording, only if true:

> I used ChatGPT to help plan the project structure, identify failure cases, and review implementation approaches. I inspected and adapted the suggestions, tested the application, and can explain the code and design decisions. Groq is used at runtime to generate study content.

## Known limitations

- Model-generated educational content can contain factual inaccuracies; verify important information against course material.
- Output quality depends on the clarity and completeness of supplied notes.
- Notes are limited to 10,000 characters.
- Progress is held in React state for the current session and is not synchronized across devices or persisted after a full reload.
- No authentication, database, file uploads, or multi-user history.
- Groq availability, account limits, and model catalogue may change. Strict JSON Schema is enabled for `openai/gpt-oss-20b`; use a model currently listed by Groq as supporting strict structured outputs if changing `GROQ_MODEL`.

## Time spent

Record your actual development time before submitting: **[fill in actual hours]**.

## Submission checklist

- [ ] Add a real Groq key to local `.env` (never commit it).
- [ ] Run `npm install` and `npm start` from a clean extraction.
- [ ] Run `node test-groq.js` and confirm structured generation succeeds.
- [ ] Test with your own study notes.
- [ ] Test empty input, API failure, and retry behaviour.
- [ ] Test flashcard flip, navigation, shuffle, and review status.
- [ ] Complete a quiz and retest wrong answers.
- [ ] Expand concepts and mark them mastered.
- [ ] Generate a second study set and confirm old card/concept state is cleared.
- [ ] Test mobile widths and a physical phone if possible.
- [ ] Run `npm run check`, `npm test`, and `npm run build`.
- [ ] Update the AI usage note and actual time spent.
- [ ] Deploy, record the requested demo, and add links to your submission.
- [ ] Push meaningful commits and verify repository access for Flam.

## Provider documentation

- Groq structured outputs: https://console.groq.com/docs/structured-outputs
- Groq GPT-OSS 20B model: https://console.groq.com/docs/model/openai/gpt-oss-20b
- Groq API keys: https://console.groq.com/keys
