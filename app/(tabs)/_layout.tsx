// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { FontAwesome5 } from "../../constants/theme";
import { COLORS } from "../../constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text,
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Overview",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="chart-bar" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="code-branch" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
