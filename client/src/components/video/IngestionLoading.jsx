import { Loader2 } from "lucide-react";

export function IngestionLoading({ video }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-violet-500 animate-spin" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
        Fetching transcript...
      </h2>
      <p className="text-sm text-slate-400 max-w-sm">
        Extracting the transcript and preparing answers. This can take a moment for longer
        videos.
      </p>
      {video?.url && (
        <p className="text-xs text-slate-300 dark:text-slate-600 truncate max-w-sm">
          {video.url}
        </p>
      )}
    </div>
  );
}
