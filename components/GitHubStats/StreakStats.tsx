import React from "react";
import { View, Text } from "react-native";
import { Flame, GitCommit, Trophy } from "lucide-react";
import { Streak } from "@/types/githubStats";

interface StreakStatsProps {
  streak: Streak;
}

const StreakStats: React.FC<StreakStatsProps> = ({ streak }) => {
  return (
    <View className="flex-row justify-between mt-4">
      <View className="bg-gray-900 rounded-xl p-4 flex-1 mr-2">
        <View className="flex-row items-center mb-2">
          <Flame className="text-orange-400 mr-2" size={20} />
          <Text className="text-white font-semibold">Current Streak</Text>
        </View>
        <Text className="text-2xl font-bold text-orange-400">
          {streak.currentStreak} days
        </Text>
      </View>

      <View className="bg-gray-900 rounded-xl p-4 flex-1 ml-2">
        <View className="flex-row items-center mb-2">
          <Trophy className="text-yellow-400 mr-2" size={20} />
          <Text className="text-white font-semibold">Longest Streak</Text>
        </View>
        <Text className="text-2xl font-bold text-yellow-400">
          {streak.longestStreak} days
        </Text>
      </View>
    </View>
  );
};

export default StreakStats;
