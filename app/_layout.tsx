import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    SplashScreen.hideAsync();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
