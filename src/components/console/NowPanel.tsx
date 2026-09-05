import { profile } from "@/data/profile";

type NowItem = { name: string; href?: string };

function NowList({ items }: { items: readonly NowItem[] }) {
  return (
    <ul className="mt-1.5 flex flex-col gap-1">
      {items.map((item) => (
        <li key={item.name} className="text-sm text-[var(--fg)]">
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--cyan)] hover:underline"
            >
              {item.name}
            </a>
          ) : (
            item.name
          )}
        </li>
      ))}
    </ul>
  );
}

export default function NowPanel() {
  return (
    <div className="hairline rounded p-4">
      <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-[var(--fg-dim)]">
        Now
      </span>
      <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <span className="font-mono-tech text-[10px] uppercase tracking-[0.15em] text-[var(--amber)]">
            Playing
          </span>
          <NowList items={profile.now.playing} />
        </div>
        <div>
          <span className="font-mono-tech text-[10px] uppercase tracking-[0.15em] text-[var(--amber)]">
            Watching
          </span>
          <NowList items={profile.now.watching} />
        </div>
        <div>
          <span className="font-mono-tech text-[10px] uppercase tracking-[0.15em] text-[var(--amber)]">
            Reading
          </span>
          <NowList items={profile.now.reading} />
        </div>
      </div>
    </div>
  );
}
