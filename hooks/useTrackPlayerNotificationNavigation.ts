import { useEffect } from "react";
import { Linking } from "react-native";
import { useRouter } from "expo-router";

const useTrackPlayerNotificationNavigation = () => {
  const router = useRouter();
  useEffect(() => {
    // Handle initial URL when app is launched via notification click
    Linking.getInitialURL().then((url) => {
      if (url === "trackplayer://notification.click") {
        // Navigate to player screen or perform specific action
        console.log("Notification clicked - app launched!");
      }
    });

    // Handle URL when app is already running and notification is clicked
    const handleUrl = ({ url }: { url: string }) => {
      if (url === "trackplayer://notification.click") {
        // Navigate to player screen or perform specific action
        console.log("Notification clicked - app already running!");
        router.navigate("/player");
      }
    };

    Linking.addEventListener("url", handleUrl);

    return () => {
      Linking.removeAllListeners("");
    };
  }, []);
};
export default useTrackPlayerNotificationNavigation;
