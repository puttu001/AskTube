import { Clock } from "lucide-react";
import { useEffect } from "react";

export function HistoryList({ videos, isLoading, onRefresh, onSelect }) {
  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 flex-1 overflow-y-auto">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">History</h3>

      {isLoading && <p className="text-sm text-slate-400">Loading...</p>}

      {!isLoading && videos.length === 0 && (
        <p className="text-sm text-slate-400">No videos yet. Start a new chat to load one.</p>
      )}

      <div className="flex flex-col gap-2">
        {videos.map((v) => (
          <button
            key={v.video_id}
            onClick={() => onSelect(v)}
            className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                {v.title || v.url}
              </p>
              <p className="text-xs text-slate-400 capitalize">{v.status}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
