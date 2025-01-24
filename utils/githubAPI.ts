// utils/githubAPI.ts
import axios, { AxiosInstance } from "axios";
import { PopularRepo, RepoStats, Streak } from "@/types/githubStats";

class GitHubAPI {
  private api: AxiosInstance;
  private graphqlApi: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: "https://api.github.com",
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    this.graphqlApi = axios.create({
      baseURL: "https://api.github.com/graphql",
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
      this.graphqlApi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common["Authorization"];
      delete this.graphqlApi.defaults.headers.common["Authorization"];
    }
  }

  async fetchAuthenticatedUser() {
    if (!this.accessToken) throw new Error("No access token available");

    const query = `
      query {
        viewer {
          login
          name
          bio
          avatarUrl
          url
          company
          location
          websiteUrl
          twitterUsername
          followers {
            totalCount
          }
          following {
            totalCount
          }
          repositories(privacy: PUBLIC) {
            totalCount
          }
        }
      }
    `;

    const { data } = await this.graphqlApi.post("", { query });
    const user = data.data.viewer;

    return {
      login: user.login,
      name: user.name,
      bio: user.bio,
      avatar_url: user.avatarUrl,
      html_url: user.url,
      company: user.company,
      location: user.location,
      blog: user.websiteUrl,
      twitter_username: user.twitterUsername,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      public_repos: user.repositories.totalCount,
    };
  }

  async fetchUserStats(): Promise<{
    repoStats: RepoStats;
    streak: Streak;
    languages: { [key: string]: number };
    contributionStats: {
      totalContributions: number;
      contributionCalendar: {
        totalContributions: number;
        weeks: any[];
      };
    };
  }> {
    if (!this.accessToken) throw new Error("No access token available");

    const query = `
      query {
        viewer {
          repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, privacy: PUBLIC) {
            nodes {
              name
              description
              stargazerCount
              forkCount
              primaryLanguage {
                name
              }
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                  }
                }
              }
              isPrivate
            }
          }
          contributionsCollection {
            totalCommitContributions
            restrictedContributionsCount
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const { data } = await this.graphqlApi.post("", { query });
    const userData = data.data.viewer;

    // Process repository statistics
    const repoStats: RepoStats = {
      totalStars: 0,
      totalForks: 0,
      totalWatchers: 0,
      popularRepos: [],
      totalPrivateRepos: 0,
      totalPublicRepos: 0,
    };

    const languages: { [key: string]: number } = {};

    userData.repositories.nodes.forEach((repo: any) => {
      if (repo.isPrivate) {
        repoStats.totalPrivateRepos++;
      } else {
        repoStats.totalPublicRepos++;
        repoStats.totalStars += repo.stargazerCount;
        repoStats.totalForks += repo.forkCount;

        if (repo.stargazerCount > 0) {
          repoStats.popularRepos.push({
            name: repo.name,
            stars: repo.stargazerCount,
            forks: repo.forkCount,
            description: repo.description,
          });
        }

        // Process languages
        repo.languages.edges.forEach((edge: any) => {
          const langName = edge.node.name;
          languages[langName] = (languages[langName] || 0) + edge.size;
        });
      }
    });

    // Sort popular repos
    repoStats.popularRepos.sort((a, b) => b.stars - a.stars).slice(0, 5);

    // Calculate streak information from contribution calendar
    const streak = this.calculateStreak(
      userData.contributionsCollection.contributionCalendar.weeks
    );

    return {
      repoStats,
      streak,
      languages,
      contributionStats: {
        totalContributions:
          userData.contributionsCollection.totalCommitContributions,
        contributionCalendar:
          userData.contributionsCollection.contributionCalendar,
      },
    };
  }

  private calculateStreak(weeks: any[]): Streak {
    let currentStreak = 0;
    let longestStreak = 0;
    let totalCommits = 0;

    // Flatten contribution days
    const days = weeks
      .flatMap((week: any) => week.contributionDays)
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

    let streakCount = 0;
    const today = new Date().toISOString().split("T")[0];

    // Calculate current streak
    for (const day of days) {
      totalCommits += day.contributionCount;

      if (day.contributionCount > 0) {
        streakCount++;
        currentStreak = streakCount;
      } else {
        break;
      }

      // If we're not looking at today's contributions, break the streak
      if (day.date !== today) {
        break;
      }
    }

    // Calculate longest streak
    streakCount = 0;
    for (let i = 0; i < days.length; i++) {
      if (days[i].contributionCount > 0) {
        streakCount++;
        longestStreak = Math.max(longestStreak, streakCount);
      } else {
        streakCount = 0;
      }
    }

    return {
      currentStreak,
      longestStreak,
      totalCommits,
    };
  }
}

export const githubAPI = new GitHubAPI();
