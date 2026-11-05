import { z } from 'zod';

const nonEmptyText = (max = 500) => z.string().trim().min(1).max(max);

export const StudySetSchema = z.object({
  title: nonEmptyText(100),
  summary: nonEmptyText(500),
  flashcards: z.array(
    z.object({
      front: nonEmptyText(240),
      back: nonEmptyText(500),
    }).strict(),
  ).min(3).max(8),
  quiz: z.array(
    z.object({
      question: nonEmptyText(300),
      options: z.array(nonEmptyText(180)).length(4),
      correctAnswerIndex: z.number().int().min(0).max(3),
      explanation: nonEmptyText(500),
    }).strict(),
  ).min(3).max(8),
  keyConcepts: z.array(
    z.object({
      term: nonEmptyText(100),
      description: nonEmptyText(500),
    }).strict(),
  ).min(3).max(8),
}).strict().superRefine((studySet, ctx) => {
  const normalizedQuestions = studySet.quiz.map((item) => item.question.toLowerCase());
  if (new Set(normalizedQuestions).size !== normalizedQuestions.length) {
    ctx.addIssue({ code: 'custom', path: ['quiz'], message: 'Quiz questions must be unique.' });
  }

  studySet.quiz.forEach((item, index) => {
    const normalizedOptions = item.options.map((option) => option.toLowerCase());
    if (new Set(normalizedOptions).size !== normalizedOptions.length) {
      ctx.addIssue({ code: 'custom', path: ['quiz', index, 'options'], message: 'Each question must have four distinct options.' });
    }
  });

  const normalizedTerms = studySet.keyConcepts.map((item) => item.term.toLowerCase());
  if (new Set(normalizedTerms).size !== normalizedTerms.length) {
    ctx.addIssue({ code: 'custom', path: ['keyConcepts'], message: 'Key concepts must be unique.' });
  }
});

export const studySetJsonSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'A concise title for the study set.' },
    summary: { type: 'string', description: 'A concise summary of the supplied study material.' },
    flashcards: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          front: { type: 'string', description: 'A concise recall question or prompt.' },
          back: { type: 'string', description: 'An accurate concise answer.' },
        },
        required: ['front', 'back'],
        additionalProperties: false,
      },
    },
    quiz: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string', description: 'A clear multiple-choice question.' },
          options: { type: 'array', items: { type: 'string' } },
          correctAnswerIndex: { type: 'integer', minimum: 0, maximum: 3 },
          explanation: { type: 'string', description: 'Briefly explain the correct answer.' },
        },
        required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
        additionalProperties: false,
      },
    },
    keyConcepts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          term: { type: 'string', description: 'The name of an important concept.' },
          description: { type: 'string', description: 'A concise definition grounded in the supplied notes.' },
        },
        required: ['term', 'description'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'summary', 'flashcards', 'quiz', 'keyConcepts'],
  additionalProperties: false,
};

export function normalizeStudySet(studySet) {
  return {
    ...studySet,
    flashcards: studySet.flashcards.map((card, index) => ({
      ...card,
      id: `card-${index + 1}`,
    })),
    quiz: studySet.quiz.map((question, index) => ({
      ...question,
      id: `question-${index + 1}`,
    })),
    keyConcepts: studySet.keyConcepts.map((concept, index) => ({
      ...concept,
      id: `concept-${index + 1}`,
    })),
  };
}
