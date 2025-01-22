// components/GitHubStats/ContributionHeatmap.tsx
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

  const getMontLabel = (weekIndex: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const date = new Date();
    date.setDate(date.getDate() - (data.length - weekIndex) * 7);
    return months[date.getMonth()];
  };

  const renderMonthLabels = () => {
    const monthLabels = new Set();
    return data.map((_, weekIndex) => {
      const month = getMontLabel(weekIndex);
      if (!monthLabels.has(month) && weekIndex % 4 === 0) {
        monthLabels.add(month);
        return (
          <Text
            key={weekIndex}
            className="text-gray-400 text-xs"
            style={{ position: "absolute", left: weekIndex * 13, top: -20 }}
          >
            {month}
          </Text>
        );
      }
      return null;
    });
  };

  return (
    <View className="bg-gray-900 rounded-xl p-4 mt-4">
      <View className="flex-row items-center mb-6">
        <Calendar className="text-blue-400 mr-2" size={20} />
        <Text className="text-white text-lg font-semibold">
          Contribution Activity
        </Text>
      </View>

      <View className="relative">
        {renderMonthLabels()}
        <View className="flex-row flex-wrap mt-2">
          {data.map((week, weekIndex) => (
            <View key={weekIndex} className="flex-col">
              {week.days.map((count, dayIndex) => (
                <View
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 m-0.5 rounded-sm ${getIntensityColor(
                    count
                  )}`}
                >
                  {count > 0 && (
                    <View className="absolute -top-6 left-1/2 transform -translate-x-1/2 hidden">
                      <View className="bg-gray-800 px-2 py-1 rounded">
                        <Text className="text-white text-xs">
                          {count} contributions
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        <View className="flex-row justify-end items-center mt-4">
          <Text className="text-gray-400 text-xs mr-2">Less</Text>
          <View className="flex-row">
            {[0, 2, 5, 10, 15].map((value, index) => (
              <View
                key={index}
                className={`w-3 h-3 ml-1 rounded-sm ${getIntensityColor(
                  value
                )}`}
              />
            ))}
          </View>
          <Text className="text-gray-400 text-xs ml-2">More</Text>
        </View>
      </View>
    </View>
  );
};

export default ContributionHeatmap;
