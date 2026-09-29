// src/components/NowPlaying.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Music2 } from "lucide-react";

type NowPlayingPayload = {
  configured?: boolean;
  isPlaying?: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string | null;
  songUrl?: string | null;
};

export default function NowPlaying() {
  const [track, setTrack] = useState<NowPlayingPayload | null>(null);

  useEffect(() => {
    fetch("/api/spotify/now-playing", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload: NowPlayingPayload) => setTrack(payload))
      .catch(() => setTrack({ configured: false }));
  }, []);

  if (!track?.configured || !track.title) return null;

  const content = (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1.5 text-xs text-foreground/65 backdrop-blur-md transition-colors hover:border-foreground/25 hover:text-foreground">
      {track.albumImageUrl ? (
        <Image src={track.albumImageUrl} alt="" width={22} height={22} className="h-5 w-5 rounded object-cover" unoptimized />
      ) : (
        <Music2 className="h-4 w-4 text-emerald-300" />
      )}
      <span className="shrink-0 text-foreground/45">{track.isPlaying ? "Now playing" : "Last played"}</span>
      <span className="min-w-0 truncate font-medium text-foreground/85">{track.title}</span>
      <span className="hidden text-foreground/35 sm:inline">-</span>
      <span className="hidden min-w-0 truncate sm:inline">{track.artist}</span>
    </div>
  );

  if (!track.songUrl) return content;

  return (
    <a href={track.songUrl} target="_blank" rel="noopener noreferrer" className="block max-w-full">
      {content}
    </a>
  );
}
