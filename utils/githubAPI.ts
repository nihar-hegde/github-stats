// utils/githubAPI.ts
import axios, { AxiosInstance } from "axios";
import { PopularRepo, RepoStats, Streak } from "@/types/githubStats";

class GitHubAPI {
  private api: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: "https://api.github.com",
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response?.status === 403 &&
          error.response?.data?.message?.includes("rate limit")
        ) {
          throw new Error("API rate limit exceeded. Please try again later.");
        }
        throw error;
      }
    );
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common["Authorization"];
    }
  }

  async fetchAuthenticatedUser() {
    if (!this.accessToken) throw new Error("No access token available");
    const { data } = await this.api.get("/user");
    return data;
  }

  async fetchUserStats(): Promise<{
    repoStats: RepoStats;
    streak: Streak;
    languages: { [key: string]: number };
  }> {
    if (!this.accessToken) throw new Error("No access token available");

    const [userRepos, events] = await Promise.all([
      this.api.get("/user/repos?sort=pushed&per_page=100"),
      this.api.get("/user/events?per_page=100"),
    ]);

    // Process repository statistics
    const repoStats: RepoStats = {
      totalStars: 0,
      totalForks: 0,
      totalWatchers: 0,
      popularRepos: [],
      totalPrivateRepos: 0,
      totalPublicRepos: 0,
    };

    // Calculate repository stats
    userRepos.data.forEach((repo: any) => {
      repoStats.totalStars += repo.stargazers_count;
      repoStats.totalForks += repo.forks_count;
      repoStats.totalWatchers += repo.watchers_count;
      repo.private
        ? repoStats.totalPrivateRepos++
        : repoStats.totalPublicRepos++;

      if (repo.stargazers_count > 0) {
        repoStats.popularRepos.push({
          name: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          description: repo.description,
        });
      }
    });

    // Sort popular repos by stars
    repoStats.popularRepos.sort((a, b) => b.stars - a.stars).slice(0, 5);

    // Calculate streak information
    const pushEvents = events.data.filter(
      (event: any) => event.type === "PushEvent"
    );
    const streak = this.calculateStreak(pushEvents);

    // Fetch languages for most active repositories
    const languages = await this.fetchLanguagesForRepos(
      userRepos.data.slice(0, 5)
    );

    return {
      repoStats,
      streak,
      languages,
    };
  }

  private async fetchLanguagesForRepos(repos: any[]) {
    const languages: { [key: string]: number } = {};

    await Promise.all(
      repos.map(async (repo) => {
        const { data } = await this.api.get(repo.languages_url);
        Object.entries(data).forEach(([lang, bytes]: [string, any]) => {
          languages[lang] = (languages[lang] || 0) + bytes;
        });
      })
    );

    return languages;
  }

  private calculateStreak(pushEvents: any[]): Streak {
    let currentStreak = 0;
    let longestStreak = 0;
    let totalCommits = 0;

    const commitDates = [
      ...new Set(
        pushEvents.map((event) => {
          const commits = event.payload.commits || [];
          totalCommits += commits.length;
          return new Date(event.created_at).toISOString().split("T")[0];
        })
      ),
    ]
      .sort()
      .reverse();

    let streakCount = 1;
    for (let i = 1; i < commitDates.length; i++) {
      const curr = new Date(commitDates[i]);
      const prev = new Date(commitDates[i - 1]);
      const dayDiff = Math.abs(
        (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        streakCount++;
        longestStreak = Math.max(longestStreak, streakCount);
      } else {
        streakCount = 1;
      }
    }

    const lastCommitDate = new Date(commitDates[0]);
    const now = new Date();
    const daysSinceLastCommit = Math.floor(
      (now.getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    currentStreak = daysSinceLastCommit <= 1 ? streakCount : 0;

    return {
      currentStreak,
      longestStreak,
      totalCommits,
    };
  }
}

export const githubAPI = new GitHubAPI();
