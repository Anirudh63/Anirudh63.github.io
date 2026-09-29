// src/app/api/spotify/now-playing/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-static";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

type SpotifyTrackItem = {
  name: string;
  external_urls?: { spotify?: string };
  album?: { images?: { url: string }[] };
  artists?: { name: string }[];
};

type SpotifyNowPlaying = {
  is_playing?: boolean;
  item?: SpotifyTrackItem | null;
};

type SpotifyRecent = {
  items?: { track?: SpotifyTrackItem; played_at?: string }[];
};

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
}

function normalizeTrack(track: SpotifyTrackItem | null | undefined, isPlaying: boolean) {
  if (!track) return null;

  return {
    isPlaying,
    title: track.name,
    artist: track.artists?.map((artist) => artist.name).join(", ") ?? "Unknown artist",
    albumImageUrl: track.album?.images?.[0]?.url ?? null,
    songUrl: track.external_urls?.spotify ?? null,
  };
}

export async function GET() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const nowPlaying = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (nowPlaying.status === 200) {
    const data = (await nowPlaying.json()) as SpotifyNowPlaying;
    const track = normalizeTrack(data.item, Boolean(data.is_playing));
    if (track) return NextResponse.json({ configured: true, ...track });
  }

  const recentlyPlayed = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (recentlyPlayed.ok) {
    const data = (await recentlyPlayed.json()) as SpotifyRecent;
    const track = normalizeTrack(data.items?.[0]?.track, false);
    if (track) return NextResponse.json({ configured: true, ...track });
  }

  return NextResponse.json({ configured: true, isPlaying: false }, { status: 200 });
}
