import { Stack, SplashScreen } from "expo-router";
import TrackPlayer from "react-native-track-player";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import PlaybackService from "@/constants/playbackService";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSetupTrackPlayer } from "@/hooks/useSetupTrackPlayer";
import { useLogTrackPlayerState } from "@/hooks/useLogTrackPlayerState";
import { useCallback } from "react";
import useTrackPlayerNotificationNavigation from "@/hooks/useTrackPlayerNotificationNavigation";

TrackPlayer.registerPlaybackService(() => PlaybackService);

export default function RootLayout() {
  const handleTrackPlayerLoaded = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  useSetupTrackPlayer({
    onLoad: handleTrackPlayerLoaded,
  });

  //hanlde notification clicked
  useTrackPlayerNotificationNavigation();

  useLogTrackPlayerState();
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <Stack.Screen
            name="player"
            options={{
              presentation: "card",
              gestureEnabled: true,
              gestureDirection: "vertical",
              animationDuration: 400,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="log"
            options={{
              presentation: "card",
              gestureEnabled: true,
              gestureDirection: "vertical",
              animationDuration: 400,
              headerShown: true,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
