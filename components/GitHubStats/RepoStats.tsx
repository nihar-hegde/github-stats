// components/GitHubStats/RepoStats.tsx
import React from "react";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { RepoStats as RepoStatsType } from "@/types/githubStats";

interface RepoStatsProps {
  stats: RepoStatsType;
}

const RepoStats: React.FC<RepoStatsProps> = ({ stats }) => {
  const handleRepoPress = (repoName: string) => {
    Linking.openURL(`https://github.com/${repoName}`).catch(() => {
      Alert.alert("Error", "Couldn't open repository");
    });
  };

  return (
    <View className="bg-gray-900 rounded-xl p-4 mt-4">
      <View className="flex-row items-center mb-4">
        <Feather name="book" size={20} color="#60A5FA" />
        <Text className="text-white text-lg font-semibold ml-2">
          Repository Stats
        </Text>
      </View>

      {/* Overview stats */}
      <View className="flex-row justify-between mb-6">
        <View className="items-center">
          <Text className="text-2xl font-bold text-blue-400">
            {(
              stats.totalPublicRepos + stats.totalPrivateRepos
            ).toLocaleString()}
          </Text>
          <Text className="text-gray-400">Total Repos</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-yellow-400">
            {stats.totalStars.toLocaleString()}
          </Text>
          <Text className="text-gray-400">Total Stars</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-green-400">
            {stats.totalForks.toLocaleString()}
          </Text>
          <Text className="text-gray-400">Total Forks</Text>
        </View>
      </View>

      {/* Popular repositories */}
      <View className="mb-4">
        <Text className="text-white text-lg font-semibold mb-3">
          Popular Repositories
        </Text>
        {stats.popularRepos.map((repo) => (
          <TouchableOpacity
            key={repo.name}
            className="bg-gray-800 rounded-lg p-3 mb-2"
            onPress={() => handleRepoPress(repo.name)}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-white font-semibold mb-1">
                  {repo.name}
                </Text>
                {repo.description && (
                  <Text
                    className="text-gray-400 text-sm mb-2"
                    numberOfLines={2}
                  >
                    {repo.description}
                  </Text>
                )}
                <View className="flex-row">
                  <View className="flex-row items-center mr-4">
                    <Feather name="star" size={16} color="#FCD34D" />
                    <Text className="text-gray-300 ml-1">
                      {repo.stars.toLocaleString()}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="git-branch" size={16} color="#34D399" />
                    <Text className="text-gray-300 ml-1">
                      {repo.forks.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
              <Feather name="external-link" size={16} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Private vs Public */}
      <View className="bg-gray-800 rounded-lg p-4">
        <Text className="text-white font-semibold mb-2">
          Repository Visibility
        </Text>
        <View className="flex-row justify-between">
          <View>
            <Text className="text-blue-400 text-lg font-bold">
              {stats.totalPublicRepos.toLocaleString()}
            </Text>
            <Text className="text-gray-400">Public</Text>
          </View>
          <View>
            <Text className="text-purple-400 text-lg font-bold">
              {stats.totalPrivateRepos.toLocaleString()}
            </Text>
            <Text className="text-gray-400">Private</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RepoStats;
