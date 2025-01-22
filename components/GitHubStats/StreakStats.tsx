// components/GitHubStats/StreakStats.tsx
import React from "react";
import { View, Text } from "react-native";
import { Flame, GitCommit, Trophy } from "lucide-react";
import { Streak } from "@/types/githubStats";

interface StreakStatsProps {
  streak: Streak;
}

const StreakStats: React.FC<StreakStatsProps> = ({ streak }) => {
  return (
    <View className="mt-4 space-y-4">
      <View className="flex-row justify-between">
        <View className="bg-gray-900 rounded-xl p-4 flex-1 mr-2">
          <View className="flex-row items-center mb-2">
            <Flame className="text-orange-400 mr-2" size={20} />
            <Text className="text-white font-semibold">Current Streak</Text>
          </View>
          <Text className="text-2xl font-bold text-orange-400">
            {streak.currentStreak} days
          </Text>
          <Text className="text-gray-400 text-sm mt-1">Keep pushing code!</Text>
        </View>

        <View className="bg-gray-900 rounded-xl p-4 flex-1 ml-2">
          <View className="flex-row items-center mb-2">
            <Trophy className="text-yellow-400 mr-2" size={20} />
            <Text className="text-white font-semibold">Longest Streak</Text>
          </View>
          <Text className="text-2xl font-bold text-yellow-400">
            {streak.longestStreak} days
          </Text>
          <Text className="text-gray-400 text-sm mt-1">Personal best!</Text>
        </View>
      </View>

      <View className="bg-gray-900 rounded-xl p-4">
        <View className="flex-row items-center mb-2">
          <GitCommit className="text-blue-400 mr-2" size={20} />
          <Text className="text-white font-semibold">Total Contributions</Text>
        </View>
        <Text className="text-2xl font-bold text-blue-400">
          {streak.totalCommits.toLocaleString()}
        </Text>
        <Text className="text-gray-400 text-sm mt-1">Lifetime commits</Text>
      </View>
    </View>
  );
};

export default StreakStats;
