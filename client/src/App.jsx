import { useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { VideoLoader } from "./components/video/VideoLoader";
import { IngestionLoading } from "./components/video/IngestionLoading";
import { IngestionError } from "./components/video/IngestionError";
import { ChatView } from "./components/chat/ChatView";
import { HistoryList } from "./components/history/HistoryList";
import { useTheme } from "./hooks/useTheme";
import { useVideoIngestion } from "./hooks/useVideoIngestion";
import { useChat } from "./hooks/useChat";
import { useVideoHistory } from "./hooks/useVideoHistory";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState("new");

  const { video, isSubmitting, loadVideo, setActiveVideo, reset } = useVideoIngestion();
  const activeVideoId = video?.status === "ready" ? video.video_id : null;
  const { messages, isSending, error, sendMessage } = useChat(activeVideoId);
  const { videos, isLoading, refresh } = useVideoHistory();

  function handleNewChat() {
    reset();
    setView("new");
  }

  function handleSelectHistory(selected) {
    setActiveVideo(selected);
    setView("new");
  }

  function renderMain() {
    if (view === "history") {
      return (
        <HistoryList
          videos={videos}
          isLoading={isLoading}
          onRefresh={refresh}
          onSelect={handleSelectHistory}
        />
      );
    }

    if (!video) {
      return <VideoLoader onLoad={loadVideo} isSubmitting={isSubmitting} />;
    }

    if (video.status === "pending" || video.status === "ingesting") {
      return <IngestionLoading video={video} />;
    }

    if (video.status === "failed") {
      return <IngestionError video={video} onRetry={reset} />;
    }

    return (
      <ChatView
        video={video}
        messages={messages}
        isSending={isSending}
        error={error}
        onSend={sendMessage}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar
        view={view}
        onNewChat={handleNewChat}
        onNavigateHistory={() => setView("history")}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 min-w-0 flex flex-col gap-6 p-6 h-screen overflow-hidden">
        {renderMain()}
      </main>
    </div>
  );
}
