import { useCallback, useEffect, useState } from "react";
import { askQuestion, getChatHistory } from "../api/chat";

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
      setMessages((prev) => [...prev, { role: "user", content: question }]);
      setIsSending(true);
      try {
        const { answer } = await askQuestion(videoId, question);
        setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsSending(false);
      }
    },
    [videoId]
  );

  return { messages, isSending, error, sendMessage };
}
