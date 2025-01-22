// app/(tabs)/index.tsx
import UserHeader from "@/components/UserProfile";
import StatsDashboard from "@/components/StatsDashboard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/signin");
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <UserHeader />
        <StatsDashboard />

        <TouchableOpacity
          className="m-4 p-4 bg-red-900 rounded-lg items-center"
          onPress={handleSignOut}
        >
          <Text className="text-white font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
