export type Section = "overview" | "experience" | "skills" | "projects" | "contact";

export const SECTIONS: { id: Section; label: string; hint: string }[] = [
  { id: "overview", label: "Overview", hint: "01" },
  { id: "skills", label: "Skills", hint: "02" },
  { id: "projects", label: "Projects", hint: "03" },
  { id: "experience", label: "Experience", hint: "04" },
  { id: "contact", label: "Contact", hint: "05" },
];
