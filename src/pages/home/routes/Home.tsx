import { useSummarize } from "../hooks/useSummarize";
import { HeroSection } from "../components/HeroSection";
import { InputCard } from "../components/InputCard";
import { ExamplesSection } from "../components/ExamplesSection";
import { HowItWorks } from "../components/HowItWorks";
import { SummaryView } from "../components/SummaryView";
import type { Mode } from "../types";

export default function Home() {
  const {
    mode,
    setMode,
    value,
    setValue,
    result,
    loading,
    error,
    copied,
    canSubmit,
    handleSubmit,
    copySummary,
    dismiss,
    dismissError,
  } = useSummarize();

  function handleExampleSelect(example: string, exampleMode: Mode) {
    setMode(exampleMode);
    setValue(example);
  }

  return (
    <div className="noise min-h-screen">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,.25)]">
            {/* BookOpen inline so we don't import for a one-off logo usage */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
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
          href="https://github.com/supersver/BoilDocs"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
        >
          {/* GitHub icon inline */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          GitHub{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
        </a>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        {!result ? (
          <section className="mx-auto max-w-4xl">
            <HeroSection />
            <InputCard
              mode={mode}
              value={value}
              loading={loading}
              error={error}
              canSubmit={canSubmit}
              onModeChange={setMode}
              onValueChange={setValue}
              onSubmit={handleSubmit}
              onDismissError={dismissError}
            />
            <ExamplesSection onSelect={handleExampleSelect} />
            <HowItWorks />
          </section>
        ) : (
          <SummaryView
            result={result}
            copied={copied}
            onBack={dismiss}
            onCopy={copySummary}
          />
        )}
      </main>
    </div>
  );
}
