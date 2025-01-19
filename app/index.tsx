import { getUserName } from "@/utils/localStorage";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkUsername = async () => {
    try {
      const result = await getUserName();
      if (result) {
        console.log("Username is: ", result);
        setLoading(false);
      } else {
        console.log("username not found...");
        router.replace("/userNameInput");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkUsername();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={"#0066cc"} />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center  ">
      <Text className="text-3xl font-bold text-blue-300">
        Edit app/index.tsx to edit this screen.
      </Text>
      <Link href={"/userNameInput"} className="text-xl font-bold ">
        Go to UserNameInput
      </Link>
    </View>
  );
}
