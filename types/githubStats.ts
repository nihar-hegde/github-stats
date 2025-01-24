// types/githubStats.ts
export interface ContributionDay {
  contributionCount: number;
  date: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionStats {
  totalContributions: number;
  contributionCalendar: {
    totalContributions: number;
    weeks: ContributionWeek[];
  };
}

export interface LanguageStatsI {
  [key: string]: number;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  totalCommits: number;
}

export interface PopularRepo {
  name: string;
  stars: number;
  forks: number;
  description: string | null;
}

export interface RepoStats {
  totalStars: number;
  totalForks: number;
  totalWatchers: number;
  popularRepos: PopularRepo[];
  totalPrivateRepos: number;
  totalPublicRepos: number;
}

export interface GitHubStats {
  repoStats: RepoStats;
  streak: Streak;
  languages: LanguageStatsI;
  contributionStats: ContributionStats;
}
