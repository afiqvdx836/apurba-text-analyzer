# Text Analyzer (React + Vite)

A fast, responsive text analyzer that computes **word count**, **character count (incl/excl spaces)**, **sentence count**, **paragraph count**, **most frequent word**, **longest word**, plus an **optional sentiment** estimate. Includes **CSV export**, a sample **unit test** (Vitest), and **Docker** deployment.

## Quick Start
```bash
npm i
npm run dev
```

If you cloned an empty repo, create the app with Vite first:
```bash
npm create vite@latest . -- --template react
npm i
```

Tailwind is already configured (see `tailwind.config.js` and `postcss.config.js`).

## Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview the production build
- `npm run test` / `npm run test:watch` – Vitest unit tests

## Implementation Notes
- **Tokenization**: lowercased, punctuation removed (`/[^a-z0-9\s]/g`), split on whitespace.
- **Sentences**: split on `[.!?]+(?=\s|$)`; simple and fast. Known limitation: abbreviations may over-count.
- **Paragraphs**: blocks separated by **one or more blank lines**. This is documented to avoid ambiguity.
- **Performance**: all analysis is O(n) and memoized via `useMemo` + `useDeferredValue` for smooth typing on large inputs.
- **Most Frequent Word**: ignores pure numbers for better natural-language results; tweak if the spec requires counting numbers.
- **Responsiveness**: Tailwind utility classes; the layout collapses nicely on small screens.
- **Accessibility**: labeled textarea, clear focus/contrast.

## Optional Features
- **Sentiment**: tiny rule-based lexicon (demo only). For production, swap in AFINN or a small model.
- **Export**: CSV download of all stats.
- **Unit Testing**: `src/TextAnalyzer.test.jsx` exercises core logic (empty input, counts, paragraphs).

## Docker
```bash
docker build -t text-analyzer .
docker run -p 8080:80 text-analyzer
# Open http://localhost:8080
```

## Folder Structure
```
text-analyzer/
├─ src/
│  ├─ TextAnalyzer.jsx
│  ├─ TextAnalyzer.test.jsx
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ vitest.setup.js
├─ Dockerfile
└─ README.md
```

## Submission Tips
- Commit in **small, meaningful chunks** (init, component, tests, docker, polish).
- Add a brief **Approach** section (copy the notes above).
- Mention limitations and possible improvements (Web Worker for multi‑MB inputs, better sentence segmentation, richer sentiment).
