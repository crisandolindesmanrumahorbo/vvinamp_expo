import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ITrack {
  title: string;
  durtaion: string;
}
export default function Search() {
  const [tracks, setTracks] = useState<ITrack[]>([]);
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch("http://192.168.1.6:3001/track");
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setTracks(json);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchTracks();
  }, []);
  return (
    <SafeAreaView className="flex-1">
      <View className="p-4">
        {tracks.map((track, i) => (
          <Text key={i} className="text-black">
            {track.title}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
}
