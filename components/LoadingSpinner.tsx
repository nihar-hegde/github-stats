import { View, ActivityIndicator } from "react-native";
import { COLORS } from "../constants/theme";

export default function LoadingSpinner() {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}
