export const profile = {
  name: "Jackson Bopp",
  initials: "JB",
  tagline: "Computer Engineering @ USF",
  subtagline: "Building from firmware to frontends",
  intro:
    "Computer Engineering student at USF. Most of my projects live somewhere between embedded systems and web apps, with AI filling in the gaps.",
  bio: [
    "Right now I'm volunteering with the City of Winter Haven, helping set up server hardware and AI hosting infrastructure. Before that, most of my time went into hardware test tooling, hackathon builds, and getting a microcontroller to talk to a web dashboard without anything catching fire.",
    "Outside of code: reading, gaming, cats, anime, and the occasional game of Magic the Gathering.",
  ],
  facts: [
    { label: "Location", value: "Tampa, FL (open to relocate)" },
    { label: "Graduating", value: "Fall 2026" },
    { label: "Education", value: "B.S. Computer Engineering, USF (GPA 3.52, Dean's List)" },
    { label: "Certifications", value: "Certified SOLIDWORKS Associate (CSWA)" },
    { label: "Currently", value: "Smart City Student Volunteer, City of Winter Haven" },
  ],
  location: "Tampa, FL (open to relocate)",
  graduation: "Graduating Fall 2026",
  links: {
    email: "boppjackson@gmail.com",
    github: "https://github.com/JacksonBopp",
    linkedin: "https://linkedin.com/in/jbopp",
    instagram: "https://instagram.com/JacksonBopp",
  },
} as const;

export type SkillCategory = {
  label: string;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    label: "Languages",
    skills: [
      "Python",
      "TypeScript",
      "JavaScript",
      "C",
      "C++",
      "C#",
      "MATLAB",
      "R",
      "Verilog/VHDL",
      "RISC-V Assembly",
    ],
  },
  {
    label: "AI / LLM Tools",
    skills: [
      "Anthropic Claude API",
      "Google Gemini API",
      "IBM watsonx.ai",
      "ElevenLabs",
      "Ollama",
    ],
  },
  {
    label: "Frameworks & Libraries",
    skills: ["Next.js", "React", "FastAPI", "PyQt6", "Tailwind CSS"],
  },
  {
    label: "Infrastructure & Data",
    skills: [
      "Docker",
      "MQTT",
      "PostgreSQL",
      "MongoDB",
      "SQLite",
      "Git",
      "Linux",
    ],
  },
  {
    label: "Hardware",
    skills: ["Raspberry Pi", "Arduino", "FPGA", "MSP430", "UART/Serial"],
  },
];
