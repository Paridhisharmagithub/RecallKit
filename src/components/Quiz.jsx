import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, Check, CheckCircle2, ChevronRight, RotateCcw, Trophy, X } from 'lucide-react';

export default function Quiz({ questions, onComplete }) {
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [mode, setMode] = useState('all');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    setActiveQuestions(questions);
    setMode('all');
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setAnswers({});
    setResult(null);
  }, [questions]);

  const current = activeQuestions[index];
  const correctCount = useMemo(() => activeQuestions.reduce((total, question) => {
    return total + (answers[question.id] === question.correctAnswerIndex ? 1 : 0);
  }, 0), [activeQuestions, answers]);

  function finishQuiz(nextAnswers) {
    const correct = activeQuestions.filter((question) => nextAnswers[question.id] === question.correctAnswerIndex).length;
    const incorrectIds = activeQuestions.filter((question) => nextAnswers[question.id] !== question.correctAnswerIndex).map((question) => question.id);
    const finalResult = { correct, total: activeQuestions.length, incorrectIds, mode };
    setAnswers(nextAnswers);
    setResult(finalResult);
    onComplete?.(finalResult);
  }

  function checkAnswer() {
    if (selected === null || !current) return;
    const nextAnswers = { ...answers, [current.id]: selected };
    setAnswers(nextAnswers);
    setChecked(true);
  }

  function nextQuestion() {
    if (index === activeQuestions.length - 1) {
      finishQuiz(answers);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
    setChecked(false);
  }

  function retestWrong() {
    const incorrectQuestions = questions.filter((question) => result.incorrectIds.includes(question.id));
    if (!incorrectQuestions.length) return;
    setActiveQuestions(incorrectQuestions);
    setMode('retest');
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setAnswers({});
    setResult(null);
  }

  function restartQuiz() {
    setActiveQuestions(questions);
    setMode('all');
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setAnswers({});
    setResult(null);
  }

  if (result) {
    const accuracy = Math.round((result.correct / result.total) * 100);
    return (
      <div className="activity-panel results-panel">
        <div className="results-icon"><Trophy size={31} /></div>
        <span className="eyebrow">{result.mode === 'retest' ? 'REVISION ROUND COMPLETE' : 'STUDY SESSION COMPLETE'}</span>
        <h3>{accuracy === 100 ? 'Perfect recall!' : accuracy >= 60 ? 'Nice work. Keep going!' : 'Good start. Keep practising!'}</h3>
        <div className="score-card">
          <strong>{result.correct}<span>/{result.total}</span></strong>
          <span>{accuracy}% accuracy</span>
        </div>
        <div className="score-split">
          <div className="score-good"><CheckCircle2 size={19} /><strong>{result.correct}</strong><span>Correct</span></div>
          <div className="score-bad"><X size={19} /><strong>{result.total - result.correct}</strong><span>To review</span></div>
        </div>
        {result.incorrectIds.length > 0 ? (
          <button className="primary-button full-button" type="button" onClick={retestWrong}><RotateCcw size={16} /> Retest incorrect answers</button>
        ) : (
          <div className="success-note"><CheckCircle2 size={17} /> You got every question right. Great work!</div>
        )}
        <button className="secondary-button full-button" type="button" onClick={restartQuiz}>Start quiz again <ArrowRight size={16} /></button>
      </div>
    );
  }

  if (!current) return <div className="empty-inline">No quiz questions are available.</div>;

  const isCorrect = selected === current.correctAnswerIndex;

  return (
    <div className="activity-panel">
      <div className="activity-topline">
        <div><span className="eyebrow">{mode === 'retest' ? 'FOCUSED REVISION' : 'CHECK YOUR UNDERSTANDING'}</span><h3>{mode === 'retest' ? 'Retry questions' : 'Quick knowledge check'}</h3></div>
        <span className="count-pill">{index + 1} <span>/</span> {activeQuestions.length}</span>
      </div>
      <div className="progress-track"><span style={{ width: `${((index + 1) / activeQuestions.length) * 100}%` }} /></div>
      <div className="question-category">{questions.length > 0 ? 'STUDY SET • MULTIPLE CHOICE' : 'QUIZ'}</div>
      <h4 className="question-title">{current.question}</h4>
      <div className="option-list">
        {current.options.map((option, optionIndex) => {
          const isRightOption = checked && optionIndex === current.correctAnswerIndex;
          const isWrongSelection = checked && selected === optionIndex && !isCorrect;
          return (
            <button
              className={`option-button ${selected === optionIndex ? 'is-selected' : ''} ${isRightOption ? 'is-correct' : ''} ${isWrongSelection ? 'is-wrong' : ''}`}
              type="button"
              key={`${current.id}-${optionIndex}`}
              onClick={() => !checked && setSelected(optionIndex)}
              disabled={checked}
              aria-pressed={selected === optionIndex}
            >
              <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
              <span className="option-text">{option}</span>
              {isRightOption && <CheckCircle2 size={18} />}
              {isWrongSelection && <X size={18} />}
            </button>
          );
        })}
      </div>

      {checked && (
        <div className={`answer-feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`} role="status">
          <div className="feedback-title">{isCorrect ? <CheckCircle2 size={17} /> : <AlertCircle size={17} />}{isCorrect ? 'That’s correct!' : 'Not quite — here’s why.'}</div>
          <p>{current.explanation}</p>
        </div>
      )}

      {!checked ? (
        <button className="primary-button full-button" type="button" onClick={checkAnswer} disabled={selected === null}>Check answer</button>
      ) : (
        <button className="primary-button full-button" type="button" onClick={nextQuestion}>
          {index === activeQuestions.length - 1 ? 'See results' : 'Next question'} <ChevronRight size={17} />
        </button>
      )}
      <div className="quiz-footnote">{correctCount} correct so far · Your answers are scored when submitted.</div>
    </div>
  );
}
