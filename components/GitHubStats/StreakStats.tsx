// components/GitHubStats/StreakStats.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Streak } from "@/types/githubStats";
import Ionicons from "@expo/vector-icons/Ionicons";

interface StreakStatsProps {
  streak: Streak;
}

const StreakStats: React.FC<StreakStatsProps> = ({ streak }) => {
  return (
    <View className="mt-4 space-y-4">
      <View className="flex-row justify-between">
        <View className="bg-gray-900 rounded-xl p-4 flex-1 mr-2">
          <View className="flex-row items-center mb-2">
            <Ionicons name="flame" size={24} color="#FB923C" />
            <Text className="text-white font-semibold ml-2">
              Current Streak
            </Text>
          </View>
          <Text className="text-2xl font-bold text-orange-400">
            {streak.currentStreak} days
          </Text>
          <Text className="text-gray-400 text-sm mt-1">Keep pushing code!</Text>
        </View>

        <View className="bg-gray-900 rounded-xl p-4 flex-1 ml-2">
          <View className="flex-row items-center mb-2">
            <Feather name="award" size={20} color="#FCD34D" />
            <Text className="text-white font-semibold ml-2">
              Longest Streak
            </Text>
          </View>
          <Text className="text-2xl font-bold text-yellow-400">
            {streak.longestStreak} days
          </Text>
          <Text className="text-gray-400 text-sm mt-1">Personal best!</Text>
        </View>
      </View>

      <View className="bg-gray-900 rounded-xl p-4">
        <View className="flex-row items-center mb-2">
          <Feather name="git-commit" size={20} color="#60A5FA" />
          <Text className="text-white font-semibold ml-2">
            Total Contributions
          </Text>
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
