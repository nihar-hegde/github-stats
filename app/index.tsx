import { Link } from "expo-router";
import { Text, View } from "react-native";
export default function Index() {
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
