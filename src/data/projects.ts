import type { ResumeTrackId } from "./profile";

export type Project = {
  slug: string;
  name: string;
  role?: string;
  blurb: string;
  summary: string;
  highlights: string[];
  tech: string[];
  links: { label: string; href: string }[];
  tracks?: ResumeTrackId[];
  status: "deployed" | "complete" | "archived";
  images?: { src: string; alt: string }[];
};

export const projects: Project[] = [
  {
    slug: "testbench",
    name: "Testbench",
    role: "Solo project",
    blurb: "Hardware-agnostic test automation platform with AI failure analysis.",
    summary:
      "Streams live telemetry from four different microcontrollers to a web dashboard, with AI-powered analysis when a test run fails and a CI pipeline that validates every board in simulation.",
    highlights: [
      "Reference firmware for the MSP430FR2355, ESP32, STM32F103C8, and RP2040 all emit the same JSON-over-UART frame format, so any of the four boards works with the same Raspberry Pi bridge, MQTT pipeline, and Next.js dashboard with real-time SSE updates",
      "IBM watsonx.ai (Granite 3-8B) analyzes failed runs; a Gemini-powered chat assistant answers wiring and firmware questions from the same dashboard",
      "A capture-and-replay tool and hardware simulator let the full test suite run without physical hardware attached, backed by a GitHub Actions workflow that spins up Postgres and Mosquitto and runs an end-to-end simulated-hardware regression test on every push",
      "Schema-validated frame parsing and a cross-platform test suite check that all four firmware builds produce frames the backend accepts",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "MQTT",
      "IBM watsonx.ai",
      "MSP430FR2355",
      "ESP32",
      "STM32F103C8",
      "RP2040",
      "GitHub Actions",
      "Docker",
    ],
    links: [
      { label: "Live app", href: "https://testbench.up.railway.app" },
      { label: "Source", href: "https://github.com/JacksonBopp/testbench" },
    ],
    tracks: ["embedded", "automation", "software"],
    status: "deployed",
  },
  {
    slug: "fpga-audio-message-recorder",
    name: "FPGA Audio Message Recorder",
    role: "Team of 3, sole implementer (university course final)",
    blurb: "An FPGA-based audio recorder and playback system with a PicoBlaze-driven UI.",
    summary:
      "A prototype audio message recorder built on an AMD/Xilinx Spartan-6 FPGA: record, play, pause, rewind, and delete voice messages through physical controls and a serial terminal menu.",
    highlights: [
      "Built the top-level Verilog FSM and PicoBlaze firmware managing record, play, pause, rewind, and a 4-message library with independent delete, controlled through physical switches and an interactive UART serial terminal menu",
      "Interfaced an SSM2603 audio CODEC over I2C for analog-to-digital and digital-to-analog conversion, with handshake signals synchronizing audio timing between the CODEC and the microcontroller",
      "Streamed recorded samples to and from DDR2 SDRAM, tracking read/write addresses so playback stops exactly at the end of each saved message and supports full rewind",
      "Iterated through several stability revisions to fix voice distortion and out-of-order message playback, adding FPGA-side volume scaling along the way",
    ],
    tech: ["Verilog", "PicoBlaze", "Xilinx Spartan-6", "DDR2 SDRAM", "I2C", "UART"],
    links: [
      {
        label: "Demo video",
        href: "https://drive.google.com/file/d/1zYOJVKrxUDxF5-GHh-Yo62WwSewjHQfq/view?usp=sharing",
      },
    ],
    tracks: ["embedded"],
    status: "complete",
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
    tracks: ["software"],
    status: "complete",
  },
  {
    slug: "radiology-second-opinion-agent",
    name: "Radiology Second-Opinion Agent",
    role: "Team project (Data & MLOps Engineer)",
    blurb: "AI system that flags chest X-ray abnormalities and drafts a diagnostic report.",
    summary:
      "A four-person build: a CV model flags chest X-ray abnormalities, an agentic layer cross-references similar cases, and an LLM drafts a ranked report.",
    highlights: [
      "Owned the model serving layer and its test coverage, including unit tests, mock-LLM tests, and endpoint validation",
      "Built Evidently-based data drift monitoring on incoming scans in production, plus an MLflow registry for experiment tracking",
      "Built as a second opinion for scenarios with limited specialist access, not a replacement for a radiologist",
    ],
    tech: ["Python", "FastAPI", "Docker Compose", "MLflow", "Evidently", "pytest"],
    links: [
      {
        label: "Source",
        href: "https://github.com/JacksonBopp/radiology-second-opinion-agent",
      },
    ],
    tracks: ["software", "automation"],
    status: "complete",
  },
  {
    slug: "wireless-motor-pwm-controller",
    name: "Wireless Motor PWM Controller",
    role: "Team project (4 members)",
    blurb: "Bare-metal firmware driving a DC motor from wireless and keypad input.",
    summary:
      "Bare-metal C firmware for the MSP430FR2355 that reads motor commands from a 4x4 keypad and an HM-10 BLE module and drives a DC motor through an L298N H-bridge.",
    highlights: [
      "Wrote an interrupt-driven UART receiver for the BLE module with a ring buffer, so wireless and keypad input run through the same command dispatcher and LCD status display",
      "Generated an 8 kHz PWM signal on Timer B2 with a kickstart pulse and duty-cycle remapping to compensate for the L298N's voltage drop and the motor's static friction",
      "Used ACLK-based timers for the HD44780 LCD (via a PCF8574 I2C backpack) and keypad scan delays to keep timing accurate across DCO frequency drift",
    ],
    tech: ["MSP430FR2355", "Bare-Metal C", "HM-10 BLE", "L298N", "I2C", "UART", "PWM"],
    links: [],
    tracks: ["embedded", "automation"],
    status: "complete",
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
    tracks: ["automation", "software"],
    status: "complete",
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
      { label: "Demo video", href: "https://www.youtube.com/watch?v=g2kL_Jy8Vno" },
    ],
    tracks: ["software"],
    status: "archived",
  },
  {
    slug: "raspberry-pi-nas",
    name: "Raspberry Pi NAS",
    role: "Solo project",
    blurb: "A multi-user network-attached storage box built on a Raspberry Pi Zero 2 W.",
    summary:
      "Configured a Raspberry Pi Zero 2 W as a multi-user NAS using Samba for cross-platform file sharing with persistent mount points and per-user permissions.",
    highlights: [
      "Configured Samba for cross-platform file sharing with persistent Linux mount points, user authentication, and file-level permission management",
      "Implemented secure multi-user access controls and configured Linux services for reliable startup across reboots",
    ],
    tech: ["Raspberry Pi", "Samba", "Linux", "Python"],
    links: [],
    tracks: ["embedded", "automation"],
    status: "complete",
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
    tracks: ["automation"],
    status: "archived",
    images: [
      { src: "/projects/earthquake-dynamics.png", alt: "Earthquake displacement, velocity, and aftershock activity over time" },
      { src: "/projects/tsunami-propagation.png", alt: "Tsunami wave height propagation over time at different distances from the epicenter" },
    ],
  },
];
