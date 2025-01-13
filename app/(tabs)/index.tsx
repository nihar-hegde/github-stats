// app/(tabs)/index.tsx
import { View, ScrollView, Text, RefreshControl, Image } from "react-native";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "../../constants/theme";
import { COLORS } from "../../constants/theme";
import LoadingSpinner from "../../components/LoadingSpinner";
import { calculateStreak } from "@/lib/calculateStreak";

interface GitHubStats {
  profile: any;
  repos: any[];
  contributionsCount: number;
  streak: number;
  topLanguages: { name: string; count: number }[];
}

export default function StatsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GitHubStats | null>(null);

  const fetchStats = async () => {
    try {
      const username = await AsyncStorage.getItem("github_username");
      if (!username) throw new Error("No username found");

      // Fetch user profile
      const profileResponse = await fetch(
        `https://api.github.com/users/${username}`
      );
      const profile = await profileResponse.json();

      // Fetch repositories
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const repos = await reposResponse.json();

      // Calculate top languages
      const languages: { [key: string]: number } = {};
      repos.forEach((repo: any) => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
      });

      const topLanguages = Object.entries(languages)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate streak
      const currentStreak = await calculateStreak(repos);

      setStats({
        profile,
        repos,
        contributionsCount: profile.public_repos,
        streak: currentStreak,
        topLanguages,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!stats) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-slate-100">Failed to load stats</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Profile Section */}
      <View className="p-4">
        <View className="bg-slate-800 rounded-lg p-4 flex-row items-center">
          <Image
            source={{ uri: stats.profile.avatar_url }}
            className="w-16 h-16 rounded-full"
          />
          <View className="ml-4">
            <Text className="text-slate-100 text-xl font-bold">
              {stats.profile.name}
            </Text>
            <Text className="text-slate-400">@{stats.profile.login}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap mt-4">
          <StatCard
            title="Repositories"
            value={stats.profile.public_repos}
            icon="book"
          />
          <StatCard
            title="Followers"
            value={stats.profile.followers}
            icon="users"
          />
          <StatCard title="Current Streak" value={stats.streak} icon="fire" />
        </View>

        {/* Languages Section */}
        <View className="mt-4 bg-slate-800 rounded-lg p-4">
          <Text className="text-slate-100 text-lg font-bold mb-3">
            Top Languages
          </Text>
          {stats.topLanguages.map((lang) => (
            <View
              key={lang.name}
              className="flex-row justify-between items-center mb-2"
            >
              <Text className="text-slate-100">{lang.name}</Text>
              <Text className="text-slate-400">{lang.count} repos</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <View className="w-1/2 p-2">
      <View className="bg-slate-800 rounded-lg p-4">
        <View className="flex-row items-center mb-2">
          <FontAwesome5 name={icon} size={16} color={COLORS.text} />
          <Text className="text-slate-400 ml-2">{title}</Text>
        </View>
        <Text className="text-slate-100 text-2xl font-bold">{value}</Text>
      </View>
    </View>
  );
}
