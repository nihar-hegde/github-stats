import React from "react";
import { View, Text } from "react-native";
import { Calendar } from "lucide-react";
import { CommitActivity } from "@/types/githubStats";

interface HeatmapProps {
  data: CommitActivity[];
}

const ContributionHeatmap: React.FC<HeatmapProps> = ({ data }) => {
  const getIntensityColor = (count: number) => {
    if (count === 0) return "bg-gray-800";
    if (count <= 2) return "bg-green-900";
    if (count <= 5) return "bg-green-700";
    if (count <= 10) return "bg-green-500";
    return "bg-green-300";
  };

  return (
    <View className="bg-gray-900 rounded-xl p-4 mt-4">
      <View className="flex-row items-center mb-4">
        <Calendar className="text-blue-400 mr-2" size={20} />
        <Text className="text-white text-lg font-semibold">
          Contribution Activity
        </Text>
      </View>
      <View className="flex-row flex-wrap">
        {data.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-col">
            {week.days.map((count, dayIndex) => (
              <View
                key={`${weekIndex}-${dayIndex}`}
                className={`w-3 h-3 m-0.5 rounded-sm ${getIntensityColor(count)}`}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default ContributionHeatmap;
