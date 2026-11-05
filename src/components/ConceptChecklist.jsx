import { useEffect, useState } from 'react';
import { BookOpen, Check, ChevronDown, ChevronUp, Circle } from 'lucide-react';

export default function ConceptChecklist({ concepts, masteredIds, onToggleMastered }) {
  const [expandedId, setExpandedId] = useState(concepts[0]?.id ?? null);

  useEffect(() => {
    setExpandedId(concepts[0]?.id ?? null);
  }, [concepts]);

  const masteredCount = concepts.filter((concept) => masteredIds.includes(concept.id)).length;

  return (
    <div className="activity-panel">
      <div className="activity-topline">
        <div><span className="eyebrow">YOUR CONCEPT NOTEBOOK</span><h3>Key concepts</h3></div>
        <span className="count-pill">{masteredCount}/{concepts.length} mastered</span>
      </div>
      <p className="activity-description">Explore the important ideas from your notes. Mark a concept mastered when you can explain it in your own words.</p>
      <div className="progress-track"><span style={{ width: `${(masteredCount / concepts.length) * 100}%` }} /></div>
      <div className="concept-list">
        {concepts.map((concept, index) => {
          const expanded = expandedId === concept.id;
          const mastered = masteredIds.includes(concept.id);
          return (
            <article className={`concept-card ${mastered ? 'concept-mastered' : ''}`} key={concept.id}>
              <button className="concept-trigger" type="button" onClick={() => setExpandedId(expanded ? null : concept.id)} aria-expanded={expanded}>
                <span className="concept-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="concept-title">{concept.term}</span>
                {mastered ? <Check className="concept-check" size={18} /> : <Circle className="concept-circle" size={17} />}
                {expanded ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
              </button>
              {expanded && (
                <div className="concept-details">
                  <div className="concept-detail-label"><BookOpen size={13} /> THE IDEA</div>
                  <p>{concept.description}</p>
                  <button className={`mastery-button ${mastered ? 'is-mastered' : ''}`} type="button" onClick={() => onToggleMastered(concept.id)}>
                    <Check size={15} /> {mastered ? 'Mark as still learning' : 'I understand this' }
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
