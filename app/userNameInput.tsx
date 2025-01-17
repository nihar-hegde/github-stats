import { View, Text, SafeAreaView, TextInput } from "react-native";
import React, { useState } from "react";

const UserNameInput = () => {
  const [userName, setUserName] = useState("");
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 flex flex-col gap-4 items-center justify-center p-4">
        <Text className="text-2xl font-bold text-white">
          Enter Your Github UserName
        </Text>
        <TextInput
          className="w-80 bg-white rounded-2xl"
          placeholder="Enter Username..."
          placeholderTextColor={"#000000"}
          value={userName}
          onChangeText={(text) => setUserName(text)}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserNameInput;
