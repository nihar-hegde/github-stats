import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Star, GitFork, Eye, Book } from "lucide-react";

interface RepoStatsProps {
  stats: {
    totalStars: number;
    totalForks: number;
    totalWatchers: number;
    popularRepos: Array<{
      name: string;
      stars: number;
      forks: number;
      description: string;
    }>;
    totalPrivateRepos: number;
    totalPublicRepos: number;
  };
}

const RepoStats: React.FC<RepoStatsProps> = ({ stats }) => {
  return (
    <View className="bg-gray-900 rounded-xl p-4 mt-4">
      <View className="flex-row items-center mb-4">
        <Book className="text-blue-400 mr-2" size={20} />
        <Text className="text-white text-lg font-semibold">
          Repository Stats
        </Text>
      </View>

      {/* Overview stats */}
      <View className="flex-row justify-between mb-6">
        <View className="items-center">
          <Text className="text-2xl font-bold text-blue-400">
            {stats.totalPublicRepos + stats.totalPrivateRepos}
          </Text>
          <Text className="text-gray-400">Total Repos</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-yellow-400">
            {stats.totalStars}
          </Text>
          <Text className="text-gray-400">Total Stars</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-green-400">
            {stats.totalForks}
          </Text>
          <Text className="text-gray-400">Total Forks</Text>
        </View>
      </View>

      {/* Popular repositories */}
      <Text className="text-white text-lg font-semibold mb-3">
        Popular Repositories
      </Text>
      {stats.popularRepos.map((repo) => (
        <TouchableOpacity
          key={repo.name}
          className="bg-gray-800 rounded-lg p-3 mb-2"
        >
          <Text className="text-white font-semibold mb-1">{repo.name}</Text>
          {repo.description && (
            <Text className="text-gray-400 text-sm mb-2" numberOfLines={2}>
              {repo.description}
            </Text>
          )}
          <View className="flex-row">
            <View className="flex-row items-center mr-4">
              <Star className="text-yellow-400 mr-1" size={16} />
              <Text className="text-gray-300">{repo.stars}</Text>
            </View>
            <View className="flex-row items-center">
              <GitFork className="text-green-400 mr-1" size={16} />
              <Text className="text-gray-300">{repo.forks}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RepoStats;
