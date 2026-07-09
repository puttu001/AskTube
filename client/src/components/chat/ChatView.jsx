import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const SUGGESTED_PROMPTS = [
  "Summarize this video",
  "What is the main theme?",
  "What are the key takeaways?",
  "List the topics covered, in order",
  "Who is this video for?",
  "Explain the main point simply",
];

export function ChatView({ video, messages, isSending, error, onSend }) {
  const [question, setQuestion] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim() || isSending) return;
    onSend(question.trim());
    setQuestion("");
  }

  function handleSuggestionClick(prompt) {
    if (isSending) return;
    onSend(prompt);
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <header className="shrink-0 px-1 pb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
          {video.title || video.url}
        </h2>
        <p className="text-xs text-slate-400">Ask anything about this video</p>
      </header>

      <section className="flex-1 min-h-0 flex flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-violet-500" />
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-white">
                Start a conversation
              </h4>
              <p className="text-sm text-slate-400 max-w-xs">
                Ask anything about the video, or try one of these:
              </p>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSuggestionClick(prompt)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 text-left hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-500/10 dark:hover:border-violet-500/50 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.length > 0 && (
            <div className="space-y-4">
              {messages.map((m, i) => {
                const isLast = i === messages.length - 1;
                const isPending = isLast && isSending && m.role === "assistant" && !m.content;
                return (
                  <MessageBubble
                    key={i}
                    role={m.role}
                    content={isPending ? "Thinking..." : m.content}
                    pending={isPending}
                  />
                );
              })}
            </div>
          )}

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 sm:gap-3 border-t border-slate-100 dark:border-slate-800 p-3 sm:p-4 shrink-0"
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about the video..."
            className="flex-1 min-w-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!question.trim() || isSending}
            className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </section>
    </div>
  );
}

function MessageBubble({ role, content, pending = false }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white whitespace-pre-wrap"
            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        } ${pending ? "animate-pulse" : ""}`}
      >
        {isUser ? (
          content
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
