import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { fetchGitHubUser } from "@/utils/githubAPI";
import type { GitHubUser } from "@/types/githubUserTypes";
import { Ionicons } from "@expo/vector-icons";

const UserHeader = ({ username }: { username: string }) => {
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchGitHubUser(username);
        setUserData(data);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [username]);

  if (loading) {
    return (
      <SafeAreaView className="flex items-center justify-center py-8">
        <ActivityIndicator size="large" color="#60A5FA" />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView className="flex items-center justify-center py-8">
        <Text className="text-red-500 text-xl font-semibold">
          No user data available!
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-gray-900">
      <LinearGradient
        colors={["#1E293B", "#0F172A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-b-3xl shadow-2xl"
      >
        <TouchableOpacity
          className="absolute top-4 right-4 z-10"
          onPress={() => console.log("Settings pressed")}
        >
          <Ionicons name="settings-outline" size={24} color="#60A5FA" />
        </TouchableOpacity>

        <View className="p-6">
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: userData.avatar_url }}
              className="w-24 h-24 rounded-full border-4 border-blue-500"
            />
            <View className="ml-4 flex-1">
              <Text className="text-white text-2xl font-bold mb-1">
                {userData.name || userData.login}
              </Text>
              <Text className="text-gray-400 text-base">@{userData.login}</Text>
            </View>
          </View>

          {userData.bio && (
            <Text className="text-gray-300 text-base mb-4">{userData.bio}</Text>
          )}

          <View className="flex-row justify-between mb-4">
            <TouchableOpacity className="bg-gray-800 rounded-xl p-3 flex-1 mr-2">
              <Text className="text-white text-center text-lg font-semibold">
                {userData.followers}
              </Text>
              <Text className="text-gray-400 text-center">Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-800 rounded-xl p-3 flex-1 ml-2">
              <Text className="text-white text-center text-lg font-semibold">
                {userData.following}
              </Text>
              <Text className="text-gray-400 text-center">Following</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            {userData.location && (
              <View className="flex-row items-center mr-4">
                <Text className="text-blue-400 mr-1">📍</Text>
                <Text className="text-gray-300 font-bold text-sm">
                  {userData.location}
                </Text>
              </View>
            )}
            {userData.blog && (
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-blue-400 mr-1">🔗</Text>
                <Text className="text-blue-400 font-semibold text-sm">
                  {userData.blog}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default UserHeader;
