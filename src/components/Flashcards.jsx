import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, RotateCcw, Shuffle, Sparkles } from 'lucide-react';

function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Flashcards({ cards, reviewStatus, onMarkCard }) {
  const [deck, setDeck] = useState(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setDeck(cards);
    setIndex(0);
    setFlipped(false);
  }, [cards]);

  const card = deck[index];
  const knownCount = useMemo(() => cards.filter((item) => reviewStatus[item.id] === 'known').length, [cards, reviewStatus]);
  const status = card ? reviewStatus[card.id] : undefined;

  if (!card) return <div className="empty-inline">No flashcards are available.</div>;

  function goTo(nextIndex) {
    setIndex(nextIndex);
    setFlipped(false);
  }

  function shuffleDeck() {
    setDeck(shuffled(cards));
    goTo(0);
  }

  return (
    <div className="activity-panel">
      <div className="activity-topline">
        <div><span className="eyebrow">ACTIVE RECALL</span><h3>Flashcards</h3></div>
        <span className="count-pill">{index + 1} <span>/</span> {deck.length}</span>
      </div>
      <div className="progress-track"><span style={{ width: `${((index + 1) / deck.length) * 100}%` }} /></div>
      <div className="flashcard-area">
        <button
          type="button"
          className={`flashcard ${flipped ? 'is-flipped' : ''}`}
          onClick={() => setFlipped((value) => !value)}
          aria-label={flipped ? 'Show question' : 'Reveal answer'}
        >
          <span className="flashcard-topline">
            <span className={`flashcard-label ${flipped ? 'answer-label' : ''}`}>{flipped ? 'ANSWER' : 'QUESTION'}</span>
            <RotateCcw size={17} />
          </span>
          <span className="flashcard-text">{flipped ? card.back : card.front}</span>
          <span className="flashcard-hint">Tap to {flipped ? 'see the question' : 'reveal the answer'}</span>
          <span className="flashcard-brand">RECALLKIT <Sparkles size={13} /></span>
        </button>
      </div>
      <div className="card-navigation">
        <button className="secondary-button" type="button" onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0}><ChevronLeft size={16} /> Previous</button>
        <button className="secondary-button" type="button" onClick={() => goTo(Math.min(deck.length - 1, index + 1))} disabled={index === deck.length - 1}>Next <ChevronRight size={16} /></button>
      </div>
      <div className="card-actions">
        <button className={`review-button ${status === 'review' ? 'selected-review' : ''}`} type="button" onClick={() => onMarkCard(card.id, 'review')}><RotateCcw size={16} /> Review again</button>
        <button className={`known-button ${status === 'known' ? 'selected-known' : ''}`} type="button" onClick={() => onMarkCard(card.id, 'known')}><Check size={16} /> {status === 'known' ? 'Marked known' : 'Got it'}</button>
      </div>
      <div className="activity-footer">
        <span>{knownCount} of {cards.length} marked as known</span>
        <button className="text-button" type="button" onClick={shuffleDeck}><Shuffle size={14} /> Shuffle deck</button>
      </div>
    </div>
  );
}
