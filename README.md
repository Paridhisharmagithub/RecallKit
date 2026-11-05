# RecallKit — AI-Powered Study Assistant

RecallKit is a mobile-first AI-powered study assistant that transforms free-form study notes into interactive learning materials. Users can generate flashcards, take quizzes, review key concepts, and track their learning progress.

## Features

- **AI-powered study generation:** Convert notes or a topic into a structured study set.
- **Interactive flashcards:** Flip cards, navigate, shuffle, and mark cards as known or needing revision.
- **Knowledge checks:** Answer multiple-choice questions and receive explanations.
- **Smart revision:** Retest questions answered incorrectly.
- **Key concepts:** Explore important concepts and track mastered topics.
- **Learning progress:** View flashcard activity, quiz accuracy, and concept mastery.
- **Responsive interface:** Mobile-first design with light and dark themes.
- **Reliable AI handling:** Validate structured responses and handle malformed, incomplete, empty, slow, or failed requests.

## Tech Stack

**Frontend**
- React 19
- JavaScript (ES Modules)
- Vite 6
- CSS
- Lucide React

**Backend**
- Node.js
- Express.js

**AI and Validation**
- Groq API
- GPT-OSS 20B (`openai/gpt-oss-20b`)
- Strict JSON Schema
- Zod

## Architecture

1. Users enter study notes or a recognizable academic topic.
2. React sends the input to the Express backend through `POST /api/generate`.
3. The backend sends the prompt and JSON Schema to Groq.
4. The model returns structured JSON.
5. The backend parses and validates the response using Zod.
6. Validated data is returned to the frontend, where React renders interactive learning components.

The Groq API key is stored server-side in an environment variable and is never exposed to the browser.

## Getting Started

### Prerequisites
- Node.js 20.18.0 or newer
- npm
- A Groq API key

### Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd RecallKit
```

Install dependencies:

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the project root using `.env.example`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
PORT=3001
AI_TIMEOUT_MS=90000
```

### Run Locally

```bash
npm start
```

Open:

`http://localhost:5173`

The frontend runs through Vite and communicates with the Express backend on port 3001.

## Testing

Test the Groq integration:

```bash
npm run test:groq
```

Run application checks:

```bash
npm run check
npm test
npm run build
```

## Error Handling and Reliability

RecallKit includes:

- Empty-input and unsuitable-input validation.
- JSON parsing with malformed-response handling.
- Zod schema validation for unexpected structures and missing fields.
- Handling for empty and incomplete model responses.
- Timeout handling using AbortController.
- Provider error handling for authentication failures, rate limits, unavailable services, and network errors.
- Request cancellation and request-ID tracking to prevent stale responses from overwriting newer results.
- User-friendly loading, error, and retry states.

## AI Usage Note

ChatGPT was used during development to assist with project planning, initial code scaffolding, UI and component implementation, backend integration, validation logic, troubleshooting, and documentation.

I reviewed and adapted the generated suggestions, tested the application locally, and used the assistance to understand and improve the implementation.

At runtime, RecallKit uses Groq's GPT-OSS 20B model to generate structured educational content.

## Known Limitations

- AI-generated educational content may contain factual inaccuracies and should be verified against reliable study material.
- Output quality depends on the clarity of the supplied topic or notes.
- Input is limited to 10,000 characters.
- Study sets and learning progress are maintained during the current session and are not persisted after a full reload.
- The application does not currently include authentication, database storage, file uploads, or cross-device synchronization.
- AI generation depends on Groq service availability and account usage limits.
- Streaming generation and follow-up refinement are not currently implemented.

## Time Spent

Actual hands-on development time: **[6 hrs]**

## Project Links

- GitHub Repository: [[Add repository URL](https://github.com/Paridhisharmagithub/RecallKit)]
- Live Demo: [[Add deployed application URL](https://recallkit-ii76.onrender.com/)]

