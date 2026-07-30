export const profile = {
  name: "Jackson Bopp",
  initials: "JB",
  tagline: "Computer Engineering @ USF",
  subtagline: "Building from firmware to frontends",
  bio: [
    "I'm a Computer Engineering student at USF, graduating fall 2026 and open to relocate. Most of my projects live somewhere between embedded systems and web apps, with AI filling in the gaps.",
    "Right now I'm volunteering with the City of Winter Haven, helping set up server hardware and AI hosting infrastructure. Before that, most of my time has gone into hardware test tooling, hackathon builds, and figuring out how to get a microcontroller to talk to a web dashboard without anything catching fire.",
    "Outside of code: reading, gaming, cats, anime, and the occasional game of Magic the Gathering.",
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
    skills: ["Python", "TypeScript", "JavaScript", "C", "C++", "C#", "R"],
  },
  {
    label: "Frameworks & Libraries",
    skills: ["Next.js", "React", "FastAPI", "Tailwind CSS"],
  },
  {
    label: "Infrastructure & Data",
    skills: [
      "Docker",
      "PostgreSQL",
      "MongoDB",
      "SQLite",
      "MQTT",
      "Git",
      "Linux",
    ],
  },
  {
    label: "Hardware & AI",
    skills: [
      "Raspberry Pi",
      "Arduino",
      "MSP430",
      "UART/Serial",
      "IBM watsonx.ai",
      "Anthropic Claude",
    ],
  },
];
