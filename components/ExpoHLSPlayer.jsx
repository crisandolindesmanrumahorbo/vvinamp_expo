import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Dimensions,
} from "react-native";
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  TrackType,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import Slider from "@react-native-community/slider";

const ExpoHLSPlayer = () => {
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  // HLS tracks configuration
  const tracks = [
    {
      id: "memori-baik",
      url: "http://192.168.1.6:3001/playlist?song=memori-baik",
      title: "Memori Baik",
      artist: "Artist Name",
      type: TrackType.HLS, // This is crucial for HLS streaming
      artwork: "https://via.placeholder.com/300x300.png?text=Memori+Baik",
      headers: {
        "User-Agent": "ExpoHLSPlayer/1.0.0",
      },
    },
    {
      id: "sweet-creature",
      url: "http://192.168.1.6:3001/playlist?song=Harry%20Styles%20-%20Sweet%20Creature%20%28Audio%29",
      title: "Sweet Creature",
      artist: "Artist Name",
      type: TrackType.HLS, // This is crucial for HLS streaming
      artwork: "https://via.placeholder.com/300x300.png?text=Memori+Baik",
      headers: {
        "User-Agent": "ExpoHLSPlayer/1.0.0",
      },
    },
    // {
    //   id: "another-song",
    //   url: "http://192.168.1.6:3001/playlist/another-song.m3u8",
    //   title: "Another Song",
    //   artist: "Another Artist",
    //   type: TrackType.HLS,
    //   artwork: "https://via.placeholder.com/300x300.png?text=Another+Song",
    // },
  ];

  // Setup player
  const setupPlayer = async () => {
    try {
      // Setup player with streaming-optimized settings
      await TrackPlayer.setupPlayer({
        // Smaller buffers for better streaming performance
        maxCacheSize: 10 * 1024 * 1024, // 1MB cache
        // playBuffer: 10000, // 15 seconds
        // minBuffer: 10000, // 5 seconds
        // maxBuffer: 10000, // 30 seconds
        // backBuffer: 10000, // 10 seconds
      });

      // Configure capabilities
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
      });

      // Add tracks
      await TrackPlayer.add(tracks);

      // Set repeat mode
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);

      setIsPlayerReady(true);
      console.log("Player setup complete");
    } catch (error) {
      console.error("Player setup failed:", error);
      Alert.alert("Error", "Failed to setup player: " + error.message);
    }
  };

  // Player event handlers
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async (event) => {
    if (
      event.type === Event.PlaybackActiveTrackChanged &&
      event.index !== undefined
    ) {
      const track = await TrackPlayer.getTrack(event.index);
      setCurrentTrack(track);
      console.log("Track changed to:", track?.title);
    }
  });

  useTrackPlayerEvents([Event.PlaybackError], async (event) => {
    console.error("Playback error:", event);
    Alert.alert("Playback Error", "Error playing track: " + event.message);
  });

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    console.log("Playback state changed:", event.state);
  });

  // Control functions
  const play = async () => {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error("Play failed:", error);
      Alert.alert("Error", "Failed to play: " + error.message);
    }
  };

  const pause = async () => {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error("Pause failed:", error);
    }
  };

  const stop = async () => {
    try {
      await TrackPlayer.stop();
    } catch (error) {
      console.error("Stop failed:", error);
    }
  };

  const skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error("Skip to next failed:", error);
    }
  };

  const skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error("Skip to previous failed:", error);
    }
  };

  const seekTo = async (position) => {
    try {
      await TrackPlayer.seekTo(position);
    } catch (error) {
      console.error("Seek failed:", error);
    }
  };

  // Initialize player on component mount
  useEffect(() => {
    setupPlayer();

    // Cleanup on unmount
    return () => {
      TrackPlayer.reset();
    };
  }, []);

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HLS Music Player</Text>

      {/* Player Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {isPlayerReady ? "Ready" : "Loading..."}
        </Text>
        <Text style={styles.statusText}>
          State: {playbackState.state || "Unknown"}
        </Text>
      </View>

      {/* Current Track Info */}
      {currentTrack && (
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
          <Text style={styles.trackType}>Type: {currentTrack.type}</Text>
        </View>
      )}

      {/* Progress Bar */}
      {/* <View style={styles.progressContainer}> */}
      {/*   <Text style={styles.timeText}>{formatTime(progress.position)}</Text> */}
      {/*   <View style={styles.progressBar}> */}
      {/*     <View */}
      {/*       style={[ */}
      {/*         styles.progressFill, */}
      {/*         { */}
      {/*           width: `${(progress.position / progress.duration) * 100 || 0}%`, */}
      {/*         }, */}
      {/*       ]} */}
      {/*     /> */}
      {/*   </View> */}
      {/*   <Text style={styles.timeText}>{formatTime(progress.duration)}</Text> */}
      {/* </View> */}

      <View>
        <Slider
          style={styles.progressBar}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          thumbTintColor="#FFD369"
          minimumTrackTintColor="#FFD369"
          maximumTrackTintColor="#fff"
          onSlidingComplete={async (value) => await TrackPlayer.seekTo(value)}
        />
        <View style={styles.progressLevelDuraiton}>
          <Text style={styles.progressLabelText}>
            {new Date(progress.position * 1000)
              .toLocaleTimeString()
              .substring(3)}
          </Text>
          <Text style={styles.progressLabelText}>
            {new Date((progress.duration - progress.position) * 1000)
              .toLocaleTimeString()
              .substring(3)}
          </Text>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controls}>
        <Button title="Previous" onPress={skipToPrevious} />
        <Button
          title={playbackState.state === State.Playing ? "Pause" : "Play"}
          onPress={playbackState.state === State.Playing ? pause : play}
        />
        <Button title="Next" onPress={skipToNext} />
      </View>

      {/* Additional Controls */}
      <View style={styles.additionalControls}>
        <Button title="Stop" onPress={stop} />
        <Button
          title="Seek +10s"
          onPress={() => seekTo(progress.position + 10)}
        />
        <Button
          title="Seek -10s"
          onPress={() => seekTo(Math.max(0, progress.position - 10))}
        />
      </View>

      {/* Debug Info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Position: {formatTime(progress.position)}
        </Text>
        <Text style={styles.debugText}>
          Duration: {formatTime(progress.duration)}
        </Text>
        <Text style={styles.debugText}>
          Buffered: {formatTime(progress.buffered)}
        </Text>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 5,
  },
  trackInfo: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  trackArtist: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  trackType: {
    fontSize: 12,
    color: "#999",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  timeText: {
    fontSize: 12,
    width: 40,
    textAlign: "center",
  },
  progressBar: {
    alignSelf: "stretch",
    marginTop: 40,
    marginLeft: 5,
    marginRight: 5,
  },
  progressLevelDuraiton: {
    width: width,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabelText: {
    color: "#FFF",
  },
  // progressBar: {
  //   flex: 1,
  //   height: 4,
  //   backgroundColor: "#ddd",
  //   borderRadius: 2,
  //   marginHorizontal: 10,
  // },
  // progressFill: {
  //   height: "100%",
  //   backgroundColor: "#007AFF",
  //   borderRadius: 2,
  // },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  additionalControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  debugInfo: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  debugText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
});

export default ExpoHLSPlayer;
