import { useState } from 'react';
import { ArrowRight, BookOpen, FileText, Sparkles } from 'lucide-react';

const MAX_CHARS = 10000;
const samples = [
  { label: 'React Hooks', value: 'React Hooks let function components use state and other React features. useState adds local state. useEffect synchronizes a component with external systems and can return a cleanup function. useRef stores a mutable value that does not trigger a re-render. Hooks must be called at the top level of React components or custom hooks.' },
  { label: 'Operating Systems', value: 'A process is a program in execution with its own address space and resources. A thread is a unit of execution within a process; threads in the same process share memory. Context switching saves the state of one process or thread and restores another. CPU scheduling decides which ready process or thread gets CPU time. Deadlock occurs when processes wait indefinitely for resources held by one another.' },
  { label: 'DBMS', value: 'A database management system stores, retrieves and manages data. A primary key uniquely identifies each row. A foreign key references a key in another table. Normalization organizes tables to reduce redundancy and update anomalies. First Normal Form requires atomic values and no repeating groups. Second Normal Form requires 1NF and no partial dependency on a candidate key.' },
];

export default function NotesForm({ notes, setNotes, status, error, onGenerate, onRetry }) {
  const [showLimitHint, setShowLimitHint] = useState(false);
  const loading = status === 'loading';

  function handleSubmit(event) {
    event.preventDefault();
    if (!notes.trim() || loading) return;
    onGenerate(notes.trim());
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
          id="study-notes"
          value={notes}
          maxLength={MAX_CHARS}
          onChange={(event) => setNotes(event.target.value)}
          onFocus={() => setShowLimitHint(true)}
          placeholder="Paste your class notes, textbook content, or type a topic you want to understand..."
          rows={6}
          disabled={loading}
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
                onClick={() => setNotes(sample.value)}
              >
                {sample.label}<ArrowRight size={12} />
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="error-panel" role="alert">
            <div className="error-copy"><strong>We couldn't create your study set.</strong><span>{error}</span></div>
            <button className="text-button" type="button" onClick={onRetry} disabled={loading || !notes.trim()}>Try again</button>
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
