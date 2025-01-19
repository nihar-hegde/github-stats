import AsyncStorage from "@react-native-async-storage/async-storage";

export const setUserNameToLocalStorage = async (username: string) => {
  try {
    await AsyncStorage.setItem("username", username);
  } catch (error) {
    console.error(error);
  }
};

// get username from async storage

export const getUserName = async () => {
  try {
    const value = await AsyncStorage.getItem("username");
    return value;
  } catch (error) {
    console.error(error);
  }
};
