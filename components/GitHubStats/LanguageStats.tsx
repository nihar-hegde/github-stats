// components/GitHubStats/LanguageStats.tsx
import React from "react";
import { View, Text } from "react-native";
import { Code2 } from "lucide-react";
import { LanguageStatsI } from "@/types/githubStats";

interface LanguageStatsProps {
  languages: LanguageStatsI;
}

const LANGUAGE_COLORS: { [key: string]: string } = {
  JavaScript: "bg-yellow-500",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  Java: "bg-red-500",
  Ruby: "bg-red-600",
  Go: "bg-cyan-500",
  Rust: "bg-orange-500",
  PHP: "bg-purple-500",
  CSS: "bg-pink-500",
  HTML: "bg-orange-600",
  Swift: "bg-orange-500",
  Kotlin: "bg-purple-600",
  // Add more languages as needed
};

const LanguageStats: React.FC<LanguageStatsProps> = ({ languages }) => {
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  // Sort languages by bytes in descending order
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // Show top 8 languages

  return (
    <View className="bg-gray-900 rounded-xl p-4 mt-4">
      <View className="flex-row items-center mb-4">
        <Code2 className="text-blue-400 mr-2" size={20} />
        <Text className="text-white text-lg font-semibold">
          Most Used Languages
        </Text>
      </View>

      {sortedLanguages.map(([lang, bytes]) => {
        const percentage = (bytes / totalBytes) * 100;
        const colorClass = LANGUAGE_COLORS[lang] || "bg-gray-500";

        return (
          <View key={lang} className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-300 font-medium">{lang}</Text>
              <Text className="text-gray-400">{percentage.toFixed(1)}%</Text>
            </View>
            <View className="bg-gray-800 h-2.5 rounded-full overflow-hidden">
              <View
                className={`${colorClass} h-full rounded-full`}
                style={{ width: `${percentage}%` }}
              />
            </View>
          </View>
        );
      })}

      {Object.keys(languages).length === 0 && (
        <Text className="text-gray-400 text-center py-4">
          No language data available
        </Text>
      )}
    </View>
  );
};

export default LanguageStats;
