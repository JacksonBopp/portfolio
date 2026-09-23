import { CAT_EAR_INNER, CAT_EYE, CAT_FUR, CAT_FUR_DARK, CAT_HIGHLIGHT } from "./catPalette";

export default function WalkingCatSilhouette() {
  return (
    <svg width="94" height="60" viewBox="0 0 110 70" xmlns="http://www.w3.org/2000/svg">
      {/* tail */}
      <path d="M22 38 C6 34 4 16 14 6" stroke={CAT_FUR} strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* legs, slightly darker to read as underneath the body */}
      <rect x="24" y="48" width="6" height="16" rx="3" fill={CAT_FUR_DARK} />
      <rect x="38" y="48" width="6" height="16" rx="3" fill={CAT_FUR_DARK} />
      <rect x="64" y="48" width="6" height="16" rx="3" fill={CAT_FUR_DARK} />
      <rect x="78" y="48" width="6" height="16" rx="3" fill={CAT_FUR_DARK} />
      {/* body */}
      <ellipse cx="52" cy="40" rx="32" ry="17" fill={CAT_FUR} />
      {/* belly shading */}
      <ellipse cx="50" cy="48" rx="22" ry="8" fill={CAT_FUR_DARK} opacity="0.5" />
      {/* ears */}
      <polygon points="78,15 85,1 91,16" fill={CAT_FUR} />
      <polygon points="80,14 85,5 89,15" fill={CAT_EAR_INNER} />
      <polygon points="92,14 98,0 104,15" fill={CAT_FUR} />
      <polygon points="94,13 98,4 102,14" fill={CAT_EAR_INNER} />
      {/* head */}
      <circle cx="90" cy="26" r="15" fill={CAT_FUR} />
      {/* eye, with a highlight for life */}
      <circle cx="97" cy="25" r="3.4" fill={CAT_EYE} />
      <circle cx="96" cy="23.8" r="1" fill={CAT_HIGHLIGHT} />
      {/* nose */}
      <path d="M103 28 l2.5 1.6 -2.5 1.6 z" fill={CAT_EAR_INNER} />
    </svg>
  );
}
