/** The curved seam from the FTK mark, drawn as dashed thread. */
export function StitchArc({ className = "", animate = false }: { className?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden className={`${animate ? "stitch-draw" : ""} ${className}`}>
      <path d="M4 6 Q300 96 596 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="10 8" strokeLinecap="round" />
    </svg>
  );
}

export function Seam({ className = "" }: { className?: string }) {
  return <div role="presentation" className={`seam ${className}`} />;
}
