const fs = require("fs");
const path = require("path");

const leetcodeUser = "anirudh_dhage";
const codeforcesUser = "DestructorX";

async function fetchStats() {
  const fallback = {
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
      calendar: {},
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
      calendar: {},
    },
    combinedCalendar: {},
  };

  let stats = { ...fallback };

  const existingPath = path.join(__dirname, "../src/data/coding-stats.json");
  if (fs.existsSync(existingPath)) {
    try {
      stats = JSON.parse(fs.readFileSync(existingPath, "utf8"));
    } catch {
      // ignore
    }
  }

  // 1. Fetch LeetCode
  try {
    const lcRes = await fetch("https://leetcode.com/graphql", {
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
    });

    if (lcRes.ok) {
      const json = await lcRes.json();
      const user = json?.data?.matchedUser;
      if (user) {
        const acStats = user.submitStats?.acSubmissionNum || [];
        const easy = acStats.find((s) => s.difficulty === "Easy")?.count ?? stats.leetcode.easySolved;
        const medium = acStats.find((s) => s.difficulty === "Medium")?.count ?? stats.leetcode.mediumSolved;
        const hard = acStats.find((s) => s.difficulty === "Hard")?.count ?? stats.leetcode.hardSolved;
        const total = acStats.find((s) => s.difficulty === "All")?.count ?? (easy + medium + hard);

        const lcCalendar = {};
        if (user.userCalendar?.submissionCalendar) {
          try {
            const rawCal = JSON.parse(user.userCalendar.submissionCalendar);
            for (const [timestampStr, count] of Object.entries(rawCal)) {
              const ts = parseInt(timestampStr, 10);
              if (!isNaN(ts)) {
                const dateKey = new Date(ts * 1000).toISOString().split("T")[0];
                lcCalendar[dateKey] = (lcCalendar[dateKey] || 0) + count;
              }
            }
          } catch (err) {
            console.warn("Error parsing LeetCode calendar:", err);
          }
        }

        stats.leetcode = {
          username: user.username,
          profileUrl: `https://leetcode.com/u/${user.username}/`,
          totalSolved: total,
          totalQuestions: 3400,
          easySolved: easy,
          mediumSolved: medium,
          hardSolved: hard,
          ranking: user.profile?.ranking ?? stats.leetcode.ranking,
          streak: user.userCalendar?.streak ?? stats.leetcode.streak,
          totalActiveDays: user.userCalendar?.totalActiveDays ?? stats.leetcode.totalActiveDays,
          calendar: lcCalendar,
        };
        console.log(`Fetched LeetCode stats: ${total} solved, ${Object.keys(lcCalendar).length} active days.`);
      }
    }
  } catch (err) {
    console.warn("Failed to fetch LeetCode:", err.message);
  }

  // 2. Fetch Codeforces Info
  try {
    const cfInfoRes = await fetch(`https://codeforces.com/api/user.info?handles=${codeforcesUser}`);
    if (cfInfoRes.ok) {
      const json = await cfInfoRes.json();
      if (json.status === "OK" && json.result?.length > 0) {
        const u = json.result[0];
        stats.codeforces = {
          ...stats.codeforces,
          handle: u.handle,
          profileUrl: `https://codeforces.com/profile/${u.handle}`,
          rating: u.rating ?? stats.codeforces.rating,
          maxRating: u.maxRating ?? stats.codeforces.maxRating,
          rank: u.rank ?? stats.codeforces.rank,
          maxRank: u.maxRank ?? stats.codeforces.maxRank,
          organization: u.organization ?? stats.codeforces.organization,
          city: u.city ?? stats.codeforces.city,
          country: u.country ?? stats.codeforces.country,
          contribution: u.contribution ?? stats.codeforces.contribution,
        };
        console.log(`Fetched Codeforces info for ${u.handle}: rating ${u.rating}, rank ${u.rank}`);
      }
    }
  } catch (err) {
    console.warn("Failed to fetch Codeforces info:", err.message);
  }

  // 3. Fetch Codeforces Submissions
  try {
    const cfStatusRes = await fetch(`https://codeforces.com/api/user.status?handle=${codeforcesUser}&from=1&count=2000`);
    if (cfStatusRes.ok) {
      const json = await cfStatusRes.json();
      if (json.status === "OK" && Array.isArray(json.result)) {
        const cfCalendar = {};
        for (const sub of json.result) {
          if (sub.creationTimeSeconds) {
            const dateKey = new Date(sub.creationTimeSeconds * 1000).toISOString().split("T")[0];
            cfCalendar[dateKey] = (cfCalendar[dateKey] || 0) + 1;
          }
        }
        stats.codeforces.calendar = cfCalendar;
        console.log(`Fetched Codeforces submissions: ${Object.keys(cfCalendar).length} active days.`);
      }
    }
  } catch (err) {
    console.warn("Failed to fetch Codeforces status:", err.message);
  }

  // Combine calendars
  const combined = { ...(stats.leetcode.calendar || {}) };
  for (const [dateKey, count] of Object.entries(stats.codeforces.calendar || {})) {
    combined[dateKey] = (combined[dateKey] || 0) + count;
  }
  stats.combinedCalendar = combined;

  // Write outputs
  const dataDir = path.join(__dirname, "../src/data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(path.join(dataDir, "coding-stats.json"), JSON.stringify(stats, null, 2));

  const publicDataDir = path.join(__dirname, "../public/data");
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDataDir, "coding-stats.json"), JSON.stringify(stats, null, 2));

  console.log("Successfully written coding stats to src/data/coding-stats.json and public/data/coding-stats.json");
}

fetchStats();
