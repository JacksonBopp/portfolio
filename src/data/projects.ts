export type Project = {
  slug: string;
  name: string;
  role?: string;
  blurb: string;
  description: string;
  tech: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "testbench",
    name: "Testbench",
    role: "Solo project",
    blurb: "Hardware-agnostic test automation platform with AI failure analysis.",
    description:
      "Streams live telemetry from any UART-capable microcontroller through a lightweight bridge host over MQTT to a Next.js dashboard. Any chip that speaks a simple JSON-over-UART protocol drops in — STM32, ESP32, AVR, RP2040, MSP430, and more. Built against a reference MSP430FR2355 LaunchPad, with a bridge running on a Raspberry Pi Zero 2 W and a pure-software simulator so the whole pipeline runs end to end without hardware. Failed test runs get root-cause analysis from an IBM watsonx.ai model, and a built-in chat assistant answers questions about wiring, firmware, and failing steps.",
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
    slug: "radiology-second-opinion-agent",
    name: "Radiology Second-Opinion Agent",
    role: "Team project — Data & MLOps Engineer",
    blurb: "AI system that flags chest X-ray abnormalities and drafts a diagnostic report.",
    description:
      "A four-person build with a computer vision model trained to detect conditions like pneumonia and lung nodules, an agentic layer that cross-references findings against similar cases and medical literature, and an LLM that synthesizes it all into a structured report with ranked diagnoses and confidence scores. My part covered the data pipeline, model serving, and infrastructure — MLflow for experiment tracking and model registry, Chroma for retrieval, and Evidently for drift monitoring on incoming scans. The goal was never to replace a radiologist, just to be a reliable second opinion where specialist access is limited.",
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
    role: "Team project — IBM Bob Hackathon",
    blurb: "A dry-witted, voice-enabled desktop AI assistant running locally on Ollama.",
    description:
      "Built for the IBM Bob hackathon: a desktop assistant with a distinct personality, local inference through Ollama, and voice output via ElevenLabs. The concept carried forward into Testbench, where it became the dashboard's built-in troubleshooting chat, repointed at IBM watsonx.ai Granite models for hardware-specific Q&A.",
    tech: ["Python", "IBM watsonx.ai", "Ollama", "ElevenLabs"],
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
    role: "Team project — Hackabull @ USF",
    blurb: "A voice preservation tool that clones and archives a person's voice.",
    description:
      "A Hackabull entry built around ElevenLabs voice cloning, with a simple front end for recording a voice sample, storing it, and replaying synthesized speech later. The idea: give people a low-friction way to preserve a voice worth keeping.",
    tech: ["Python", "FastAPI", "ElevenLabs", "React"],
    links: [
      { label: "Source", href: "https://github.com/ntoptchi/VoiceLegacy" },
    ],
  },
  {
    slug: "earthquake-tsunami-ode-simulation",
    name: "Earthquake & Tsunami ODE Simulation",
    role: "Solo project",
    blurb: "A Python simulation of seismic dynamics, aftershocks, and tsunami propagation.",
    description:
      "Models earthquake motion as a damped harmonic oscillator inspired by elastic rebound theory, aftershock activity with an Omori-style rate equation, and tsunami wave propagation from estimated seafloor displacement. Built for conceptual modeling and visualization rather than predictive accuracy — you set the magnitude, depth, and location, and it generates time-domain and spatial plots of how the system responds.",
    tech: ["Python", "NumPy", "SciPy", "Matplotlib"],
    links: [
      {
        label: "Source",
        href: "https://github.com/JacksonBopp/earthquake-tsunami-ode-simulation",
      },
    ],
  },
];
