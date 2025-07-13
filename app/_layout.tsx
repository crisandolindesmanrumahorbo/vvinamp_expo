import { Stack } from "expo-router";
import { Fragment, useEffect } from "react";
import TrackPlayer from "react-native-track-player";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  useEffect(() => {
    TrackPlayer.registerPlaybackService(() => require("../rntp-service"));
  }, []);
  return (
    <Fragment>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </Fragment>
  );
}
