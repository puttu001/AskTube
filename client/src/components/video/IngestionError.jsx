import { TriangleAlert } from "lucide-react";

export function IngestionError({ video, onRetry }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
        <TriangleAlert className="w-7 h-7 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
        Couldn't load this video
      </h2>
      <p className="text-sm text-slate-400 max-w-sm">
        {video?.error || "Something went wrong."}
      </p>
      <button
        onClick={onRetry}
        className="mt-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white text-sm font-semibold px-5 py-2.5"
      >
        Try another video
      </button>
    </div>
  );
}
