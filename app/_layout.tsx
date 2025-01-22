// app/_layout.tsx
import { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "./global.css";

export default function RootLayout() {
  useEffect(() => {
    // Prevent splash screen from auto-hiding
    SplashScreen.preventAutoHideAsync();
  }, []);

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
