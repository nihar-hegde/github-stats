export interface CommitActivity {
  total: number;
  week: number;
  days: number[];
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

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  totalCommits: number;
}
