import axios from "axios";

const BASE_URL = "https://api.github.com";

export const fetchGitHubUser = async (username: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${username}`);
    const data = await response.data;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user data. Please check the username.");
  }
};
