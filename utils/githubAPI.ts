import { PopularRepo, RepoStats } from "@/types/githubStats";
import axios from "axios";

const BASE_URL = "https://api.github.com";

// Create an axios instance with default configuration
const githubApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/vnd.github.v3+json",
  },
});

// Simple fetch helper with basic error handling
const githubFetch = async (url: string) => {
  try {
    const response = await githubApi.get(url);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Resource not found");
    }
    if (error.response?.status === 403) {
      throw new Error("API rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to fetch data from GitHub");
  }
};

export const fetchGitHubUser = async (username: string) => {
  try {
    return await githubFetch(`/users/${username}`);
  } catch (error: any) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const fetchUserStats = async (username: string) => {
  try {
    // Get user's public repositories first
    const repos = await githubFetch(
      `/users/${username}/repos?per_page=30&sort=pushed`,
    );

    // Calculate repository statistics
    const repoStats: RepoStats = {
      totalStars: 0,
      totalForks: 0,
      totalWatchers: 0,
      popularRepos: [],
      totalPrivateRepos: 0,
      totalPublicRepos: repos.length,
    };

    // Process repository data
    repos.forEach((repo: any) => {
      repoStats.totalStars += repo.stargazers_count;
      repoStats.totalForks += repo.forks_count;
      repoStats.totalWatchers += repo.watchers_count;

      if (repo.stargazers_count > 0) {
        repoStats.popularRepos.push({
          name: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          description: repo.description,
        });
      }
    });

    // Sort and limit popular repos
    repoStats.popularRepos.sort((a, b) => b.stars - a.stars);
    repoStats.popularRepos = repoStats.popularRepos.slice(0, 5);

    // Calculate language statistics
    const languages: { [key: string]: number } = {};
    const languagePromises = repos.slice(0, 10).map(async (repo: any) => {
      try {
        const repoLanguages = await githubFetch(
          `/repos/${username}/${repo.name}/languages`,
        );
        Object.entries(repoLanguages).forEach(
          ([lang, bytes]: [string, any]) => {
            languages[lang] = (languages[lang] || 0) + bytes;
          },
        );
      } catch (error) {
        console.warn(`Failed to fetch languages for ${repo.name}`);
      }
    });

    await Promise.all(languagePromises);

    // Calculate commit statistics
    const commitData = new Array(52).fill(0).map((_, index) => ({
      week: index,
      total: 0,
      days: new Array(7).fill(0),
    }));

    // Get recent events for streak calculation
    const events = await githubFetch(
      `/users/${username}/events/public?per_page=100`,
    );
    const pushEvents = events.filter(
      (event: any) => event.type === "PushEvent",
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let totalCommits = 0;

    if (pushEvents.length > 0) {
      const commitDates = pushEvents
        .map((event: any) => {
          const commits = event.payload.commits || [];
          totalCommits += commits.length;
          return new Date(event.created_at).toISOString().split("T")[0];
        })
        .filter(
          (date: string, index: number, self: string[]) =>
            self.indexOf(date) === index,
        )
        .sort((a: string, b: string) => b.localeCompare(a));

      // Calculate streaks
      let streakCount = 1;
      let lastDate = new Date(commitDates[0]);

      for (let i = 1; i < commitDates.length; i++) {
        const currentDate = new Date(commitDates[i]);
        const dayDiff = Math.floor(
          (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (dayDiff === 1) {
          streakCount++;
          longestStreak = Math.max(longestStreak, streakCount);
        } else {
          streakCount = 1;
        }
        lastDate = currentDate;
      }

      // Check if the streak is current
      const today = new Date();
      const lastCommitDate = new Date(commitDates[0]);
      const daysSinceLastCommit = Math.floor(
        (today.getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      currentStreak = daysSinceLastCommit <= 1 ? streakCount : 0;
    }

    return {
      commits: commitData,
      languages,
      streak: {
        currentStreak,
        longestStreak,
        totalCommits,
      },
      repoStats,
    };
  } catch (error: any) {
    console.error("Error fetching user stats:", error);
    throw new Error(error.message || "Failed to fetch user statistics");
  }
};
