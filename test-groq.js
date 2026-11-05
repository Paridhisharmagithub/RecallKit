import 'dotenv/config';
import { StudySetSchema, studySetJsonSchema } from './shared/studySchema.js';

const apiKey = process.env.GROQ_API_KEY;
const model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

if (!apiKey || apiKey === 'replace_with_your_groq_api_key') {
  console.error('GROQ_API_KEY is missing. Add it to the project-root .env file.');
  process.exit(1);
}

const sampleNotes = `React is a JavaScript library for building user interfaces.
Components are reusable pieces of UI. The useState hook adds state to a component. The useEffect hook synchronizes a component with external systems.`;

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 90000);

try {
  console.log(`Testing Groq model: ${model}`);
  console.log('Requesting a schema-constrained study set...');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'Return a study set grounded only in the supplied notes. Create at least three flashcards, three quiz questions with exactly four options each, and three key concepts. Use exactly one correct answer per quiz question and a zero-based correctAnswerIndex. Keep all content concise.',
        },
        { role: 'user', content: sampleNotes },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'recallkit_study_set',
          strict: true,
          schema: studySetJsonSchema,
        },
      },
      reasoning_effort: 'low',
      max_completion_tokens: 5000,
    }),
    signal: controller.signal,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    console.error(`Groq API returned HTTP ${response.status}:`, payload?.error?.message || payload);
    process.exitCode = 1;
  } else {
    const content = payload?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Groq returned no message content.');

    const parsed = JSON.parse(content);
    const validation = StudySetSchema.safeParse(parsed);
    if (!validation.success) {
      console.error('The response did not pass local Zod validation:', validation.error.issues);
      process.exitCode = 1;
    } else {
      console.log('SUCCESS: Groq returned valid JSON and it passed the RecallKit Zod schema.');
      console.log(JSON.stringify({
        title: validation.data.title,
        flashcards: validation.data.flashcards.length,
        quizQuestions: validation.data.quiz.length,
        keyConcepts: validation.data.keyConcepts.length,
      }, null, 2));
    }
  }
} catch (error) {
  if (controller.signal.aborted) {
    console.error('The Groq test timed out.');
  } else {
    console.error('Groq test failed:', error.message);
  }
  process.exitCode = 1;
} finally {
  clearTimeout(timeout);
}
