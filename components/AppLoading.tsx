// app/components/AppLoading.tsx
import { View, Text } from "react-native";
import { COLORS, FontAwesome5 } from "../constants/theme";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

SplashScreen.preventAutoHideAsync();

export default function AppLoading() {
  return (
    <View className="flex-1 bg-slate-900 items-center justify-center">
      <View className="items-center space-y-4">
        <FontAwesome5 name="github" size={64} color={COLORS.text} />
        <View className="items-center">
          <Text className="text-slate-100 text-2xl font-bold">GitStatus</Text>
          <Text className="text-slate-400 text-sm">
            Track your GitHub activity
          </Text>
        </View>
      </View>
    </View>
  );
}
