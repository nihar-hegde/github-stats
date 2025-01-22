// components/UserProfile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { githubAPI } from "@/utils/githubAPI";
import type { GitHubUser } from "@/types/githubUserTypes";
import { Ionicons } from "@expo/vector-icons";

const UserProfile = () => {
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await githubAPI.fetchAuthenticatedUser();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      Alert.alert("Error", "Couldn't open this link")
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <Text className="text-red-500">Failed to load profile</Text>
      </View>
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
            <View className="bg-gray-800 rounded-xl p-3 flex-1 mr-2">
              <Text className="text-white text-center text-lg font-semibold">
                {userData.followers.toLocaleString()}
              </Text>
              <Text className="text-gray-400 text-center">Followers</Text>
            </View>
            <View className="bg-gray-800 rounded-xl p-3 flex-1 mx-2">
              <Text className="text-white text-center text-lg font-semibold">
                {userData.following.toLocaleString()}
              </Text>
              <Text className="text-gray-400 text-center">Following</Text>
            </View>
            <View className="bg-gray-800 rounded-xl p-3 flex-1 ml-2">
              <Text className="text-white text-center text-lg font-semibold">
                {userData.public_repos.toLocaleString()}
              </Text>
              <Text className="text-gray-400 text-center">Repos</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap">
            {userData.location && (
              <View className="flex-row items-center mr-4 mb-2">
                <Ionicons name="location-outline" size={16} color="#60A5FA" />
                <Text className="text-gray-300 ml-1">{userData.location}</Text>
              </View>
            )}
            {userData.blog && (
              <TouchableOpacity
                className="flex-row items-center mr-4 mb-2"
                onPress={() => handleLinkPress(userData.blog)}
              >
                <Ionicons name="link-outline" size={16} color="#60A5FA" />
                <Text className="text-blue-400 ml-1">Website</Text>
              </TouchableOpacity>
            )}
            {userData.twitter_username && (
              <TouchableOpacity
                className="flex-row items-center mb-2"
                onPress={() =>
                  handleLinkPress(
                    `https://twitter.com/${userData.twitter_username}`
                  )
                }
              >
                <Ionicons name="logo-twitter" size={16} color="#60A5FA" />
                <Text className="text-blue-400 ml-1">
                  @{userData.twitter_username}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default UserProfile;
