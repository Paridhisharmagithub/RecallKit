import test from 'node:test';
import assert from 'node:assert/strict';
import { StudySetSchema } from '../shared/studySchema.js';

const validStudySet = {
  title: 'React Fundamentals',
  summary: 'A short introduction to React state and effects.',
  flashcards: [
    { front: 'What is a component?', back: 'A reusable piece of UI.' },
    { front: 'What does useState do?', back: 'It adds local state to a component.' },
    { front: 'What does useEffect do?', back: 'It synchronizes with external systems.' },
  ],
  quiz: [
    { question: 'Which hook manages local state?', options: ['useEffect', 'useState', 'useMemo', 'useRef'], correctAnswerIndex: 1, explanation: 'useState adds state to a component.' },
    { question: 'Which hook synchronizes with external systems?', options: ['useEffect', 'useState', 'useMemo', 'useRef'], correctAnswerIndex: 0, explanation: 'useEffect is for synchronization.' },
    { question: 'Which hook stores a mutable value without a render?', options: ['useEffect', 'useState', 'useMemo', 'useRef'], correctAnswerIndex: 3, explanation: 'A ref mutation does not trigger a render.' },
  ],
  keyConcepts: [
    { term: 'Component', description: 'A reusable piece of UI.' },
    { term: 'State', description: 'Data that can change over time.' },
    { term: 'Effect', description: 'Synchronization with an external system.' },
  ],
};

test('accepts a complete study set', () => {
  const result = StudySetSchema.safeParse(validStudySet);
  assert.equal(result.success, true);
});

test('rejects an invalid correctAnswerIndex', () => {
  const invalid = structuredClone(validStudySet);
  invalid.quiz[0].correctAnswerIndex = 4;
  assert.equal(StudySetSchema.safeParse(invalid).success, false);
});

test('rejects a question with fewer than four options', () => {
  const invalid = structuredClone(validStudySet);
  invalid.quiz[0].options.pop();
  assert.equal(StudySetSchema.safeParse(invalid).success, false);
});

test('rejects duplicate quiz questions', () => {
  const invalid = structuredClone(validStudySet);
  invalid.quiz[1].question = invalid.quiz[0].question;
  assert.equal(StudySetSchema.safeParse(invalid).success, false);
});

test('rejects missing key concepts', () => {
  const invalid = structuredClone(validStudySet);
  invalid.keyConcepts = [];
  assert.equal(StudySetSchema.safeParse(invalid).success, false);
});
