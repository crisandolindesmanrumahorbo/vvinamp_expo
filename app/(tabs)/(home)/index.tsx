import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { defaultStyles } from "@/styles";
import { screenPadding } from "@/constants/tokens";
import { TracksList } from "@/components/TrackList";
import { generateTracksListId } from "@/helpers/miscellaneous";
import TrackPlayer, { TrackType } from "react-native-track-player";
import { useConstants } from "@/store/constants";

interface ITrack {
  url: string;
  title: string;
  artis: string;
}
export default function Index() {
  const { baseUrl: API_URL } = useConstants();

  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const updatePlayerQueue = async () => {
      if (tracks.length === 0) return;

      try {
        const currentQueue = await TrackPlayer.getQueue();

        const isSameTracks =
          currentQueue.length === tracks.length &&
          tracks.every(
            (track, index) => track.url === (currentQueue[index] as any)?.url,
          );

        if (isSameTracks) {
          console.log("Tracks unchanged - skipping queue update");
          return;
        }

        await TrackPlayer.reset();
        await TrackPlayer.add(tracks);
        console.log("Queue updated with new tracks");
      } catch (error) {
        console.error("Queue update error:", error);
      }
    };

    // update queue if the tracks changed
    updatePlayerQueue();
  }, [tracks]);
  const fetchTracks = useCallback(async () => {
    try {
      setError(false);

      const response = await fetch(`${API_URL}/track`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      if (json.length > 0) {
        const track_data = json.map((track: ITrack) => ({
          url: `${API_URL}/playlist?song=${encodeURIComponent(track.title)}`,
          title: track.title,
          artis: "Unknown",
          artwork: require("@/assets/images/vvinamp.png"),
          type: TrackType.HLS,
          headers: {
            "User-Agent": "ExpoHLSPlayer/1.0.0",
          },
        }));
        setTracks(track_data);
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setTracks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [API_URL]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return (
    <View style={defaultStyles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ paddingHorizontal: screenPadding.horizontal }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error ? (
          <Text className="text-red-500 text-center mt-4">
            Failed to load data. Pull down to retry.
          </Text>
        ) : (
          <TracksList
            id={generateTracksListId("songs", "s")}
            tracks={tracks}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
}
