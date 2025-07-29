import { useEffect, useRef } from "react";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
} from "react-native-track-player";

const setupPlayer = async () => {
  await TrackPlayer.setupPlayer({
    maxCacheSize: 10 * 1024 * 1024, // 1MB cache
  });

  await TrackPlayer.updateOptions({
    // Streaming capabilities
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
      Capability.Stop,
    ],
    // Compact capabilities for notification
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
    // Notification config
    notificationCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
    // Progress update events
    progressUpdateEventInterval: 2, // Update every 2 seconds
    // android: {
    //   appKilledPlaybackBehavior:
    //     AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    //   alwaysPauseOnInterruption: true,
    // },
  });

  await TrackPlayer.setVolume(0.3); // not too loud
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
};

export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    console.log("init ", isInitialized.current);
    if (isInitialized.current) return;

    setupPlayer()
      .then(() => {
        isInitialized.current = true;
        onLoad?.();
      })
      .catch((error) => {
        isInitialized.current = false;
        console.error(error);
      });
  }, [onLoad]);
};
