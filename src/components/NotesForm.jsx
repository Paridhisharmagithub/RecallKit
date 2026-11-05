import { useRef, useState } from 'react';
import { ArrowRight, BookOpen, FileText, Sparkles } from 'lucide-react';
import { getStudyInputError } from '../../shared/inputValidation.js';

const MAX_CHARS = 10000;

const samples = [
  {
    label: 'React Hooks',
    value: 'React Hooks let function components use state and other React features. useState adds local state. useEffect synchronizes a component with external systems and can return a cleanup function. useRef stores a mutable value that does not trigger a re-render. Hooks must be called at the top level of React components or custom hooks.',
  },
  {
    label: 'Operating Systems',
    value: 'A process is a program in execution with its own address space and resources. A thread is a unit of execution within a process; threads in the same process share memory. Context switching saves the state of one process or thread and restores another. CPU scheduling decides which ready process or thread gets CPU time. Deadlock occurs when processes wait indefinitely for resources held by one another.',
  },
  {
    label: 'DBMS',
    value: 'A database management system stores, retrieves and manages data. A primary key uniquely identifies each row. A foreign key references a key in another table. Normalization organizes tables to reduce redundancy and update anomalies. First Normal Form requires atomic values and no repeating groups. Second Normal Form requires 1NF and no partial dependency on a candidate key.',
  },
];

function getErrorPresentation(message) {
  const normalized = String(message || '').toLowerCase();

  if (
    normalized.includes('not enough study material') ||
    normalized.includes('could not find enough study material') ||
    normalized.includes('greeting rather than study material') ||
    normalized.includes('doesn’t look like study material') ||
    normalized.includes("doesn't look like study material")
  ) {
    return {
      title: "Let's find something to learn!",
      message:
        'This input does not contain enough study material yet. Enter a subject, such as React hooks or DBMS, or paste a few notes.',
      action: 'Edit your input',
      actionType: 'edit',
    };
  }

  if (
    normalized.includes('incomplete study set') ||
    normalized.includes('unexpected structure') ||
    normalized.includes('not valid json') ||
    normalized.includes('invalid json')
  ) {
    return {
      title: "We couldn't create a complete study set.",
      message:
        'The AI response was missing some required study items. You can try again or add a little more detail to your notes.',
      action: 'Try again',
      actionType: 'retry',
    };
  }

  if (
    normalized.includes('temporarily unavailable') ||
    normalized.includes('rate limit') ||
    normalized.includes('quota') ||
    normalized.includes('429') ||
    normalized.includes('503')
  ) {
    return {
      title: 'The AI service is temporarily unavailable.',
      message:
        'Your notes are still here. Please wait a moment and try generating the study set again.',
      action: 'Try again',
      actionType: 'retry',
    };
  }

  if (
    normalized.includes('could not reach') ||
    normalized.includes('connection') ||
    normalized.includes('network')
  ) {
    return {
      title: "Couldn't connect to the AI service.",
      message:
        'Check your internet connection and make sure RecallKit is still running, then try again.',
      action: 'Try again',
      actionType: 'retry',
    };
  }

  return {
    title: "We couldn't create your study set.",
    message: message || 'Something went wrong. Please try again.',
    action: 'Try again',
    actionType: 'retry',
  };
}

export default function NotesForm({ notes, setNotes, status, error, onGenerate, onRetry }) {
  const [showLimitHint, setShowLimitHint] = useState(false);
  const [inputError, setInputError] = useState('');
  const [hideServerError, setHideServerError] = useState(false);
  const textareaRef = useRef(null);
  const loading = status === 'loading';
  const visibleServerError = error && !hideServerError ? getErrorPresentation(error) : null;

  function focusInput() {
    textareaRef.current?.focus();
    const cursorPosition = textareaRef.current?.value.length ?? 0;
    textareaRef.current?.setSelectionRange(cursorPosition, cursorPosition);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    const validationMessage = getStudyInputError(notes);
    if (validationMessage) {
      setInputError(validationMessage);
      setHideServerError(true);
      focusInput();
      return;
    }

    setInputError('');
    setHideServerError(false);
    onGenerate(notes.trim());
  }

  function handleNotesChange(value) {
    setNotes(value);
    if (inputError) setInputError('');
    if (error) setHideServerError(true);
  }

  function handleSampleSelect(value) {
    setNotes(value);
    setInputError('');
    setHideServerError(true);
  }

  return (
    <section className="home-content">
      <div className="eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL LEARNING SPACE</div>
      <div className="hero-copy">
        <h1>Make learning<br className="mobile-break" /> <span>stick.</span></h1>
        <p>Drop in your notes. Get a study set you can actually use.</p>
      </div>

      <div className="intro-panel">
        <div className="intro-orbit orbit-one" />
        <div className="intro-orbit orbit-two" />
        <div className="intro-content">
          <div className="intro-kicker"><Sparkles size={14} /> AI STUDY STUDIO</div>
          <h2>From notes to knowledge.</h2>
          <p>Flashcards, a practice quiz and key concepts — built from your material.</p>
          <div className="intro-tags">
            <span><BookOpen size={13} /> Flashcards</span>
            <span><FileText size={13} /> Quiz</span>
            <span>✓ Concepts</span>
          </div>
        </div>
        <div className="intro-art" aria-hidden="true">
          <div className="art-sheet art-sheet-back"><span /><span /><span /></div>
          <div className="art-sheet art-sheet-front"><Sparkles size={25} /><strong>R</strong><small>LEARN</small></div>
          <span className="art-star star-a">✦</span>
          <span className="art-star star-b">✧</span>
        </div>
      </div>

      <form className="notes-card" onSubmit={handleSubmit}>
        <div className="section-heading">
          <div>
            <span className="eyebrow">START WITH YOUR MATERIAL</span>
            <h2>What are we learning today?</h2>
          </div>
          <span className="heading-icon"><FileText size={19} /></span>
        </div>

        <label className="sr-only" htmlFor="study-notes">Study material</label>
        <textarea
          ref={textareaRef}
          id="study-notes"
          value={notes}
          maxLength={MAX_CHARS}
          onChange={(event) => handleNotesChange(event.target.value)}
          onFocus={() => setShowLimitHint(true)}
          placeholder="Paste your class notes, textbook content, or type a topic you want to understand..."
          rows={6}
          disabled={loading}
          aria-invalid={Boolean(inputError)}
          aria-describedby={inputError ? 'study-input-error' : undefined}
        />
        <div className="textarea-meta">
          <span>{showLimitHint ? 'Your notes stay in this session.' : 'Use notes or describe a topic.'}</span>
          <span className={notes.length > 9000 ? 'char-count near-limit' : 'char-count'}>{notes.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}</span>
        </div>

        <div className="sample-section">
          <div className="sample-label">Need a starting point?</div>
          <div className="sample-chips">
            {samples.map((sample) => (
              <button
                type="button"
                className="sample-chip"
                key={sample.label}
                disabled={loading}
                onClick={() => handleSampleSelect(sample.value)}
              >
                {sample.label}<ArrowRight size={12} />
              </button>
            ))}
          </div>
        </div>

        {inputError && (
          <div className="error-panel" role="alert" aria-live="polite">
            <div className="error-copy">
              <strong>Let's find something to learn!</strong>
              <span id="study-input-error">
                {inputError.toLowerCase().includes('greeting')
                  ? 'This does not look like study material yet. Enter a subject or paste your notes—for example, “React hooks”, “DBMS normalization”, or “Operating system scheduling”.'
                  : inputError}
              </span>
            </div>
            <button className="text-button" type="button" onClick={focusInput}>
              Edit input
            </button>
          </div>
        )}

        {visibleServerError && (
          <div className="error-panel" role="alert" aria-live="polite">
            <div className="error-copy">
              <strong>{visibleServerError.title}</strong>
              <span>{visibleServerError.message}</span>
            </div>
            <button
              className="text-button"
              type="button"
              onClick={visibleServerError.actionType === 'edit' ? focusInput : onRetry}
              disabled={loading || (visibleServerError.actionType === 'retry' && !notes.trim())}
            >
              {visibleServerError.action}
            </button>
          </div>
        )}

        <button className="primary-button generate-button" type="submit" disabled={loading || !notes.trim()}>
          {loading ? <><span className="spinner" /> Creating your study set...</> : <><Sparkles size={17} /> Generate my study set <ArrowRight size={17} /></>}
        </button>
        <p className="privacy-note">Your study material is sent to the AI provider to generate your study set.</p>
      </form>

      <div className="home-footnote"><span className="footnote-sparkle">✳</span> Learn at your pace. Come back to what matters.</div>
    </section>
  );
}
