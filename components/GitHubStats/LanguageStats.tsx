import React from "react";
import { View, Text } from "react-native";
import { Code2 } from "lucide-react";
import { LanguageStatsI } from "@/types/githubStats";

interface LanguageStatsProps {
  languages: LanguageStatsI;
}

const LanguageStats: React.FC<LanguageStatsProps> = ({ languages }) => {
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  return (
    <View className="bg-gray-900 rounded-xl p-4 mt-4">
      <View className="flex-row items-center mb-4">
        <Code2 className="text-blue-400 mr-2" size={20} />
        <Text className="text-white text-lg font-semibold">Languages</Text>
      </View>

      {Object.entries(languages).map(([lang, bytes], index) => {
        const percentage = ((bytes / totalBytes) * 100).toFixed(1);
        const getColor = (index: number) => {
          const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-red-500",
            "bg-purple-500",
          ];
          return colors[index % colors.length];
        };

        return (
          <View key={lang} className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-300">{lang}</Text>
              <Text className="text-gray-400">{percentage}%</Text>
            </View>
            <View className="bg-gray-800 h-2 rounded-full overflow-hidden flex-row">
              <View
                className={`${getColor(index)} h-full rounded-full`}
                style={{ flex: parseFloat(percentage) }}
              />
              <View style={{ flex: 100 - parseFloat(percentage) }} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default LanguageStats;
