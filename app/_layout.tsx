// app/_layout.tsx
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "../components/AppLoading";
import "./global.css";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  console.log("Loading from app/_layout.tsx");

  useEffect(() => {
    checkUsername();
  }, []);

  const checkUsername = async () => {
    try {
      await AsyncStorage.getItem("github_username");
      setIsReady(true);
    } catch (error) {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0f172a",
          },
          headerTintColor: "#f1f5f9",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#0f172a",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
