// app/index.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const username = await AsyncStorage.getItem("github_username");
      if (username) {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    } catch (error) {
      router.replace("/onboarding");
    }
  };

  return <LoadingSpinner />;
}
