import { getUserName } from "@/utils/localStorage";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [username, setUsername] = useState<string | undefined>();
  useEffect(() => {
    const userName = async () => {
      const username = await getUserName();
      setUsername(username!);
    };
    userName();
  }, []);

  return (
    <View className="flex-1 items-center justify-center  ">
      <Text className="text-3xl font-bold text-blue-300">
        Edit app/index.tsx to edit this screen.
      </Text>
      <Text className="font-bold text-2xl text-black">{username}</Text>
      <Link href={"/userNameInput"} className="text-xl font-bold ">
        Go to UserNameInput
      </Link>
    </View>
  );
}
