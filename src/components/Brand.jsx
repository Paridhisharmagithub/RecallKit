import { BrainCircuit } from 'lucide-react';

export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="RecallKit">
      <span className="brand-mark"><BrainCircuit size={21} strokeWidth={2.2} /></span>
      <span className="brand-word">RecallKit<span className="brand-period">.</span></span>
    </div>
  );
}
