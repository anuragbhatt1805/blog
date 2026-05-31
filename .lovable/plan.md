## Goal

Restyle the entire blog app with **Lumen Archive's** editorial aesthetic — warm paper background, serif display + mono microtype, burnt orange accent, hairline borders, masonry grid. UI/CSS only — no data, routing, or business-logic changes.

## Design language to adopt

- **Palette (light):** warm paper bg `oklch(0.975 0.008 85)`, ink fg `oklch(0.18 0.01 60)`, burnt-orange accent `oklch(0.62 0.16 38)`, hairline borders at 10% ink.
- **Palette (dark):** warm charcoal bg, cream fg, brighter burnt orange accent.
- **Typography (via `next/font/google`):**
  - Display: **Inter Tight** — extrabold uppercase brand, tight tracking.
  - Serif: **Fraunces** — large editorial headings, blog titles.
  - Mono: **JetBrains Mono** — uppercase microtype with wide tracking for labels, nav, meta, footer.
- **Components:** sticky translucent header with backdrop blur, square mono chip filters, thin underline search inputs, `rounded-[10px]` cards with hover scale + gradient overlay revealing serif title, hairline-separated 12-col footer.

## Scope — restyle ALL pages

1. **`src/app/globals.css`** — swap color tokens to the Lumen palette (light + dark), wire `--font-display` / `--font-serif` / `--font-mono`, add helper `.font-mono` / `.font-serif` classes and `animate-fade-up` keyframe.
2. **`src/app/layout.tsx`** — load Inter Tight, Fraunces, JetBrains Mono via `next/font/google`, expose as CSS variables on `<html>`, set body to display font + antialiased.
3. **`src/components/Navbar.tsx`** — sticky translucent header: extrabold uppercase brand left, mono uppercase nav links, theme toggle + auth buttons with hairline borders.
4. **`src/components/Footer.tsx`** — rebuild as Lumen 12-col editorial footer: large Fraunces brand, mono `[0.2em]`-tracked uppercase column headings, link rows with hover `↗` affordance, hairline separator + copyright row. **Navigation external links use Lumen Archive's URLs:**
   - Portfolio → `https://bhattdev.in`
   - Blogs → `https://blog.bhattdev.in`
   - Archive → `https://archive.bhattdev.in`
   - Instagram → `https://www.instagram.com/lumen_archive_posts`
   - GitHub → `https://github.com/anuragbhatt1805`
   - LinkedIn → `https://www.linkedin.com/in/anuragbhatt1805`
5. **`src/app/page.tsx`** — landing hero with serif Fraunces headline, mono kicker, burnt-orange CTA.
6. **`src/app/blogs/page.tsx` + `BlogsClient.tsx`** — Lumen gallery treatment: underline search ("SEARCH BY TITLE OR TAG…"), uppercase mono tag chips, results count, masonry `columns-2 lg:columns-3 xl:columns-4` of rounded blog cards with thumbnail + hover overlay (serif title, mono date/author).
7. **`src/app/blogs/[slug]/page.tsx` + `BlogContent.tsx` + `BlogActions.tsx`** — editorial article: mono uppercase eyebrow (date · read time · tags), oversized Fraunces title, lead subtitle, author byline row, prose with serif headings + ink body.
8. **`src/app/author/[id]/page.tsx`** — author bio with serif name, mono meta, hairline-separated post list.
9. **`src/app/(auth)/login/page.tsx` + `signup/page.tsx`** — serif heading, mono labels, hairline inputs, burnt-orange primary button.
10. **`src/app/profile/`, `settings/`, `saved/`** — apply the same palette/typography rules: serif page titles, mono section labels, hairline-bordered cards and inputs.
11. **`src/app/admin/` (layout, blogs list, new, edit, BlogEditor, EditorToolbar, DeleteBlogButton, StatusToggleButton, LinkBubble)** — same theme: ink-on-paper, mono uppercase chrome, hairline borders, burnt-orange primary action; keep editor functionality intact.

## What is NOT changing

- Data model, Supabase queries, server actions, route structure, admin editor behavior.
- Component file boundaries (only their classNames/markup are updated).
- Theme toggle behavior (still light/dark via existing `ThemeProvider`).

## Technical notes

- Tailwind v4 — tokens defined in `globals.css` via CSS variables; mirror Lumen's `oklch` palette and font-family variables.
- Fonts loaded with `next/font/google` to avoid FOUT.
- No new packages required; skip framer-motion fade-up and use CSS transitions + `group-hover` to keep dependency footprint untouched.
