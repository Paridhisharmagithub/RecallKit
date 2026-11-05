import { BookOpen, ChartNoAxesColumnIncreasing, House } from 'lucide-react';

const items = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'study', label: 'Study', Icon: BookOpen },
  { id: 'progress', label: 'Progress', Icon: ChartNoAxesColumnIncreasing },
];

export default function BottomNav({ activeView, onNavigate, hasStudySet }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map(({ id, label, Icon }) => {
        const disabled = id !== 'home' && !hasStudySet;
        return (
          <button
            className={`nav-item ${activeView === id ? 'is-active' : ''}`}
            key={id}
            type="button"
            disabled={disabled}
            aria-current={activeView === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
          >
            <Icon size={20} strokeWidth={activeView === id ? 2.5 : 1.9} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
