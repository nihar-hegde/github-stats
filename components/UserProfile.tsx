import { View, Text, Alert, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchGitHubUser } from "@/utils/githubAPI";
import { SafeAreaView } from "react-native-safe-area-context";
import { GitHubUser } from "@/types/githubUserTypes";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

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
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex items-center justify-center py-6">
        <ActivityIndicator size={"large"} color={"0066cc"} />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView className="flex items-center justify-center py-6">
        <Text className="text-red-500 text-xl font-semibold">
          No user Data availabe!
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={["#2a2a2a", "#1E1E1E"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-row items-center p-4 rounded-xl mx-4 my-2 shadow-lg"
    >
      <View className="mr-4">
        <Image
          source={{ uri: userData.avatar_url }}
          className="w-20 h-20 rounded-full border-3 border-white"
        />
      </View>
      <View className="flex-1">
        <Text className="text-white text-xl font-bold mb-1">
          {userData.name || userData.login}
        </Text>
        {userData.bio && (
          <Text className="text-gray-400 text-sm mb-2">{userData.bio}</Text>
        )}
        <View className="flex-row justify-between mt-2">
          <View className="flex-row items-center">
            <Feather name="users" size={16} color="#6e6e6e" />
            <Text className="text-gray-300 text-sm ml-1">
              <Text className="text-white font-bold">{userData.followers}</Text>{" "}
              Followers
            </Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="user-plus" size={16} color="#6e6e6e" />
            <Text className="text-gray-300 text-sm ml-1">
              <Text className="text-white font-bold">{userData.following}</Text>{" "}
              Following
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default UserHeader;
