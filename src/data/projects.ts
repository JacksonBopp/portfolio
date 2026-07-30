export type Project = {
  slug: string;
  name: string;
  role?: string;
  blurb: string;
  summary: string;
  highlights: string[];
  tech: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "testbench",
    name: "Testbench",
    role: "Solo project",
    blurb: "Hardware-agnostic test automation platform with AI failure analysis.",
    summary:
      "Streams live telemetry from any UART-capable microcontroller to a web dashboard, with AI-powered analysis when a test run fails.",
    highlights: [
      "Streams live telemetry from an MSP430 microcontroller through a Raspberry Pi Zero 2 W over MQTT to a Next.js dashboard, updated in real time over SSE",
      "IBM watsonx.ai (Granite 3-8B) analyzes failed runs; a Gemini-powered chat assistant answers wiring and firmware questions from the same dashboard",
      "Full Docker Compose stack (PostgreSQL + Mosquitto), C firmware for the MSP430, and a Python UART-to-MQTT bridge for the Pi",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Drizzle ORM",
      "MQTT",
      "IBM watsonx.ai",
      "Raspberry Pi",
    ],
    links: [
      { label: "Live app", href: "https://testbench.up.railway.app" },
      { label: "Source", href: "https://github.com/JacksonBopp/testbench" },
    ],
  },
  {
    slug: "decision-engine",
    name: "Decision Engine",
    role: "Solo project",
    blurb: "Multi-tenant job scheduler simulator for shared compute pools.",
    summary:
      "Simulates a scheduler over a resource pool and job queue, the kind of problem behind a CI runner fleet or a shared GPU lab.",
    highlights: [
      "Priority scheduling with a fairness penalty for tenants who've already consumed more than their share",
      "Hard constraints on resource label matching and per-tenant quotas, plus deadline hit/miss tracking",
      "Pure Python standard library, zero dependencies, full test suite covering the scheduling edge cases",
    ],
    tech: ["Python"],
    links: [
      {
        label: "Source",
        href: "https://github.com/JacksonBopp/decision-engine",
      },
    ],
  },
  {
    slug: "radiology-second-opinion-agent",
    name: "Radiology Second-Opinion Agent",
    role: "Team project (Data & MLOps Engineer)",
    blurb: "AI system that flags chest X-ray abnormalities and drafts a diagnostic report.",
    summary:
      "A four-person build: a CV model flags chest X-ray abnormalities, an agentic layer cross-references similar cases, and an LLM drafts a ranked report.",
    highlights: [
      "My part covered the data pipeline, model serving, and infrastructure",
      "MLflow for experiment tracking and model registry, Chroma for retrieval, Evidently for drift monitoring on incoming scans",
      "Built as a second opinion for scenarios with limited specialist access, not a replacement for a radiologist",
    ],
    tech: [
      "Python",
      "FastAPI",
      "MLflow",
      "Chroma",
      "Evidently",
      "Claude API",
      "React",
      "Vite",
    ],
    links: [
      {
        label: "Source",
        href: "https://github.com/JacksonBopp/radiology-second-opinion-agent",
      },
    ],
  },
  {
    slug: "edward",
    name: "Edward",
    role: "Team project (IBM Bob Hackathon)",
    blurb: "A voice-enabled desktop AI assistant with a PyQt6 overlay UI.",
    summary:
      "Built for the IBM Bob hackathon: a desktop assistant with a distinct personality, a full voice pipeline, and computer control.",
    highlights: [
      "Built the PyQt6 overlay UI (sliding panel, alchemy circle animation, listening indicator) and the ElevenLabs TTS / faster-whisper STT voice pipeline",
      "Smart clipboard context enhancement and an encrypted password vault wired into the system tray",
      "PyAutoGUI-driven computer control behind a confirmation handler, plus hybrid local and cloud AI backends",
    ],
    tech: ["Python", "PyQt6", "ElevenLabs", "faster-whisper", "FastAPI"],
    links: [
      {
        label: "Source",
        href: "https://github.com/dannyjtaylor/IBM-Bob-Hackathon-Edward",
      },
    ],
  },
  {
    slug: "voicelegacy",
    name: "VoiceLegacy",
    role: "Team project (Hackabull @ USF)",
    blurb: "A voice preservation tool that clones and archives a person's voice.",
    summary:
      "A Hackabull entry built around ElevenLabs voice cloning, with a simple front end for recording, storing, and replaying a voice.",
    highlights: [
      "Led all frontend development: landing page, phrase bank layout, category filters, and tone settings",
      "Built the Speak For Me AI rewrite flow, local onboarding, and record page controls",
      "Managed PR review and merges across the team throughout the hackathon",
    ],
    tech: ["Next.js", "Tailwind CSS", "MongoDB Atlas", "ElevenLabs", "Gemini API"],
    links: [
      { label: "Source", href: "https://github.com/ntoptchi/VoiceLegacy" },
    ],
  },
  {
    slug: "earthquake-tsunami-ode-simulation",
    name: "Earthquake & Tsunami ODE Simulation",
    role: "Solo project",
    blurb: "A Python simulation of seismic dynamics, aftershocks, and tsunami propagation.",
    summary:
      "Models earthquake motion, aftershock decay, and tsunami propagation for conceptual visualization rather than predictive accuracy.",
    highlights: [
      "Earthquake motion modeled as a damped harmonic oscillator, inspired by elastic rebound theory",
      "Aftershock activity modeled with an Omori-style rate equation",
      "Tsunami wave propagation from estimated seafloor displacement, rendered as time-domain and spatial plots",
    ],
    tech: ["Python", "NumPy", "SciPy", "Matplotlib"],
    links: [
      {
        label: "Source",
        href: "https://github.com/JacksonBopp/earthquake-tsunami-ode-simulation",
      },
    ],
  },
];
