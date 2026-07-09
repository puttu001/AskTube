import { Link2, Play, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function VideoLoader({ onLoad, isSubmitting }) {
  const [url, setUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim() || isSubmitting) return;
    onLoad(url.trim());
  }

  return (
    <div className="flex-1 flex items-center justify-center overflow-y-auto py-6">
    <section className="w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 relative overflow-hidden">
      <div className="relative z-10 max-w-xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
          Chat with any{" "}
          <span className="bg-gradient-to-r from-fuchsia-500 to-violet-600 bg-clip-text text-transparent">
            YouTube
          </span>{" "}
          video
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Paste a YouTube URL below to extract the transcript and start asking questions.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 sm:pl-4"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0 px-2 sm:px-0">
            <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="flex-1 min-w-0 bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !url.trim()}
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white text-sm font-semibold px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isSubmitting ? "Loading..." : "Load Video"}
          </button>
        </form>

        <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          We only use the transcript to answer your questions.
        </p>
      </div>

      <div className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 w-56 items-center justify-center">
        <div className="absolute w-56 h-56 rounded-full bg-violet-100 dark:bg-violet-500/10" />
        <div className="relative w-44 rotate-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 p-3">
          <div className="rounded-xl bg-gradient-to-br from-violet-300 to-fuchsia-300 dark:from-violet-700 dark:to-fuchsia-700 h-24 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div className="h-full w-1/3 bg-violet-500 rounded-full" />
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 w-full" />
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 w-2/3" />
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
