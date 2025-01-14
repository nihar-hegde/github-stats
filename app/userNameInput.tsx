import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";

const UserNameInput = () => {
  const [username, setUsername] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const showAnimation = Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    // Handle keyboard events
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setTimeout(() => {
          // Get the keyboard height
          const keyboardHeight = e.endCoordinates.height;
          // Scroll the content up by the keyboard height
          scrollViewRef.current?.scrollTo({
            y: keyboardHeight,
            animated: true,
          });
        }, 100);
      },
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: 0,
            animated: true,
          });
        }, 100);
      },
    );

    // Start the animation
    showAnimation.start();

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const handleInputFocus = () => {
    setIsInputFocused(true);
    setTimeout(() => {
      // When input is focused, scroll to show the input field
      scrollViewRef.current?.scrollTo({
        y: Platform.OS === "ios" ? 200 : 150, // Adjust these values based on your layout
        animated: true,
      });
    }, 100);
  };

  const handleContinue = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }, 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            className="flex-1 justify-center px-8"
            style={[
              {
                opacity,
                transform: [{ translateY }],
              },
            ]}
          >
            <View className="mb-8">
              <Octicons name="mark-github" size={48} color="#fff" />
            </View>
            <Text className="text-3xl font-bold text-white mb-2">
              Welcome to GitHub
            </Text>
            <Text className="text-lg text-gray-400 mb-8">
              Enter your GitHub username to get started
            </Text>
            <View
              className={`border-b-2 ${
                isInputFocused ? "border-blue-500" : "border-gray-700"
              } mb-8`}
            >
              <TextInput
                className="text-white text-lg py-2"
                placeholder="Username"
                placeholderTextColor="#6b7280"
                value={username}
                onChangeText={setUsername}
                onFocus={handleInputFocus}
                onBlur={() => setIsInputFocused(false)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              className="bg-blue-600 py-3 px-4 rounded-lg"
              onPress={handleContinue}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Continue
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserNameInput;
