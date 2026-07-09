'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { X } from 'lucide-react';

type VideoState = {
  src: string;
  title: string;
  poster?: string;
} | null;

const VideoContext = createContext<{
  openVideo: (src: string, title: string, poster?: string) => void;
  closeVideo: () => void;
} | null>(null);

export function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error('useVideo must be used within VideoProvider');
  return ctx;
}

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [video, setVideo] = useState<VideoState>(null);

  const openVideo = useCallback((src: string, title: string, poster?: string) => {
    setVideo({ src, title, poster });
    document.body.style.overflow = 'hidden';
  }, []);

  const closeVideo = useCallback(() => {
    setVideo(null);
    document.body.style.overflow = '';
  }, []);

  return (
    <VideoContext.Provider value={{ openVideo, closeVideo }}>
      {children}
      {video && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeVideo}
          role="dialog"
          aria-modal
          aria-label={video.title}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeVideo}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="mb-3 text-sm font-medium text-white/70">{video.title}</p>
            <video
              key={video.src}
              src={video.src}
              poster={video.poster}
              controls
              autoPlay
              playsInline
              className="w-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </VideoContext.Provider>
  );
}
