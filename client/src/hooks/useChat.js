import { useCallback, useEffect, useState } from "react";
import { getChatHistory, streamAnswer } from "../api/chat";

export function useChat(videoId) {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!videoId) {
      setMessages([]);
      return;
    }
    getChatHistory(videoId)
      .then(setMessages)
      .catch(() => setMessages([]));
  }, [videoId]);

  const sendMessage = useCallback(
    async (question) => {
      if (!videoId) return;
      setError(null);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: "" },
      ]);
      setIsSending(true);
      try {
        for await (const chunk of streamAnswer(videoId, question)) {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            next[next.length - 1] = { ...last, content: last.content + chunk };
            return next;
          });
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsSending(false);
      }
    },
    [videoId]
  );

  return { messages, isSending, error, sendMessage };
}
