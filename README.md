# Portfolio

Jackson Bopp's personal portfolio: a dashboard styled like a diagnostic
console instead of a typical scrolling page. Overview, skills, projects,
experience, and contact all live as sections in one console shell, with a
resume track switcher (general, embedded, software, automation) that swaps
which resume and highlighted work show up depending on what a visitor is
looking for.

**Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Motion for
animation, and Resend for the contact form.

## Structure

- `src/data/` - profile bio, skills, projects, experience, and open source
  contributions. Edit here to update copy without touching components.
- `src/components/console/` - the console shell, boot sequence, command
  palette, and each section (Overview, Skills, Projects, Experience,
  Contact).
- `src/lib/sendContactMessage.ts` - server action behind the contact form.
- `src/app/page.tsx` - entry point that renders the console shell.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To use the contact form locally, add a Resend API key to `.env.local`:

```
RESEND_API_KEY=your_key_here
```

## Deploying

Deploys to [Vercel](https://vercel.com/new) by importing the GitHub repo.
Set `RESEND_API_KEY` as an environment variable in the project settings so
the contact form works in production.
