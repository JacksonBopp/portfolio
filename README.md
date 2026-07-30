# Portfolio

Jackson Bopp's personal portfolio, built as a flip-through book instead of a
scrolling page. Every section — about, skills, projects, contact — is a page
you turn with a click, swipe, or the arrow keys.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4,
[react-pageflip](https://github.com/Nodlik/react-pageflip) for the page-turn
mechanics, and [Motion](https://motion.dev) for the rest of the animation.

## Structure

- `src/data/` — profile bio, skills, and project content (edit here to update
  copy without touching components)
- `src/components/book/` — the `Book` wrapper around `HTMLFlipBook`, plus one
  component per page type (`CoverPage`, `TitlePage`, `AboutPage`,
  `SkillsPage`, `ProjectPage`, `ContactPage`, `BackCoverPage`)
- `src/app/page.tsx` — assembles the page components into the book and owns
  the flip-index constants that the table of contents navigates to

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying

The repo is a stock Next.js app with zero custom server config, so it
deploys to [Vercel](https://vercel.com/new) by importing the GitHub repo —
no build settings to change.
