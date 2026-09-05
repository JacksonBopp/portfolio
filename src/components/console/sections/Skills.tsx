import clsx from "clsx";
import { skillCategories, type ResumeTrackId, type SkillTier } from "@/data/profile";

const TIER_LABEL: Record<SkillTier, string> = {
  core: "Core",
  working: "Working",
  familiar: "Familiar",
};

const TIER_ORDER: SkillTier[] = ["core", "working", "familiar"];

const TIER_STYLE: Record<SkillTier, string> = {
  core: "border-[var(--amber-dim)] text-[var(--amber)] bg-[var(--amber)]/5",
  working: "border-[var(--cyan-dim)] text-[var(--cyan)] bg-[var(--cyan)]/5",
  familiar: "border-[var(--violet-dim)] text-[var(--violet)] bg-[var(--violet)]/5",
};

export default function Skills({ mode }: { mode: ResumeTrackId }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold text-[var(--fg)]">Capability matrix</h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          Grouped by depth, not padded with a fake percentage.
          {mode !== "general" && " Highlighted tags are relevant to the selected track."}
        </p>
      </div>

      <div className="flex flex-col gap-7">
        {skillCategories.map((category) => (
          <div key={category.label}>
            <h3 className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[var(--fg-dim)]">
              {category.label}
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[...category.skills]
                .sort(
                  (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier),
                )
                .map((skill) => {
                  const relevant =
                    mode !== "general" && skill.tracks?.includes(mode);
                  return (
                    <span
                      key={skill.name}
                      title={TIER_LABEL[skill.tier]}
                      className={clsx(
                        "rounded border px-2.5 py-1 font-mono-tech text-xs transition-opacity",
                        TIER_STYLE[skill.tier],
                        mode !== "general" && !relevant && "opacity-40",
                      )}
                    >
                      {skill.name}
                    </span>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 border-t border-[var(--hairline)] pt-4 font-mono-tech text-[11px] text-[var(--fg-dim)]">
        {TIER_ORDER.map((tier) => (
          <span key={tier} className="flex items-center gap-1.5">
            <span className={clsx("h-2 w-2 rounded-sm border", TIER_STYLE[tier])} />
            {TIER_LABEL[tier]}
          </span>
        ))}
      </div>
    </div>
  );
}
