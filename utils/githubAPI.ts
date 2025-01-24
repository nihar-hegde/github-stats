// utils/githubAPI.ts
import axios, { AxiosInstance } from "axios";
import { PopularRepo, RepoStats, Streak } from "@/types/githubStats";
import { calculateStreak } from "./streakCalculator";

interface ContributionStats {
  totalCommits: number;
  totalContributions: number; // Added this field
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  pullRequestContributions: number;
  issueContributions: number;
  totalRepositoriesContributedTo: number;
  contributionCalendar: {
    totalContributions: number;
    weeks: any[];
  };
}

class GitHubAPI {
  private graphqlApi: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.graphqlApi = axios.create({
      baseURL: "https://api.github.com/graphql",
      headers: {
        Accept: "application/json",
      },
    });
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      this.graphqlApi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
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

  async fetchAllStats() {
    if (!this.accessToken) throw new Error("No access token available");

    // Modified query in fetchAllStats
    const query = `
query {
  viewer {
    # Repository data - only owned repos, not forks
    repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, affiliations: [OWNER], isFork: false) {
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
    
    # Contribution data with more details
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalRepositoriesWithContributedCommits
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
      commitContributionsByRepository {
        contributions {
          totalCount
        }
        repository {
          nameWithOwner
        }
      }
    }
    
    # Pull Requests and Issues
    pullRequests(first: 1) {
      totalCount
    }
    issues(first: 1) {
      totalCount
    }
  }
}
`;

    const { data } = await this.graphqlApi.post("", { query });
    const userData = data.data.viewer;

    const repoStats = this.processRepositoryStats(userData.repositories.nodes);
    const languages = this.processLanguageStats(userData.repositories.nodes);
    const contributionStats = this.processContributionStats(userData);
    const streak = calculateStreak(
      userData.contributionsCollection.contributionCalendar.weeks
    );

    return {
      repoStats,
      languages,
      contributionStats,
      streak,
    };
  }

  private processRepositoryStats(repositories: any[]): RepoStats {
    const stats: RepoStats = {
      totalStars: 0,
      totalForks: 0,
      totalWatchers: 0,
      popularRepos: [],
      totalPrivateRepos: 0,
      totalPublicRepos: 0,
    };

    repositories.forEach((repo) => {
      if (repo.isPrivate) {
        stats.totalPrivateRepos++;
      } else {
        stats.totalPublicRepos++;
        stats.totalStars += repo.stargazerCount;
        stats.totalForks += repo.forkCount;

        if (repo.stargazerCount > 0) {
          stats.popularRepos.push({
            name: repo.name,
            stars: repo.stargazerCount,
            forks: repo.forkCount,
            description: repo.description,
          });
        }
      }
    });

    stats.popularRepos.sort((a, b) => b.stars - a.stars);
    stats.popularRepos = stats.popularRepos.slice(0, 5);

    return stats;
  }

  private processLanguageStats(repositories: any[]): { [key: string]: number } {
    const languages: { [key: string]: number } = {};

    repositories.forEach((repo) => {
      if (!repo.isPrivate) {
        repo.languages.edges.forEach((edge: any) => {
          const langName = edge.node.name;
          languages[langName] = (languages[langName] || 0) + edge.size;
        });
      }
    });

    return languages;
  }

  private processContributionStats(userData: any): ContributionStats {
    const contributions = userData.contributionsCollection;

    // Get total contributions from the contribution calendar
    // This includes all types of contributions: commits, issues, PRs, reviews
    const totalContributions =
      contributions.contributionCalendar.totalContributions;

    // Calculate total commits including private contributions
    const totalCommits =
      contributions.totalCommitContributions +
      (contributions.restrictedContributionsCount || 0);

    return {
      totalCommits,
      totalContributions, // Added this field
      totalPRs: userData.pullRequests.totalCount,
      totalIssues: userData.issues.totalCount,
      totalStars: userData.repositories.nodes.reduce(
        (sum: number, repo: any) => sum + (repo.stargazerCount || 0),
        0
      ),
      pullRequestContributions: contributions.totalPullRequestContributions,
      issueContributions: contributions.totalIssueContributions,
      totalRepositoriesContributedTo:
        contributions.totalRepositoriesWithContributedCommits,
      contributionCalendar: contributions.contributionCalendar,
    };
  }
}

export const githubAPI = new GitHubAPI();
