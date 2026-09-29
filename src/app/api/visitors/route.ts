import { redis } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  const configured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN,
  );

  if (!configured) {
    return NextResponse.json({ configured: false });
  }

  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip =
      forwarded?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = await hashIP(ip);
    const visitorKey = `visitor:${ipHash}`;
    const hasVisited = await redis.get(visitorKey);

    if (!hasVisited) {
      await redis.incr("visitors:total");
      await redis.set(visitorKey, "true", { ex: 365 * 24 * 60 * 60 });
    }

    const totalVisitors = (await redis.get<number>("visitors:total")) ?? 0;

    return NextResponse.json({
      configured: true,
      count: totalVisitors,
      isNewVisitor: !hasVisited,
    });
  } catch {
    // Analytics should never break or clutter the portfolio when unavailable.
    return NextResponse.json({ configured: false });
  }
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
