# Kawaumi

A dark, premium web app for discovering and saving anime and manga — built as a more beautiful alternative to MyAnimeList and AniList's own UI.

![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-auth%20%2B%20db-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/deployed-Vercel-black?logo=vercel)

---

## What it does

- Browse and search a large anime/manga catalog powered by the AniList GraphQL API
- Filter by genre, tags, format, status, country of origin, year, and sort order
- View detailed title pages with score, synopsis, staff, and similar titles
- Create an account and save favorites, persisted to a PostgreSQL database
- Fully responsive with glitch-style page transitions

---

## Stack

Vue 3 · Vite · Tailwind CSS v4 · Pinia · Vue Router 4 · Supabase · AniList GraphQL API

---

## Running locally

```bash
npm install
npm run dev
```

Requires a `.env` file with your Supabase project URL and anon key.

---

## Status

Core MVP is functional and deployed. Manga section is complete end-to-end. Anime section, home page, and a few remaining UI details are in progress.
