import { useCallback, useState } from "react";
import { listVideos } from "../api/videos";

export function useVideoHistory() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listVideos();
      setVideos(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { videos, isLoading, refresh };
}
