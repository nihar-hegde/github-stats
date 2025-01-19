import { getUserName } from "@/utils/localStorage";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

const TabsLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasUsername, setHasUsername] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUsername = async () => {
      try {
        const username = await getUserName();
        if (username) {
          setHasUsername(true);
        } else {
          router.replace("/userNameInput");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUsername();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} color={"#0066cc"} />
      </View>
    );
  }

  if (!hasUsername) {
    return null;
  }

  return <Slot />;
};

export default TabsLayout;
