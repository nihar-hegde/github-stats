// app/onboarding.tsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, FontAwesome5 } from "../constants/theme";

export default function OnboardingScreen() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateAndSaveUsername = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter a GitHub username");
      return;
    }

    setIsLoading(true);
    try {
      // Validate username exists on GitHub
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) {
        Alert.alert("Error", "GitHub user not found");
        return;
      }

      // Save username
      await AsyncStorage.setItem("github_username", username.trim());
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Failed to validate username");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-900 p-6">
      <View className="flex-1 justify-center">
        <View className="items-center mb-10">
          <FontAwesome5 name="github" size={64} color={COLORS.text} />
          <Text className="text-slate-100 text-2xl font-bold mt-4">
            Welcome to GitStatus
          </Text>
          <Text className="text-slate-400 text-center mt-2">
            Enter your GitHub username to get started
          </Text>
        </View>

        <View className="space-y-4">
          <TextInput
            className="bg-slate-800 text-slate-100 p-4 rounded-lg border border-slate-700"
            placeholder="GitHub Username"
            placeholderTextColor="#64748b"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            className={`bg-blue-600 p-4 rounded-lg ${
              isLoading ? "opacity-70" : ""
            }`}
            onPress={validateAndSaveUsername}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-bold">
              {isLoading ? "Validating..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
