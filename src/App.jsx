import { useLayoutEffect, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, FileText, Layers, Moon, Plus, Sparkles, Sun } from 'lucide-react';
import Brand from './components/Brand.jsx';
import BottomNav from './components/BottomNav.jsx';
import NotesForm from './components/NotesForm.jsx';
import Flashcards from './components/Flashcards.jsx';
import Quiz from './components/Quiz.jsx';
import ConceptChecklist from './components/ConceptChecklist.jsx';
import Progress from './components/Progress.jsx';
import { useStudySet } from './hooks/useStudySet.js';

function getInitialTheme() {
  try {
    const savedTheme = window.localStorage.getItem('recallkit-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  } catch {
    // Storage can be unavailable in private browsing or restricted environments.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    try {
      window.localStorage.setItem('recallkit-theme', theme);
    } catch {
      // The theme still works for this session when storage is unavailable.
    }
  }, [theme]);
  const [notes, setNotes] = useState('');
  const [activeView, setActiveView] = useState('home');
  const [activeTab, setActiveTab] = useState('flashcards');
  const [reviewStatus, setReviewStatus] = useState({});
  const [masteredIds, setMasteredIds] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const { status, studySet, error, generate } = useStudySet();

  async function handleGenerate(value) {
    const generated = await generate(value);
    if (!generated) return;
    setReviewStatus({});
    setMasteredIds([]);
    setQuizHistory([]);
    setActiveTab('flashcards');
    setActiveView('study');
  }

  function markCard(cardId, nextStatus) {
    setReviewStatus((current) => ({ ...current, [cardId]: nextStatus }));
  }

  function toggleMastered(conceptId) {
    setMasteredIds((current) => current.includes(conceptId)
      ? current.filter((id) => id !== conceptId)
      : [...current, conceptId]);
  }

  function handleQuizComplete(result) {
    setQuizHistory((current) => [...current, result]);
  }

  function navigate(view) {
    if (view === 'study' && !studySet) return;
    if (view === 'progress' && !studySet) return;
    setActiveView(view);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand-button" type="button" onClick={() => navigate('home')} aria-label="Go to RecallKit home">
            <Brand />
          </button>
          <div className="topbar-right">
            {studySet && activeView !== 'home' && (
              <button className="new-study-button" type="button" onClick={() => setActiveView('home')}>
                <Plus size={16} /> <span>New study set</span>
              </button>
            )}
            <span className="topbar-tag"><Sparkles size={13} /> LEARN BY DOING</span>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-pressed={theme === 'dark'}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {activeView === 'home' && (
          <NotesForm
            notes={notes}
            setNotes={setNotes}
            status={status}
            error={error}
            onGenerate={handleGenerate}
            onRetry={() => handleGenerate(notes)}
          />
        )}

        {activeView === 'study' && studySet && (
          <section className="study-page">
            <button className="back-link" type="button" onClick={() => setActiveView('home')}><ArrowLeft size={15} /> New input</button>
            <div className="study-heading">
              <span className="eyebrow">YOUR STUDY SET</span>
              <h1>{studySet.title}</h1>
              <p>{studySet.summary}</p>
            </div>

            <div className="study-overview">
              <div className="overview-item"><span className="overview-icon violet"><Layers size={17} /></span><strong>{studySet.flashcards.length}</strong><span>Flashcards</span></div>
              <div className="overview-item"><span className="overview-icon green"><CheckCircle2 size={17} /></span><strong>{studySet.quiz.length}</strong><span>Quiz questions</span></div>
              <div className="overview-item"><span className="overview-icon coral"><BookOpen size={17} /></span><strong>{studySet.keyConcepts.length}</strong><span>Key concepts</span></div>
            </div>

            <div className="study-tabs" role="tablist" aria-label="Study activities">
              <button type="button" role="tab" aria-selected={activeTab === 'flashcards'} className={activeTab === 'flashcards' ? 'active' : ''} onClick={() => setActiveTab('flashcards')}><Layers size={16} /> Flashcards</button>
              <button type="button" role="tab" aria-selected={activeTab === 'quiz'} className={activeTab === 'quiz' ? 'active' : ''} onClick={() => setActiveTab('quiz')}><FileText size={16} /> Quiz</button>
              <button type="button" role="tab" aria-selected={activeTab === 'concepts'} className={activeTab === 'concepts' ? 'active' : ''} onClick={() => setActiveTab('concepts')}><BookOpen size={16} /> Concepts</button>
            </div>

            <div className={activeTab === 'flashcards' ? 'tab-pane' : 'tab-pane is-hidden'} aria-hidden={activeTab !== 'flashcards'}><Flashcards cards={studySet.flashcards} reviewStatus={reviewStatus} onMarkCard={markCard} /></div>
            <div className={activeTab === 'quiz' ? 'tab-pane' : 'tab-pane is-hidden'} aria-hidden={activeTab !== 'quiz'}><Quiz questions={studySet.quiz} onComplete={handleQuizComplete} /></div>
            <div className={activeTab === 'concepts' ? 'tab-pane' : 'tab-pane is-hidden'} aria-hidden={activeTab !== 'concepts'}><ConceptChecklist concepts={studySet.keyConcepts} masteredIds={masteredIds} onToggleMastered={toggleMastered} /></div>

            <div className="study-bottom-note"><Sparkles size={14} /> Small steps make knowledge stick.</div>
          </section>
        )}

        {activeView === 'progress' && studySet && (
          <Progress
            studySet={studySet}
            reviewStatus={reviewStatus}
            masteredIds={masteredIds}
            quizHistory={quizHistory}
            onGoToStudy={() => setActiveView('study')}
          />
        )}
      </main>

      <footer className="site-footer"><span>RecallKit</span><span>Built for curious minds.</span></footer>
      <BottomNav activeView={activeView} onNavigate={navigate} hasStudySet={Boolean(studySet)} />
    </div>
  );
}
