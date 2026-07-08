import { Clock, MessageCircle, Moon, Play, Sun } from "lucide-react";

export function Sidebar({ view, onNewChat, onNavigateHistory, theme, onToggleTheme }) {
  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col p-5">
      <div className="flex items-center gap-3 px-1 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center shrink-0">
          <Play className="w-5 h-5 text-white fill-white" />
        </div>
        <div className="text-left">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
            AskTube
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Chat with any YouTube video</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        <button
          onClick={onNewChat}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
            view === "new"
              ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
              : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          New Chat
        </button>
        <button
          onClick={onNavigateHistory}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
            view === "history"
              ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
              : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
          }`}
        >
          <Clock className="w-4 h-4" />
          History
        </button>
      </nav>

      <div className="mt-auto">
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 w-full"
        >
          {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
    </aside>
  );
}
