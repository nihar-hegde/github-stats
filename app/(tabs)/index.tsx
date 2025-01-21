import UserHeader from "@/components/UserProfile";
import StatsDashboard from "@/components/StatsDashboard";
import { getUserName } from "@/utils/localStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [username, setUsername] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userName = async () => {
      try {
        const username = await getUserName();
        if (username) {
          setUsername(username!);
        } else {
          router.replace("/userNameInput");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    userName();
  }, []);

  const handleClearStorage = async () => {
    try {
      await AsyncStorage.removeItem("username");
      setUsername(undefined);
      router.replace("/userNameInput");
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };

  if (isLoading || !username) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <UserHeader username={username} />
        <StatsDashboard username={username} />

        <TouchableOpacity
          className="m-4 p-4 bg-red-900 rounded-lg items-center"
          onPress={handleClearStorage}
        >
          <Text className="text-white font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
