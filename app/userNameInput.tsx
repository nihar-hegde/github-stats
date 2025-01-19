import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { setUserNameToLocalStorage } from "@/utils/localStorage";
import { useRouter } from "expo-router";

const UserNameInput = () => {
  const [userName, setUserName] = useState("");
  const router = useRouter();

  const handlePress = async () => {
    try {
      await setUserNameToLocalStorage(userName);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 items-center justify-center px-6 w-full">
          {/* Titele Section */}
          <Text className="text-3xl font-bold text-gray-100 mb-6">
            Welcome To GitHub Stats!
          </Text>
          <Text className="text-lg text-gray-400 mb-8 text-center w-full">
            Enter your GitHub UserName to explore your GitHub Stats!
          </Text>

          {/* Input Section */}
          <TextInput
            className="w-full bg-[#1E1E1E] text-white p-4 rounded-lg text-base"
            placeholder="Enter your GitHub UserName..."
            placeholderTextColor={"#666"}
            value={userName}
            onChangeText={(text) => setUserName(text)}
            keyboardType="default"
          />
          {/* Button Section */}
          <TouchableOpacity
            onPress={handlePress}
            disabled={!userName.trim()}
            className={`${userName.trim() ? "bg-[#0066cc]" : "bg-[#333333]"} mt-6 w-full py-4 rounded-lg items-center`}
          >
            <Text className="text-white text-lg font-semibold">Submit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserNameInput;
