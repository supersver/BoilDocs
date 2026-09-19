import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Clipboard,
  FileText,
  Github,
  Globe2,
  LoaderCircle,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { summarize } from "./api";
import type { SummaryResult } from "./types";

const examples = [
  "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API",
  "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/",
];

type Mode = "url" | "text";

export default function App() {
  const [mode, setMode] = useState<Mode>("url");
  const [value, setValue] = useState(examples[0]);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const canSubmit = useMemo(() => {
    if (mode === "url") return /^https?:\/\//i.test(value.trim());
    return value.trim().length >= 80;
  }, [mode, value]);

  async function handleSubmit() {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError("");
    try {
      setResult(await summarize({ type: mode, value: value.trim() }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function copySummary() {
    if (!result) return;
    const text = [
      result.title,
      result.oneLiner,
      ...result.sections.flatMap((section) => [
        section.title,
        ...section.paragraphs,
        ...(section.bullets ?? []),
      ]),
    ].join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="noise min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,.25)]">
            <BookOpen className="size-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-white">
              BoilDocs
            </div>
            <div className="text-[10px] uppercase tracking-[.22em] text-zinc-500">
              developer docs, compressed
            </div>
          </div>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
        >
          <Github className="size-3.5" /> GitHub{" "}
          <ArrowUpRight className="size-3" />
        </a>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        {!result ? (
          <section className="mx-auto max-w-4xl">
            <div className="mb-12 max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.06] px-3 py-1.5 text-xs text-indigo-200">
                <Sparkles className="size-3.5" /> Built for developers who hate
                digging through docs
              </div>
              <h1 className="text-5xl font-semibold tracking-[-0.045em] text-white sm:text-6xl">
                Turn 40 pages of docs into the 4 pages you actually need.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">
                Paste a documentation URL or raw text. BoilDocs extracts the
                source, asks an LLM to structure the important parts, and gives
                you a practical implementation summary.
              </p>
            </div>

            <div className="glass overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,.38)]">
              <div className="flex border-b border-white/10 bg-white/[0.02] p-1">
                <button
                  onClick={() => setMode("url")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${mode === "url" ? "bg-white text-zinc-950" : "text-zinc-500 hover:text-zinc-200"}`}
                >
                  <Globe2 className="size-4" /> Documentation URL
                </button>
                <button
                  onClick={() => setMode("text")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${mode === "text" ? "bg-white text-zinc-950" : "text-zinc-500 hover:text-zinc-200"}`}
                >
                  <FileText className="size-4" /> Paste text
                </button>
              </div>

              <div className="p-5 sm:p-7">
                <label className="mb-3 block text-xs font-medium uppercase tracking-[.18em] text-zinc-500">
                  {mode === "url" ? "Source URL" : "Documentation text"}
                </label>
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  rows={mode === "url" ? 3 : 9}
                  placeholder={
                    mode === "url"
                      ? "https://docs.example.com/getting-started"
                      : "Paste the documentation you want to understand..."
                  }
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-700 focus:border-indigo-400/40 focus:ring-4 focus:ring-indigo-400/5"
                />
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs text-zinc-600">
                    {mode === "url"
                      ? "Public HTML docs work best in the MVP."
                      : `${value.trim().length.toLocaleString()} characters`}
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(255,255,255,.12)] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {loading ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <WandSparkles className="size-4" />
                    )}
                    {loading ? "Summarizing…" : "Summarize docs"}
                  </button>
                </div>
                {error && (
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-200">
                    <span>{error}</span>
                    <button onClick={() => setError("")}>
                      <X className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <div className="mb-3 text-[11px] uppercase tracking-[.18em] text-zinc-600">
                Try an example
              </div>
              <div className="space-y-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    onClick={() => {
                      setMode("url");
                      setValue(example);
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-left transition hover:border-white/10 hover:bg-white/[0.025]"
                  >
                    <ChevronRight className="size-3.5 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-zinc-400" />
                    <span className="truncate text-xs text-zinc-500 group-hover:text-zinc-300">
                      {example}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-16 grid gap-3 sm:grid-cols-3">
              {[
                [
                  "01",
                  "Extract",
                  "n8n fetches the source and strips navigation noise.",
                ],
                [
                  "02",
                  "Structure",
                  "The model turns raw docs into a predictable schema.",
                ],
                [
                  "03",
                  "Explain",
                  "The UI presents the result like a senior engineer’s notes.",
                ],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="rounded-xl border border-white/8 bg-white/[0.018] p-4"
                >
                  <div className="text-[10px] tracking-[.2em] text-zinc-700">
                    {number}
                  </div>
                  <div className="mt-5 text-sm font-medium text-zinc-200">
                    {title}
                  </div>
                  <p className="mt-1.5 text-xs leading-5 text-zinc-600">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <SummaryView
            result={result}
            onBack={() => setResult(null)}
            onCopy={copySummary}
            copied={copied}
          />
        )}
      </main>
    </div>
  );
}

function SummaryView({
  result,
  onBack,
  onCopy,
  copied,
}: {
  result: SummaryResult;
  onBack: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <section>
      <div className="mb-8 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-xs text-zinc-500 transition hover:text-white"
        >
          ← New summary
        </button>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Clipboard className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy summary"}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="h-fit space-y-5 lg:sticky lg:top-6">
          <div>
            <div className="text-[10px] uppercase tracking-[.2em] text-zinc-600">
              Source
            </div>
            <a
              href={result.sourceType === "url" ? result.source : undefined}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block break-words text-xs leading-5 text-zinc-400 hover:text-white"
            >
              {result.source}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Read" value={`${result.readingTime} min`} />
            <Stat label="Level" value={result.difficulty} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[.2em] text-zinc-600">
              Concepts
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.concepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-full border border-white/8 bg-white/[0.025] px-2.5 py-1 text-[11px] text-zinc-500"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <article className="max-w-3xl">
          <div className="border-b border-white/10 pb-8">
            <div className="mb-3 text-xs uppercase tracking-[.18em] text-indigo-300">
              Documentation summary
            </div>
            <h1 className="text-4xl font-semibold tracking-[-.04em] text-white sm:text-5xl">
              {result.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-400">
              {result.oneLiner}
            </p>
          </div>

          <div className="space-y-12 pt-10">
            {result.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && (
                  <div className="mt-5 space-y-2">
                    {section.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="flex gap-3 text-sm leading-6 text-zinc-400"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-zinc-600" />
                        {bullet}
                      </div>
                    ))}
                  </div>
                )}
                {section.code && (
                  <pre className="mt-5 overflow-x-auto rounded-xl border border-white/8 bg-black/30 p-4 text-xs leading-6 text-zinc-300">
                    <code>{section.code}</code>
                  </pre>
                )}
              </section>
            ))}
          </div>

          {result.quickStart && (
            <div className="mt-12 rounded-2xl border border-indigo-300/10 bg-indigo-300/[0.04] p-5">
              <div className="text-xs font-medium text-indigo-100">
                Quick mental model
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {result.quickStart}
              </p>
            </div>
          )}
          {result.caveats?.length ? (
            <div className="mt-4 text-xs text-zinc-600">
              {result.caveats.join(" · ")}
            </div>
          ) : null}
        </article>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.018] p-3">
      <div className="text-[10px] uppercase tracking-[.16em] text-zinc-700">
        {label}
      </div>
      <div className="mt-2 text-xs font-medium text-zinc-300">{value}</div>
    </div>
  );
}
