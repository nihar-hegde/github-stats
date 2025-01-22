// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useRouter, Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return <Redirect href="/signin" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
        }}
      />
    </Tabs>
  );
}
