import { useMemo } from 'react';
import { AlertCircle, BookOpen, CheckCircle2, Layers, RefreshCw, Target, Trophy } from 'lucide-react';

export default function Progress({ studySet, reviewStatus, masteredIds, quizHistory, onGoToStudy }) {
  const cardsReviewed = Object.keys(reviewStatus).filter((id) => reviewStatus[id] === 'known' || reviewStatus[id] === 'review').length;
  const knownCards = Object.values(reviewStatus).filter((status) => status === 'known').length;
  const latestQuiz = quizHistory.at(-1) ?? null;
  const accuracy = latestQuiz ? Math.round((latestQuiz.correct / latestQuiz.total) * 100) : null;
  const conceptsMastered = useMemo(() => studySet.keyConcepts.filter((concept) => masteredIds.includes(concept.id)).length, [studySet, masteredIds]);
  const completion = Math.round(((knownCards + conceptsMastered) / (studySet.flashcards.length + studySet.keyConcepts.length)) * 100);
  const weakCount = latestQuiz?.incorrectIds.length ?? 0;

  return (
    <section className="progress-page">
      <div className="page-heading">
        <span className="eyebrow">A LITTLE PROGRESS ADDS UP</span>
        <h1>Your learning<br /><span>in motion.</span></h1>
        <p>Here’s what you’ve worked through in this study set.</p>
      </div>

      <div className="completion-card">
        <div className="completion-topline"><span>STUDY SET COMPLETION</span><Trophy size={19} /></div>
        <strong>{completion}%</strong>
        <div className="completion-track"><span style={{ width: `${completion}%` }} /></div>
        <p>Based on cards marked known and concepts mastered.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span className="stat-icon violet"><Layers size={18} /></span><strong>{cardsReviewed}/{studySet.flashcards.length}</strong><span>Cards reviewed</span></div>
        <div className="stat-card"><span className="stat-icon green"><Target size={18} /></span><strong>{accuracy === null ? '—' : `${accuracy}%`}</strong><span>Latest quiz accuracy</span></div>
        <div className="stat-card"><span className="stat-icon coral"><BookOpen size={18} /></span><strong>{conceptsMastered}/{studySet.keyConcepts.length}</strong><span>Concepts mastered</span></div>
        <div className="stat-card"><span className="stat-icon amber"><RefreshCw size={18} /></span><strong>{weakCount}</strong><span>Questions to revisit</span></div>
      </div>

      <div className="next-step-card">
        <div className="next-step-icon"><AlertCircle size={21} /></div>
        <div className="next-step-copy">
          <strong>Your next step</strong>
          <p>{weakCount > 0 ? `You have ${weakCount} question${weakCount === 1 ? '' : 's'} to revisit from your latest quiz.` : accuracy === null ? 'Take the quiz to see which ideas need another look.' : accuracy === 100 ? 'You got every question right in your latest quiz. Nice work.' : 'Keep reviewing your cards and key concepts to build confidence.'}</p>
        </div>
        <button className="primary-button full-button" type="button" onClick={onGoToStudy}>Back to study set <BookOpen size={16} /></button>
      </div>

      <div className="progress-note"><CheckCircle2 size={15} /> Progress is calculated from your activity in this session. It is not synced across devices.</div>
    </section>
  );
}
