// components/StatsDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
  Alert,
} from "react-native";
import { githubAPI } from "@/utils/githubAPI";
import ContributionHeatmap from "./GitHubStats/ContributionHeatmap";
import LanguageStats from "./GitHubStats/LanguageStats";
import StreakStats from "./GitHubStats/StreakStats";
import RepoStats from "./GitHubStats/RepoStats";
import type {
  RepoStats as RepoStatsType,
  Streak,
  LanguageStatsI,
} from "@/types/githubStats";

interface Stats {
  repoStats: RepoStatsType;
  streak: Streak;
  languages: LanguageStatsI;
  contributionStats: {
    totalContributions: number;
    contributionCalendar: {
      totalContributions: number;
      weeks: any[];
    };
  };
}

const StatsDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await githubAPI.fetchUserStats();
      setStats(data);
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Failed to load statistics";
      setError(message);
      Alert.alert(
        "Error",
        "Failed to load statistics. Pull down to refresh and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <ActivityIndicator size="large" color="#60A5FA" />
        <Text className="text-white mt-4">Loading statistics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView
        className="flex-1 bg-gray-900 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-red-400 text-center">{error}</Text>
          <Text className="text-gray-400 text-center mt-2">
            Pull down to refresh
          </Text>
        </View>
      </ScrollView>
    );
  }

  if (!stats) return null;

  return (
    <ScrollView
      className="flex-1 bg-gray-900 px-4 pb-8"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#60A5FA"
        />
      }
    >
      <StreakStats streak={stats.streak} />

      <ContributionHeatmap
        weeks={stats.contributionStats.contributionCalendar.weeks}
        totalContributions={stats.contributionStats.totalContributions}
      />

      <LanguageStats languages={stats.languages} />
      <RepoStats stats={stats.repoStats} />
    </ScrollView>
  );
};

export default StatsDashboard;
