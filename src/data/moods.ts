// Each chapter gets its own accent hue so the book's mood shifts subtly as
// you flip through it, without breaking from the single cohesive aesthetic.
export const moods = {
  about: "#b8842a",
  skills: "#2f7d6b",
  contact: "#c1512f",
  projects: [
    "#a1522a", // Testbench — forge / copper
    "#6b4fa0", // Radiology Second-Opinion Agent — arcane violet
    "#3a5a8c", // Edward — enchanted ink blue
    "#a3435a", // VoiceLegacy — echo rose
    "#3f6e5e", // Earthquake & Tsunami ODE Simulation — elemental slate-green
  ],
} as const;
