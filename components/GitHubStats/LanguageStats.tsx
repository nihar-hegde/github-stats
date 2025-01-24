// components/GitHubStats/LanguageStats.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
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
  C: "bg-blue-600",
  "C++": "bg-pink-600",
  "C#": "bg-green-600",
  Shell: "bg-gray-500",
  Vue: "bg-emerald-500",
  Dart: "bg-blue-400",
  Scala: "bg-red-500",
  Haskell: "bg-purple-500",
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
        <Feather name="code" size={20} color="#60A5FA" />
        <Text className="text-white text-lg font-semibold ml-2">
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
            {/* Progress bar container */}
            <View className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
              {/* Progress bar fill */}
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
