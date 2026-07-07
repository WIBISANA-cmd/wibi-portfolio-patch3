# Wibi Portfolio

<div align="center">

### A cinematic portfolio experience powered by React, Vite, and Sanity

Live-editable content, motion-heavy sections, smooth scrolling, and a custom CMS workflow built for a modern personal brand site.

<p>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Sanity" src="https://img.shields.io/badge/Sanity-v3-F03E2F?style=for-the-badge&logo=sanity&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

</div>

---

## Overview

This project is a content-driven portfolio website for **Wibi**, designed to feel bold, minimal, and highly visual.

It combines:

- a **React + Vite** front-end for fast iteration
- **Sanity Studio** as the content operating system
- **Framer Motion** and **Lenis** for immersive motion and scroll behavior
- a structured **singleton landing page model** so the whole homepage can be managed in one place

The result is a portfolio that looks handcrafted on the front end, while staying easy to update from the CMS.

---

## Highlights

- Fully CMS-powered landing page
- Custom **singleton** `Landing Page` document in Sanity
- Animated preloader controlled from CMS
- Motion-rich hero, marquee, about, services, and projects sections
- Smooth scrolling with `lenis`
- Sanity image pipeline integration
- Seeding script for quickly bootstrapping content
- Clean local dev workflow for both frontend and studio

---

## Sections Managed In CMS

The homepage is driven by a single `landingPage` document with grouped tabs:

- `Preloader`
- `Hero`
- `Marquee`
- `About`
- `Services`
- `Projects`

Related content types:

- `service`
- `project`
- `marqueeImage`

This setup keeps editing simple while still letting structured content stay reusable.

---

## Tech Stack

### Frontend

- React 18
- Vite 5
- TypeScript
- Tailwind CSS
- Framer Motion
- Lenis

### CMS

- Sanity Studio v3
- `@sanity/client`
- `@sanity/image-url`
- Vision plugin

---

## Project Structure

```text
wibi-portfolio/
├── sanity/               # Sanity schemas + custom structure
├── scripts/              # Seed utilities
├── src/
│   ├── components/       # Shared UI pieces
│   ├── lib/              # Sanity client, queries, hooks, helpers
│   ├── sections/         # Homepage sections
│   ├── App.tsx
│   └── main.tsx
├── sanity.config.ts
├── vite.config.ts
└── .env.example
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

```bash
cp .env.example .env
```

Fill in:

```env
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-10-01

SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production

SANITY_API_TOKEN=your-write-token
```

### 3. Run the frontend

```bash
npm run dev
```

### 4. Run Sanity Studio

```bash
npm run studio
```

---

## Available Scripts

```bash
npm run dev           # Start Vite dev server
npm run build         # Type-check and build frontend
npm run preview       # Preview production build
npm run studio        # Start Sanity Studio locally
npm run studio:build  # Build Sanity Studio
npm run studio:deploy # Deploy Sanity Studio
npm run seed          # Seed structured demo content into Sanity
```

---

## Seeding Content

This repo includes a one-off seeding script that:

- creates services
- creates projects
- uploads project images
- uploads marquee assets
- uploads hero/about assets
- creates or replaces the `landingPage` singleton

Run it with:

```bash
npm run seed
```

Notes:

- it uses fixed document IDs
- it is safe to re-run
- it requires `SANITY_API_TOKEN`

---

## Sanity Workflow

### Frontend reads

The frontend fetches one main GROQ payload from the `landingPage` singleton and resolves references for:

- services
- projects
- marquee rows

### Studio authoring

Sanity Studio is configured with:

- a custom desk structure
- a fixed singleton for `Landing Page`
- limited document actions for singleton safety

This prevents accidental duplicate landing-page documents and keeps content editing focused.

---

## Local Development Notes

### If the frontend says content is not found

Make sure the `Landing Page` document exists and is published in Sanity Studio.

### If Sanity data exists but still does not load in browser

Your project may be blocking localhost via CORS.

Add your local origin in Sanity Manage:

```text
Project → API → CORS Origins
```

Common local origin:

```text
http://localhost:5173
```

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_SANITY_PROJECT_ID` | Sanity project ID exposed to frontend |
| `VITE_SANITY_DATASET` | Dataset used by frontend |
| `VITE_SANITY_API_VERSION` | Sanity API version for browser queries |
| `SANITY_STUDIO_PROJECT_ID` | Project ID used by Sanity Studio |
| `SANITY_STUDIO_DATASET` | Dataset used by Studio |
| `SANITY_API_TOKEN` | Write token used only for scripts like seeding |

---

## Design Direction

This repo leans into a modern portfolio aesthetic:

- oversized typography
- dark atmospheric background
- animated reveals
- floating visual layers
- cinematic section transitions
- editable content without losing design intent

If you want to evolve it further, the best leverage points are:

- `src/sections/*`
- `src/components/*`
- `sanity/schemas/*`
- `src/lib/sanity.queries.ts`

---

## Security Note

Never commit a real `SANITY_API_TOKEN` to the repository.

If a token has already been exposed:

1. revoke it in Sanity Manage
2. create a new token
3. update your local `.env`

---

## Deployment Idea

This setup works well for:

- Vercel
- Netlify
- any static host for the frontend
- Sanity-hosted Studio deployment for CMS

Frontend build output is generated into:

```text
dist/
```

---

## Credits

Built with a stack centered around:

- React
- Vite
- Sanity
- Framer Motion
- Tailwind CSS

---

## License

Add your preferred license here if this project will be shared publicly.

