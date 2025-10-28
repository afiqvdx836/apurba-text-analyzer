
import React, {useMemo, useState, useDeferredValue} from "react";

/**
 * Text Analyzer – Single‑file React component
 * - Robust tokenization (case-insensitive, punctuation ignored)
 * - Fast: analysis runs in useMemo against a deferred value for large text
 * - Responsive UI with Tailwind classes
 * - Optional: simple rule-based sentiment, CSV export, example loader, clear
 */

const POSITIVE = new Set([
  "good","great","excellent","amazing","awesome","positive","fast","efficient","valuable","powerful","smooth","love","like","happy","easy","useful","stable","reliable"
]);
const NEGATIVE = new Set([
  "bad","poor","terrible","awful","slow","negative","bug","bugs","issue","issues","problem","problems","hate","hard","difficult","unstable","crash","crashes"
]);

function normalizeWhitespace(s){
  return s.replace(/\r\n?/g, "\n");
}

function tokenizeWords(raw){
  const cleaned = raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  if (!cleaned.trim()) return [];
  return cleaned.trim().split(/\s+/);
}

function splitSentences(raw){
  const parts = raw
    .replace(/\n+/g, " \n ")
    .split(/[.!?]+(?=\s|$)/)
    .map(s => s.trim())
    .filter(Boolean);
  return parts;
}

function countParagraphs(raw){
  const s = normalizeWhitespace(raw).trim();
  if (!s) return 0;
  const parts = s.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean);
  return parts.length;
}

function mostFrequentWord(words){
  if (!words.length) return null;
  const freq = new Map();
  for (const w of words){
    if (/^\d+$/.test(w)) continue;
    freq.set(w, (freq.get(w) || 0) + 1);
  }
  let best = null, bestN = 0;
  for (const [w,n] of freq){
    if (n > bestN || (n === bestN && w < best)){
      best = w; bestN = n;
    }
  }
  return best ? {word: best, count: bestN} : null;
}

function longestWord(words){
  if (!words.length) return null;
  let best = "";
  for (const w of words){
    if (w.length > best.length) best = w;
  }
  return best || null;
}

function sentimentScore(words){
  if (!words.length) return {label: "neutral", score: 0};
  let score = 0;
  for (const w of words){
    if (POSITIVE.has(w)) score += 1;
    if (NEGATIVE.has(w)) score -= 1;
  }
  const label = score > 1 ? "positive" : score < -1 ? "negative" : "neutral";
  return {label, score};
}

export function analyze(raw){
  const text = normalizeWhitespace(raw ?? "");
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, "").length;
  const words = tokenizeWords(text);
  const wordCount = words.length;
  const sentences = splitSentences(text);
  const sentenceCount = sentences.length;
  const paragraphCount = countParagraphs(text);
  const mf = mostFrequentWord(words);
  const lw = longestWord(words);
  const sent = sentimentScore(words);
  return {
    wordCount, charCount, charNoSpaces, sentenceCount, paragraphCount,
    mostFrequentWord: mf?.word ?? "—",
    mostFrequentWordCount: mf?.count ?? 0,
    longestWord: lw ?? "—",
    sentiment: sent.label,
    sentimentScore: sent.score
  };
}

function toCsv(stats){
  const headers = [
    "Word Count","Character Count (incl spaces)","Character Count (no spaces)",
    "Sentence Count","Paragraph Count","Most Frequent Word","Most Frequent Word Count",
    "Longest Word","Sentiment","Sentiment Score"
  ];
  const row = [
    stats.wordCount, stats.charCount, stats.charNoSpaces, stats.sentenceCount,
    stats.paragraphCount, stats.mostFrequentWord, stats.mostFrequentWordCount,
    stats.longestWord, stats.sentiment, stats.sentimentScore
  ];
  return headers.join(',') + "\n" + row.map(v => String(v).includes(',')?`"${String(v).replaceAll('"','""')}"`:v).join(',') + "\n";
}

const EXAMPLE = `React.js is a popular JavaScript library for building user interfaces, especially single-page
applications where the main objective is to provide a fast and interactive user experience.
Developed and maintained by Facebook, React allows developers to create large web
applications that can update and render efficiently in response to data changes.
One of the key features of React is its component-based architecture. Components are
independent, reusable pieces of UI that can be nested, managed, and handled separately. This
approach promotes modularity and enhances code maintainability, making it easier to develop
and scale applications.
React's virtual DOM is another powerful feature that optimizes performance. The virtual DOM is
a lightweight copy of the actual DOM, allowing React to determine the most efficient way to
update the user interface. Instead of updating the entire page, React only updates the parts of
the DOM that have changed, resulting in faster and smoother user experiences.
As the demand for dynamic web applications continues to grow, learning and mastering
React.js is becoming increasingly valuable for front-end developers. The ecosystem around
React is also vast, with tools, libraries, and frameworks like Redux, Next.js, and Gatsby further
enhancing its capabilities.`;

export default function TextAnalyzer(){
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);
  const stats = useMemo(() => analyze(deferredText), [deferredText]);

  const handleExportCsv = () => {
    const csv = toCsv(stats);
    const blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'text-analysis.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const onLoadExample = () => setText(EXAMPLE);
  const onClear = () => setText("");

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Text Analyzer</h1>
          <div className="flex gap-2">
            <button onClick={onLoadExample} className="px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:translate-y-px">Load Example</button>
            <button onClick={onClear} className="px-3 py-2 rounded-xl bg-gray-200 hover:bg-gray-300">Clear</button>
            <button onClick={handleExportCsv} className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Export CSV</button>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-2xl p-4 sm:p-6">
            <label htmlFor="input" className="block text-sm font-medium mb-2">Paste or type text</label>
            <textarea
              id="input"
              value={text}
              onChange={(e)=>setText(e.target.value)}
              placeholder="Paste text here…"
              className="w-full h-72 sm:h-80 md:h-96 leading-6 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
            />
            <p className="mt-2 text-xs text-gray-500">Punctuation is ignored. Case is normalized.</p>
          </div>

          <div className="bg-white shadow-sm rounded-2xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Analysis</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat label="Words" value={stats.wordCount} />
              <Stat label="Characters" value={stats.charCount} />
              <Stat label="Chars (no spaces)" value={stats.charNoSpaces} />
              <Stat label="Sentences" value={stats.sentenceCount} />
              <Stat label="Paragraphs" value={stats.paragraphCount} />
              <Stat label="Sentiment" value={`${stats.sentiment} (${stats.sentimentScore})`} />
            </ul>
            <div className="mt-4 grid gap-3">
              <Detail label="Most frequent word" value={stats.mostFrequentWord === '—' ? '—' : `${stats.mostFrequentWord} (${stats.mostFrequentWordCount}×)`} />
              <Detail label="Longest word" value={stats.longestWord} />
            </div>
          </div>
        </section>

        <footer className="mt-8 text-xs text-gray-500 leading-6">
          <p>
            Notes: Sentiment is a naive rule-based score for demo purposes. For production, consider a proper
            lexicon (e.g., AFINN) or a tiny ML model. All counts recompute from a deferred input value for smooth typing.
          </p>
        </footer>
      </div>
    </div>
  );
}

function Stat({label, value}){
  return (
    <li className="rounded-xl border border-gray-200 p-3 sm:p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-xl font-semibold mt-1 break-all">{value}</div>
    </li>
  );
}

function Detail({label, value}){
  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-base font-medium mt-1 break-all">{value}</div>
    </div>
  );
}
