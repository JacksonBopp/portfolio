export default function WalkingCatSilhouette() {
  return (
    <svg width="94" height="60" viewBox="0 0 110 70" xmlns="http://www.w3.org/2000/svg">
      {/* tail */}
      <path d="M22 38 C6 34 4 16 14 6" stroke="var(--amber-dim)" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M22 38 C6 34 4 16 14 6" stroke="#0d0f12" strokeWidth="6.4" strokeLinecap="round" fill="none" />
      {/* legs */}
      <rect x="24" y="48" width="6" height="16" rx="3" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.6" />
      <rect x="38" y="48" width="6" height="16" rx="3" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.6" />
      <rect x="64" y="48" width="6" height="16" rx="3" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.6" />
      <rect x="78" y="48" width="6" height="16" rx="3" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.6" />
      {/* body */}
      <ellipse cx="52" cy="40" rx="32" ry="17" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.6" />
      {/* ears */}
      <polygon points="78,15 85,1 91,16" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.6" />
      <polygon points="92,14 98,0 104,15" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.6" />
      {/* head */}
      <circle cx="90" cy="26" r="15" fill="#0d0f12" stroke="var(--amber-dim)" strokeWidth="0.6" />
      {/* eye */}
      <circle cx="97" cy="25" r="3.2" fill="var(--amber)" />
    </svg>
  );
}
