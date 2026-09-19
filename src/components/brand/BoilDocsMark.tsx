type BoilDocsMarkProps = {
  className?: string;
  title?: string;
};

/** A compact document-and-flame mark that stays legible from 16px upward. */
export function BoilDocsMark({ className, title = "BoilDocs" }: BoilDocsMarkProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title} className={className}>
      <title>{title}</title>
      <defs>
        <linearGradient id="boildocs-fire" x1="24" y1="5" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD76A" /><stop offset="0.45" stopColor="#FF9D32" /><stop offset="1" stopColor="#F0441E" />
        </linearGradient>
        <linearGradient id="boildocs-paper" x1="14" y1="16" x2="34" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFDF5" /><stop offset="1" stopColor="#E7EBFF" />
        </linearGradient>
      </defs>
      <path d="M24.1 4.8c1.1 5-3.3 6.9-1.3 11.5.7-2.1 2.5-3.5 4.7-5.1 1.3 2.6 4.4 5.7 4.4 10.2 0 5-3.4 8.5-7.9 8.5s-7.9-3.5-7.9-8.5c0-3.7 2-6.6 5.2-9.1-.1 3.3 1 4.9 2.7 6.1-1.1-4.9.5-8.7.1-13.6Z" fill="url(#boildocs-fire)" />
      <path d="M14.5 18.5h14.2l5.8 5.8v18.2a3 3 0 0 1-3 3h-17a3 3 0 0 1-3-3v-21a3 3 0 0 1 3-3Z" fill="url(#boildocs-paper)" />
      <path d="M28.5 18.5v5.8h6" stroke="#B7C2E8" strokeWidth="2" strokeLinejoin="round" />
      <path d="M17.5 31h11M17.5 35.5h9M17.5 40h6" stroke="#69769F" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14.5 18.5h14.2l5.8 5.8" stroke="#FFFFFF" strokeOpacity="0.72" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
