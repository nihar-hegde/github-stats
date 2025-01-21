import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
  Text,
  Alert,
} from "react-native";
import { fetchUserStats } from "@/utils/githubAPI";
import ContributionHeatmap from "./GitHubStats/ContributionHeatmap";
import LanguageStats from "./GitHubStats/LanguageStats";
import StreakStats from "./GitHubStats/StreakStats";
import RepoStats from "./GitHubStats/RepoStats";

interface StatsDashboardProps {
  username: string;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ username }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await fetchUserStats(username);
      setStats(data);
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      setError(error.message || "Failed to load statistics");
      Alert.alert(
        "Error",
        "Failed to load statistics. Pull down to refresh and try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [username]);

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
      className="flex-1 bg-gray-900 px-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StreakStats streak={stats.streak} />
      <ContributionHeatmap data={stats.commits} />
      <LanguageStats languages={stats.languages} />
      <RepoStats stats={stats.repoStats} />
    </ScrollView>
  );
};

export default StatsDashboard;
