import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

const UserNameInput = () => {
  const [userName, setUserName] = useState("");
  const handlePress = () => {
    console.log(userName);
  };
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
        <TouchableOpacity
          onPress={handlePress}
          className="bg-gray-600 p-4 w-80 flex items-center justify-center rounded-full  "
        >
          <Text className="text-white text-xl font-bold">Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserNameInput;
