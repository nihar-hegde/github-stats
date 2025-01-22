// app/signin.tsx
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useGitHubAuth } from "../auth/githubAuth";
import { useAuth } from "../context/AuthContext";
import { githubAPI } from "@/utils/githubAPI";

export default function SignInScreen() {
  const router = useRouter();
  const { setAccessToken } = useAuth();
  const { request, response, promptAsync, getToken } = useGitHubAuth();

  useEffect(() => {
    if (response?.type === "success") {
      handleCode(response.params.code);
    }
  }, [response]);

  const handleCode = async (code: string) => {
    try {
      const token = await getToken(code);
      githubAPI.setAccessToken(token);
      setAccessToken(token);
      router.replace("/");
    } catch (error) {
      console.error("SignIn error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <View className="flex-1 items-center justify-center px-6">
        <Image
          source={require("../assets/icons/github.png")}
          className="w-24 h-24 mb-8"
          resizeMode="contain"
        />

        <Text className="text-3xl font-bold text-gray-100 mb-6">
          GitHub Stats Dashboard
        </Text>

        <Text className="text-lg text-gray-400 mb-8 text-center">
          Sign in with GitHub to view your statistics and activity
        </Text>

        <TouchableOpacity
          onPress={() => promptAsync()}
          disabled={!request}
          className="bg-[#2EA44F] px-8 py-4 rounded-lg flex-row items-center"
        >
          <Image
            source={require("../assets/icons/github.png")}
            className="w-6 h-6 mr-2"
            resizeMode="contain"
          />
          <Text className="text-white text-lg font-semibold">
            Sign in with GitHub
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
