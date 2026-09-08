export const profile = {
  name: "Jackson Bopp",
  initials: "JB",
  tagline: "Computer Engineering @ USF",
  subtagline: "Building from firmware to frontends",
  intro:
    "Computer Engineering student at USF. Most of my projects live somewhere between embedded systems and web apps, with AI filling in the gaps.",
  bio: [
    "Computer Engineering student splitting time between embedded systems, full‑stack web apps, and AI‑assisted tooling. Most of my projects live somewhere in between.",
    "Outside of code: reading, gaming, cats, anime, and the occasional game of Magic the Gathering.",
  ],
  facts: [
    { label: "Location", value: "Tampa, FL (open to relocate)" },
    { label: "Graduating", value: "Fall 2026" },
    {
      label: "Education",
      value: "B.S. Computer Engineering, University of South Florida (GPA 3.52/4.00, Dean's List)",
    },
    {
      label: "Coursework",
      value:
        "Embedded Systems, Computer Architecture, CMOS-VLSI Design, FPGA Design, Operating Systems, Computer System Design, Trustworthy Infrastructures",
    },
    {
      label: "Certifications",
      value: "Certified SOLIDWORKS Associate (CSWA), CSWA Additive Manufacturing",
    },
    {
      label: "Currently",
      value: "Final semester at USF, Smart City Student Volunteer at City of Winter Haven",
    },
  ],
  involvement: [
    { name: "SHPE", href: "https://shpe.org" },
    { name: "SASE", href: "https://www.saseconnect.org" },
    { name: "IEEE", href: "https://www.ieee.org" },
  ],
  now: {
    playing: [
      {
        name: "League of Legends",
        href: "https://op.gg/lol/summoners/na/jackson-cat?queue_type=SOLORANKED",
        icon: "moba",
      },
      { name: "Risk of Rain 2", icon: "storm" },
      { name: "Terraria", icon: "pickaxe" },
    ],
    watching: [
      { name: "Sonny Boy", icon: "drift" },
      { name: "Ergo Proxy", icon: "circuitEye" },
      { name: "Saiki K", icon: "psychicSwirl" },
    ],
    reading: [
      { name: "Lord of Mysteries 2: Circle of Inevitability (Ch. 16)", icon: "occultEye" },
    ],
  },
  location: "Tampa, FL (open to relocate)",
  graduation: "Graduating Fall 2026",
  links: {
    email: "boppjackson@gmail.com",
    github: "https://github.com/JacksonBopp",
    linkedin: "https://linkedin.com/in/jbopp",
    instagram: "https://instagram.com/JacksonBopp",
    spotify:
      "https://open.spotify.com/user/rk1f7pvy3ilo1t3rv56grv4pb?si=b822a2db7a164569",
  },
  githubUsername: "JacksonBopp",
} as const;

export type ResumeTrackId = "automation" | "embedded" | "software" | "general";

export type ResumeTrack = {
  id: ResumeTrackId;
  label: string;
  file: string;
  blurb: string;
};

export const resumeTracks: ResumeTrack[] = [
  {
    id: "general",
    label: "General",
    file: "/jackson-bopp-resume.pdf",
    blurb: "A broad view across embedded, software, and AI-adjacent work.",
  },
  {
    id: "embedded",
    label: "Embedded",
    file: "/resumes/embedded.pdf",
    blurb: "Firmware, microcontrollers, and hardware/software integration.",
  },
  {
    id: "software",
    label: "Software",
    file: "/resumes/software.pdf",
    blurb: "Full-stack web, APIs, and application-layer engineering.",
  },
  {
    id: "automation",
    label: "Automation",
    file: "/resumes/automation.pdf",
    blurb: "Test tooling, hardware-in-the-loop pipelines, and process automation.",
  },
];

export type SkillTier = "core" | "working" | "familiar";

export type Skill = {
  name: string;
  tier: SkillTier;
  tracks?: ResumeTrackId[];
};

export type SkillCategory = {
  label: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    label: "Languages",
    skills: [
      { name: "Python", tier: "core", tracks: ["automation", "software", "embedded"] },
      { name: "TypeScript", tier: "core", tracks: ["software"] },
      { name: "JavaScript", tier: "core", tracks: ["software"] },
      { name: "C", tier: "core", tracks: ["embedded"] },
      { name: "C++", tier: "core", tracks: ["embedded"] },
      { name: "C#", tier: "working", tracks: ["software"] },
      { name: "MATLAB", tier: "working", tracks: ["automation"] },
      { name: "R", tier: "familiar" },
      { name: "Verilog/VHDL", tier: "working", tracks: ["embedded"] },
      { name: "SystemVerilog", tier: "working", tracks: ["embedded", "automation"] },
      { name: "RISC-V Assembly", tier: "familiar", tracks: ["embedded"] },
    ],
  },
  {
    label: "AI / LLM Tools",
    skills: [
      { name: "Anthropic Claude API", tier: "core", tracks: ["software"] },
      { name: "Google Gemini API", tier: "working", tracks: ["software"] },
      { name: "IBM watsonx.ai", tier: "working", tracks: ["software", "automation"] },
      { name: "ElevenLabs", tier: "working", tracks: ["software"] },
      { name: "Ollama", tier: "familiar" },
    ],
  },
  {
    label: "Frameworks & Libraries",
    skills: [
      { name: "Next.js", tier: "core", tracks: ["software"] },
      { name: "React", tier: "core", tracks: ["software"] },
      { name: "FastAPI", tier: "core", tracks: ["software", "automation"] },
      { name: "PyQt6", tier: "working", tracks: ["software"] },
      { name: "Tailwind CSS", tier: "core", tracks: ["software"] },
    ],
  },
  {
    label: "Infrastructure & Data",
    skills: [
      { name: "Docker", tier: "core", tracks: ["software", "automation"] },
      { name: "MQTT", tier: "core", tracks: ["automation", "embedded"] },
      { name: "PostgreSQL", tier: "working", tracks: ["software"] },
      { name: "MongoDB", tier: "working", tracks: ["software"] },
      { name: "SQLite", tier: "working" },
      { name: "Git", tier: "core" },
      { name: "Linux", tier: "core" },
    ],
  },
  {
    label: "Hardware",
    skills: [
      { name: "Raspberry Pi", tier: "core", tracks: ["embedded", "automation"] },
      { name: "Arduino", tier: "working", tracks: ["embedded"] },
      { name: "FPGA", tier: "working", tracks: ["embedded"] },
      { name: "MSP430", tier: "core", tracks: ["embedded", "automation"] },
      { name: "UART/Serial", tier: "core", tracks: ["embedded", "automation"] },
      { name: "cocotb", tier: "working", tracks: ["embedded", "automation"] },
      { name: "Verilator", tier: "working", tracks: ["embedded", "automation"] },
    ],
  },
];
