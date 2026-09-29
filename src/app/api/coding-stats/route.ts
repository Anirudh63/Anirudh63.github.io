import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 1800; // Cache for 30 minutes

export async function GET() {
  const leetcodeUser = "anirudh_dhage";
  const codeforcesUser = "DestructorX";

  const fallbackData = {
    leetcode: {
      username: leetcodeUser,
      profileUrl: `https://leetcode.com/u/${leetcodeUser}/`,
      totalSolved: 695,
      totalQuestions: 3400,
      easySolved: 211,
      mediumSolved: 417,
      hardSolved: 67,
      ranking: 100006,
      streak: 25,
      totalActiveDays: 153,
      calendar: {} as Record<string, number>,
    },
    codeforces: {
      handle: codeforcesUser,
      profileUrl: `https://codeforces.com/profile/${codeforcesUser}`,
      rating: 1616,
      maxRating: 1616,
      rank: "expert",
      maxRank: "expert",
      organization: "Jiangly Fan Club",
      city: "Pune",
      country: "India",
      contribution: 8,
      calendar: {} as Record<string, number>,
    },
    combinedCalendar: {} as Record<string, number>,
  };

  try {
    const [lcRes, cfInfoRes, cfStatusRes] = await Promise.allSettled([
      fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        body: JSON.stringify({
          query: `query getUserProfileAndCalendar($username: String!) {
            matchedUser(username: $username) {
              username
              submitStats: submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
              profile {
                ranking
                reputation
                starRating
              }
              userCalendar {
                streak
                totalActiveDays
                submissionCalendar
              }
            }
          }`,
          variables: { username: leetcodeUser },
        }),
        cache: "no-store",
      }),
      fetch(`https://codeforces.com/api/user.info?handles=${codeforcesUser}`, {
        cache: "no-store",
      }),
      fetch(`https://codeforces.com/api/user.status?handle=${codeforcesUser}&from=1&count=1000`, {
        cache: "no-store",
      }),
    ]);

    let leetcodeData = fallbackData.leetcode;
    const lcCalendar: Record<string, number> = {};

    if (lcRes.status === "fulfilled" && lcRes.value.ok) {
      const json = await lcRes.value.json();
      const user = json?.data?.matchedUser;
      if (user) {
        const stats = user.submitStats?.acSubmissionNum || [];
        const easy = stats.find((s: { difficulty: string }) => s.difficulty === "Easy")?.count ?? leetcodeData.easySolved;
        const medium = stats.find((s: { difficulty: string }) => s.difficulty === "Medium")?.count ?? leetcodeData.mediumSolved;
        const hard = stats.find((s: { difficulty: string }) => s.difficulty === "Hard")?.count ?? leetcodeData.hardSolved;
        const total = stats.find((s: { difficulty: string }) => s.difficulty === "All")?.count ?? (easy + medium + hard);

        if (user.userCalendar?.submissionCalendar) {
          try {
            const rawCal: Record<string, number> = JSON.parse(user.userCalendar.submissionCalendar);
            for (const [timestampStr, count] of Object.entries(rawCal)) {
              const ts = parseInt(timestampStr, 10);
              if (!isNaN(ts)) {
                const dateKey = new Date(ts * 1000).toISOString().split("T")[0];
                lcCalendar[dateKey] = (lcCalendar[dateKey] || 0) + count;
              }
            }
          } catch {
            // ignore parsing error
          }
        }

        leetcodeData = {
          username: user.username,
          profileUrl: `https://leetcode.com/u/${user.username}/`,
          totalSolved: total,
          totalQuestions: 3400,
          easySolved: easy,
          mediumSolved: medium,
          hardSolved: hard,
          ranking: user.profile?.ranking ?? leetcodeData.ranking,
          streak: user.userCalendar?.streak ?? leetcodeData.streak,
          totalActiveDays: user.userCalendar?.totalActiveDays ?? leetcodeData.totalActiveDays,
          calendar: lcCalendar,
        };
      }
    }

    let codeforcesData = fallbackData.codeforces;
    const cfCalendar: Record<string, number> = {};

    if (cfInfoRes.status === "fulfilled" && cfInfoRes.value.ok) {
      const json = await cfInfoRes.value.json();
      if (json.status === "OK" && json.result?.length > 0) {
        const user = json.result[0];
        codeforcesData = {
          handle: user.handle,
          profileUrl: `https://codeforces.com/profile/${user.handle}`,
          rating: user.rating ?? codeforcesData.rating,
          maxRating: user.maxRating ?? codeforcesData.maxRating,
          rank: user.rank ?? codeforcesData.rank,
          maxRank: user.maxRank ?? codeforcesData.maxRank,
          organization: user.organization ?? codeforcesData.organization,
          city: user.city ?? codeforcesData.city,
          country: user.country ?? codeforcesData.country,
          contribution: user.contribution ?? codeforcesData.contribution,
          calendar: cfCalendar,
        };
      }
    }

    if (cfStatusRes.status === "fulfilled" && cfStatusRes.value.ok) {
      const statusJson = await cfStatusRes.value.json();
      if (statusJson.status === "OK" && Array.isArray(statusJson.result)) {
        for (const sub of statusJson.result) {
          if (sub.creationTimeSeconds) {
            const dateKey = new Date(sub.creationTimeSeconds * 1000).toISOString().split("T")[0];
            cfCalendar[dateKey] = (cfCalendar[dateKey] || 0) + 1;
          }
        }
        codeforcesData.calendar = cfCalendar;
      }
    }

    // Build combined calendar
    const combinedCalendar: Record<string, number> = { ...lcCalendar };
    for (const [dateKey, count] of Object.entries(cfCalendar)) {
      combinedCalendar[dateKey] = (combinedCalendar[dateKey] || 0) + count;
    }

    const response = NextResponse.json(
      {
        leetcode: leetcodeData,
        codeforces: codeforcesData,
        combinedCalendar,
      },
      { status: 200 }
    );

    response.headers.set("Cache-Control", "s-maxage=1800, stale-while-revalidate=900");
    return response;
  } catch {
    return NextResponse.json(fallbackData, { status: 200 });
  }
}
