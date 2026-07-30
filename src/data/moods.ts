// Each chapter gets its own accent hue so the book's mood shifts subtly as
// you flip through it, without breaking from the single cohesive aesthetic.
export const moods = {
  about: "#b8791f",
  skills: "#1f8f6e",
  contact: "#a3223a",
  projects: [
    "#c15a1e", // Testbench: forge / copper
    "#3f5a68", // Decision Engine: cool steel
    "#7a3fc9", // Radiology Second-Opinion Agent: arcane violet
    "#2f5aa8", // Edward: enchanted ink blue
    "#c22f5c", // VoiceLegacy: echo rose
    "#1f7a5c", // Earthquake & Tsunami ODE Simulation: elemental emerald
  ],
} as const;
