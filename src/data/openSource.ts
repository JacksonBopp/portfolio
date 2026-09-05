import type { ResumeTrackId } from "./profile";

export type OpenSourceContribution = {
  project: string;
  repoUrl: string;
  tech: string[];
  bullets: string[];
  tracks: ResumeTrackId[];
};

export const openSourceContributions: OpenSourceContribution[] = [
  {
    project: "OpenBMC, phosphor-user-manager",
    repoUrl: "https://github.com/openbmc/phosphor-user-manager",
    tech: ["C++", "D-Bus", "Linux", "Gerrit"],
    bullets: [
      "Root-caused a reported 60-of-69 test failure to a missing test-environment dependency rather than a code defect, then found and fixed two real bugs once the environment was corrected: an unhandled exception that could abort setup for every user over one bad record, and a C++ construction-order bug that let unit tests silently run against the real system instead of their mocks",
      "Verified the fix with full before-and-after test counts across both root and non-root runs",
    ],
    tracks: ["automation", "embedded", "software"],
  },
  {
    project: "Zephyr RTOS",
    repoUrl: "https://github.com/zephyrproject-rtos/zephyr",
    tech: ["C", "Devicetree", "West"],
    bullets: [
      "Found a devicetree macro bug in the MIPI DBI display driver that produced an incorrect chip-select GPIO check for out-of-range devices",
      "Proved it with a targeted compile-time check against an existing in-tree test fixture, fixed it, and added a permanent regression test so it can't silently reappear",
    ],
    tracks: ["automation", "embedded", "software"],
  },
  {
    project: "PlatformIO Core",
    repoUrl: "https://github.com/platformio/platformio-core",
    tech: ["Python", "pytest"],
    bullets: [
      "Reproduced a crash in the serial device monitor triggered by non-interactive input with a new regression test, then fixed it",
      "Confirmed the project's full lint suite (black, isort, codespell, pylint) passed clean; merged upstream",
    ],
    tracks: ["automation", "embedded", "software"],
  },
];
