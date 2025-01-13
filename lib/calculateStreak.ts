// lib/calculateStreak.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const calculateStreak = async (repos: any[]): Promise<number> => {
  // Get all commit dates from repos
  const username = await AsyncStorage.getItem("github_username");
  if (!username) return 0;

  try {
    // Fetch user's events (includes commit data)
    const eventsResponse = await fetch(
      `https://api.github.com/users/${username}/events`
    );
    const events = await eventsResponse.json();

    // Filter push events (commits) and extract dates
    const commitDates = events
      .filter((event: any) => event.type === "PushEvent")
      .map((event: any) => {
        return new Date(event.created_at).toISOString().split("T")[0];
      })
      .sort()
      .reverse(); // Most recent first

    if (commitDates.length === 0) return 0;

    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Convert current date to YYYY-MM-DD format
    const currentDateStr = currentDate.toISOString().split("T")[0];

    // If no commit today, check if there was one yesterday to continue the streak
    if (commitDates[0] !== currentDateStr) {
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (!commitDates.includes(yesterdayStr)) {
        return 0; // Streak broken
      }
    }

    // Calculate streak
    let checkDate = new Date(currentDate);
    let streakBroken = false;

    while (!streakBroken) {
      const checkDateStr = checkDate.toISOString().split("T")[0];
      if (commitDates.includes(checkDateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        streakBroken = true;
      }
    }

    return currentStreak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 0;
  }
};
