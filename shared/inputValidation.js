const GREETING_ONLY_MESSAGES = new Set([
  'hi',
  'hello',
  'hey',
  'hi there',
  'hello there',
  'hey there',
  'good morning',
  'good afternoon',
  'good evening',
  'how are you',
  "what's up",
  'whats up',
  'thanks',
  'thank you',
  'ok',
  'okay',
]);

/**
 * Returns a friendly validation message for input that is empty or only a greeting.
 * Short academic topics such as "DBMS", "React", and "Photosynthesis" remain valid.
 * Returns null when the input can be sent to the AI provider.
 */
export function getStudyInputError(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return 'Please enter study notes or a topic first.';
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ');

  if (GREETING_ONLY_MESSAGES.has(normalized)) {
    return 'That looks like a greeting rather than study material. Enter a subject or paste your notes—for example, “React hooks”, “DBMS normalization”, or “Operating system scheduling”.';
  }

  return null;
}
