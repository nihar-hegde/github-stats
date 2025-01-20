import UserHeader from "@/components/UserProfile";
import { getUserName } from "@/utils/localStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
      console.log("pressed button");
      setUsername(undefined);
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 pt-5 bg-black">
      <View>{username && <UserHeader username={username} />}</View>
      <TouchableOpacity className="mt-10  " onPress={handleClearStorage}>
        <Text className="text-white font-bold text-xl">
          Clear local storage
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
