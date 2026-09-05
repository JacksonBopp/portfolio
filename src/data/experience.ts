export type ExperienceEntry = {
  role: string;
  org: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    role: "Smart City Student Volunteer",
    org: "City of Winter Haven Technology Services",
    location: "Winter Haven, FL",
    start: "Apr 2026",
    end: "Present",
    bullets: [
      "Installed server hardware and performed rack maintenance for city technology infrastructure",
      "Provisioned and configured YubiKey security keys for staff authentication",
      "Resolved IT support tickets and assisted with early-stage AI hosting infrastructure",
    ],
  },
  {
    role: "Manager, Shift Leader & Front-End Web Support",
    org: "Subs N' Such",
    location: "Lutz, FL",
    start: "Apr 2023",
    end: "Mar 2026",
    bullets: [
      "Built and maintained a Square-based website for online ordering",
      "Managed shift operations and enforced food safety procedures",
    ],
  },
];
