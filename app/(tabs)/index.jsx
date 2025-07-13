import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import TrackPlayer, {
  Capability,
  State,
  Event,
  TrackType,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  AppKilledPlaybackBehavior,
} from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import ExpoHLSPlayer from "../../components/ExpoHLSPlayer";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ExpoHLSPlayer />

      {/* <MusicPlayer /> */}
    </View>
  );
}
export const API_URL = "http://192.168.1.6:3001";

const podcasts = [
  {
    title: "Memori Baik",
    artist: "Serafina",
    // artwork: require("./assets/images/icon.jpg"),
    url: "http://192.168.1.6:3001/playlist/memori-baik",
    // Key settings for streaming
    headers: {
      Accept: "audio/mpeg",
      "Accept-Encoding": "identity",
      Connection: "keep-alive",
    },
    type: TrackType.HLS,
  },
  {
    title: "143 - Intelligenza Artificiale Generativa con Jacopo Perfetti",
    artist: "Hacking Creativity",

    url: "https://chtbl.com/track/9E947E/api.spreaker.com/download/episode/52096290/def_hc_perfetti_v2_loud.mp3",
    headers: {
      Accept: "audio/mpeg",
      "Accept-Encoding": "identity",
      Connection: "keep-alive",
    },
    type: TrackType.HLS,

    // Force streaming behavior
    isLiveStream: true, // This tells RNTP to treat it as a stream
    duration: undefined, // Don't set duration to force streaming
  },
  {
    title: "Sweet Creature",
    artist: "Harry Styles",
    // artwork: require("./assets/images/icon.jpg"),
    url: "http://192.168.1.6:3001/playlist/Harry%20Styles%20-%20Sweet%20Creature%20%28Audio%29%0A",
    // Key settings for streaming
    headers: {
      Accept: "audio/mpeg",
      "Accept-Encoding": "identity",
      Connection: "keep-alive",
    },
    type: TrackType.HLS,
  },
];

function MusicPlayer() {
  const podcastsCount = podcasts.length;
  const [trackIndex, setTrackIndex] = useState(0);
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();

  const playBackState = usePlaybackState();
  const progress = useProgress();

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer({
        maxCacheSize: 512 * 1024, // 512KB max cache
        // playBuffer: 2000, // 10 seconds play buffer
        // minBuffer: 2000, // 2 seconds min buffer
        // maxBuffer: 15000, // 15 seconds max buffer
      });
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo, // Important for streaming
        ],
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
          alwaysPauseOnInterruption: true,
        },
      });
      await TrackPlayer.add(podcasts);
      await gettrackdata();
      await TrackPlayer.play();
    } catch (error) {
      console.log(error);
    }
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const { title, artist } = track;
      console.log(event.nextTrack);
      setTrackIndex(event.nextTrack);
      setTrackTitle(title);
      setTrackArtist(artist);
      // setTrackArtwork(artwork);
    }
  });

  const gettrackdata = async () => {
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    console.log(trackIndex);
    setTrackIndex(trackIndex);
    setTrackTitle(trackObject.title);
    setTrackArtist(trackObject.artist);
  };

  const togglePlayBack = async (playBackState) => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    console.log({
      playBackState,
      currentTrack,
      statepaused: State.Paused,
      is: playBackState === State.Paused,
    });

    if (currentTrack != null) {
      if (
        playBackState.state === State.Paused ||
        playBackState === State.Ready
      ) {
        await TrackPlayer.play();
        console.log("play");
      } else {
        console.log("pausr");

        await TrackPlayer.pause();
      }
    }
  };

  const nexttrack = async () => {
    if (trackIndex < podcastsCount - 1) {
      await TrackPlayer.skipToNext();
      gettrackdata();
    }
  };

  const previoustrack = async () => {
    if (trackIndex > 0) {
      await TrackPlayer.skipToPrevious();
      gettrackdata();
    }
  };

  useEffect(() => {
    setupPlayer();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.mainWrapper}></View>
        <View style={styles.songText}>
          <Text
            style={[styles.songContent, styles.songTitle]}
            numberOfLines={3}
          >
            {trackTitle}
          </Text>
          <Text
            style={[styles.songContent, styles.songArtist]}
            numberOfLines={2}
          >
            {trackArtist}
          </Text>
        </View>
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
        <View style={styles.musicControlsContainer}>
          <TouchableOpacity onPress={previoustrack}>
            <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
            <Ionicons
              name={
                playBackState === State.Playing
                  ? "pause-circle"
                  : playBackState === State.Connecting
                    ? "caret-down-circle"
                    : "play-circle"
              }
              size={75}
              color="#FFD369"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={nexttrack}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color="#FFD369"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  mainWrapper: {
    width: width,
    height: width,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    alignSelf: "center",
    width: "90%",
    height: "90%",
    borderRadius: 15,
  },
  songText: {
    marginTop: 2,
    height: 70,
  },
  songContent: {
    textAlign: "center",
    color: "#EEEEEE",
  },
  songTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  songArtist: {
    fontSize: 16,
    fontWeight: "300",
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
  musicControlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    width: "60%",
  },
});
