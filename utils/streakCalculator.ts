// utils/streakCalculator.ts
import { Streak } from "@/types/githubStats";

export function calculateStreak(weeks: any[]): Streak {
  // First, let's flatten and sort all contribution days
  const contributionDays = weeks
    .flatMap((week: any) => week.contributionDays)
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  let currentStreak = 0;
  let longestStreak = 0;
  let totalCommits = 0;

  // Calculate total commits
  totalCommits = contributionDays.reduce(
    (sum, day) => sum + day.contributionCount,
    0
  );

  // Find the most recent day with contributions
  let lastContributionDate: Date | null = null;
  for (const day of contributionDays) {
    if (day.contributionCount > 0) {
      lastContributionDate = new Date(day.date);
      break;
    }
  }

  // Calculate current streak
  if (lastContributionDate) {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // If the last contribution was today or yesterday, count the streak
    if (lastContributionDate.getTime() >= yesterday.getTime()) {
      currentStreak = 1; // Count the first day
      let checkDate = new Date(lastContributionDate);

      for (const day of contributionDays) {
        const date = new Date(day.date);
        if (date >= today) continue; // Skip future dates

        checkDate.setDate(checkDate.getDate() - 1);
        if (
          date.getTime() === checkDate.getTime() &&
          day.contributionCount > 0
        ) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  // Calculate longest streak
  let tempStreak = 0;
  let prevDate: Date | null = null;

  // Sort dates in chronological order for longest streak calculation
  const sortedDays = [...contributionDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const day of sortedDays) {
    const date = new Date(day.date);

    if (day.contributionCount > 0) {
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const dayDiff = Math.floor(
          (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      prevDate = date;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      prevDate = null;
      tempStreak = 0;
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalCommits,
  };
}
