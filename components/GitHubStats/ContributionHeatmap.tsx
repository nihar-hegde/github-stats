// components/GitHubStats/ContributionHeatmap.tsx
import React from "react";
import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface HeatmapProps {
  weeks: ContributionWeek[];
  totalContributions: number;
}

const ContributionHeatmap: React.FC<HeatmapProps> = ({
  weeks,
  totalContributions,
}) => {
  const getIntensityColor = (count: number) => {
    if (count === 0) return "bg-gray-800";
    if (count <= 2) return "bg-green-900";
    if (count <= 5) return "bg-green-700";
    if (count <= 10) return "bg-green-500";
    return "bg-green-300";
  };

  const getMonthLabel = (date: string) => {
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
    return months[new Date(date).getMonth()];
  };

  const renderMonthLabels = () => {
    const monthLabels = new Set();
    return weeks.map((week, weekIndex) => {
      const firstDay = week.contributionDays[0];
      const month = getMonthLabel(firstDay.date);
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
      <View className="flex-row items-center mb-2">
        <Feather name="calendar" size={20} color="#60A5FA" />
        <Text className="text-white text-lg font-semibold ml-2">
          {totalContributions.toLocaleString()} Contributions
        </Text>
      </View>

      <View className="relative">
        {renderMonthLabels()}
        <View className="flex-row flex-wrap mt-2">
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} className="flex-col">
              {week.contributionDays.map((day, dayIndex) => (
                <View
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 m-0.5 rounded-sm ${getIntensityColor(
                    day.contributionCount
                  )}`}
                />
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
