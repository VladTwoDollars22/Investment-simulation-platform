<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Starcup Platform — AI Agent Development Guidelines

## 1. Core Architecture & Rules (NO HARDCODING)
* **Strict Separation of Content and Code:** Absolutely NO hardcoded text, labels, questions, startup descriptions, or UI copy directly inside React components (`.tsx` / `.jsx`). 
* **JSON-Driven Data:** All static content, game datasets (e.g., historical startups, pitch cards, descriptions), and navigation labels must be stored externally in structured JSON files (e.g., inside `src/data/` or `locales/`).
* **Modular Components:** Build reusable, clean, and atomic UI components following the project's glassmorphism style guide.

## 2. Localization & Multi-Language Support (i18n)
* The platform must support **three languages** with equal priority:
  1. **English (`en`)** — Default
  2. **Lithuanian (`lt`)** — Local ecosystem standard (MRU university context)
  3. **Russian (`ru`)**
* All localizable UI strings and content must be managed via translation dictionary JSON files (e.g., `locales/en.json`, `locales/lt.json`, `locales/ru.json`) or dynamic JSON translation loaders. Never embed raw text strings in components.

## 3. Tech Stack & Design Standards
* **Framework:** Next.js (App Router) with TypeScript.
* **Styling:** Tailwind CSS.
* **Design System (Glassmorphism):**
  * Frosted glass surfaces: `bg-white/75 backdrop-blur-md border border-white/40`.
  * Primary Brand Colors: Deep Indigo (`#1E1B4B`) for text/headers, Vibrant Violet/Purple Gradients (`#6366F1` to `#7C3AED`) for buttons and accents, Soft Light Backgrounds (`#F8FAFC`).
  * Typography: Clean, modern sans-serif fonts (Inter / Plus Jakarta Sans).

## 4. Mini-Games Implementation Requirements
* **Game 1 (Investment Simulator):** 
  * Data for the 5 historical startups must be fetched dynamically from a JSON configuration file.
  * Virtual budget ($10,000) state management and 5-year simulation outcome calculations must be modular and clean.
* **Game 2 (Founder Tinder / Pitch Voting):**
  * Startup business cards submitted by users or pre-configured must load from a centralized data source or API state.
  * Swipe/voting logic and final analytics summary must be cleanly separated into dedicated helper functions or custom hooks.

## 5. Git & Workflow Guidelines
* Write clean, modular, and well-commented code.
* Ensure all files adhere to the project's folder structure.
* Make descriptive commits (e.g., `feat(i18n): add Lithuanian translation JSON files` or `refactor: extract startup data into external JSON`).