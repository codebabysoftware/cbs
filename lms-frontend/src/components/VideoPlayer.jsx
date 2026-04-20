import { useEffect, useRef } from "react";
import API from "../api/api";

const getYouTubeId = (url) => {
  try {
    const u = new URL(url);

    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1);
    }

    return u.searchParams.get("v");
  } catch {
    return null;
  }
};

const VideoPlayer = ({ lesson, onProgress }) => {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  const videoId = getYouTubeId(lesson?.youtube_url);

  useEffect(() => {
    if (!videoId) return;

    // Load YouTube API if not loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy?.();
      }

      playerRef.current = new window.YT.Player("yt-player", {
        videoId,
        playerVars: {
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            intervalRef.current = setInterval(() => {
              const time = playerRef.current.getCurrentTime();

              onProgress?.(lesson.id, time);

              API.post("/courses/progress/save/", {
                lesson: lesson.id,
                seconds: Math.floor(time),
              }).catch(() => {});
            }, 4000);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="text-white text-center">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div id="yt-player" className="w-full h-full" />
    </div>
  );
};

export default VideoPlayer;