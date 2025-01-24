// components/GitHubStats/ContributionStats.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ContributionStatsProps {
  stats: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalStars: number;
    pullRequestContributions: number;
    issueContributions: number;
    totalRepositoriesContributedTo: number;
  };
}

const ContributionStats: React.FC<ContributionStatsProps> = ({ stats }) => {
  return (
    <View className="mt-4">
      <View className="bg-gray-900 rounded-xl p-4">
        <View className="flex-row items-center mb-4">
          <Feather name="activity" size={20} color="#60A5FA" />
          <Text className="text-white text-lg font-semibold ml-2">
            Contribution Overview
          </Text>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {/* Total Commits */}
          <View className="w-1/2 mb-4 pr-2">
            <View className="bg-gray-800 rounded-lg p-3">
              <View className="flex-row items-center mb-1">
                <Feather name="git-commit" size={16} color="#60A5FA" />
                <Text className="text-gray-400 ml-2 text-sm">
                  Total Commits
                </Text>
              </View>
              <Text className="text-xl font-bold text-blue-400">
                {stats.totalCommits.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Total Pull Requests */}
          <View className="w-1/2 mb-4 pl-2">
            <View className="bg-gray-800 rounded-lg p-3">
              <View className="flex-row items-center mb-1">
                <Feather name="git-pull-request" size={16} color="#10B981" />
                <Text className="text-gray-400 ml-2 text-sm">
                  Pull Requests
                </Text>
              </View>
              <Text className="text-xl font-bold text-emerald-400">
                {stats.totalPRs.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Total Issues */}
          <View className="w-1/2 mb-4 pr-2">
            <View className="bg-gray-800 rounded-lg p-3">
              <View className="flex-row items-center mb-1">
                <Feather name="alert-circle" size={16} color="#F59E0B" />
                <Text className="text-gray-400 ml-2 text-sm">Issues</Text>
              </View>
              <Text className="text-xl font-bold text-amber-400">
                {stats.totalIssues.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Total Stars */}
          <View className="w-1/2 mb-4 pl-2">
            <View className="bg-gray-800 rounded-lg p-3">
              <View className="flex-row items-center mb-1">
                <Feather name="star" size={16} color="#FCD34D" />
                <Text className="text-gray-400 ml-2 text-sm">Total Stars</Text>
              </View>
              <Text className="text-xl font-bold text-yellow-400">
                {stats.totalStars.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Stats */}
        <View className="mt-2">
          <View className="bg-gray-800 rounded-lg p-4">
            <Text className="text-white font-semibold mb-3">
              Additional Stats
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400">
                  Repositories Contributed To
                </Text>
                <Text className="text-blue-400 font-semibold">
                  {stats.totalRepositoriesContributedTo}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400">PR Review Contributions</Text>
                <Text className="text-emerald-400 font-semibold">
                  {stats.pullRequestContributions}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400">Issue Contributions</Text>
                <Text className="text-amber-400 font-semibold">
                  {stats.issueContributions}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ContributionStats;
