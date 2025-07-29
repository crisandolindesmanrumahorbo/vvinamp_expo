import { useState } from "react";
import {
  View,
  Text,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Alert,
  ActivityIndicator,
} from "react-native";
import { defaultStyles } from "@/styles";

import { useNavigationSearch } from "@/hooks/useNavigationSearch";
import { useHeaderHeight } from "@react-navigation/elements";
import YoutubeList from "@/components/YoutubeList";
import { useConstants } from "@/store/constants";

export default function Search() {
  const { baseUrl: API_URL } = useConstants();
  const headerHeight = useHeaderHeight();

  useNavigationSearch({
    searchBarOptions: {
      placeholder: "Find in songs",
      onSearchButtonPress: async (
        e: NativeSyntheticEvent<TextInputFocusEventData>,
      ) => {
        console.log(e.nativeEvent.text);
        await handleSearch(e.nativeEvent.text);
      },
    },
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a search query");
      return;
    }

    setLoading(true);
    try {
      const url = `${API_URL}/search?title=${encodeURIComponent(searchQuery)}`;
      console.log(url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResults(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[defaultStyles.container, { paddingTop: headerHeight }]}>
      {/* <ScrollView */}
      {/*   contentInsetAdjustmentBehavior="automatic" */}
      {/*   style={{ paddingHorizontal: screenPadding.horizontal }} */}
      {/* > */}
      {loading ? (
        <View className="flex flex-col gap-2 items-center">
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>It will take a while...</Text>
        </View>
      ) : (
        <YoutubeList ytbs={results} isLoading={loading} />
      )}
    </View>
  );
}

const ytbs = [
  {
    title: "Harry Styles - Sweet Creature (Audio)",
    view_count: 72361403,
    duration_string: "3:46",
    channel: "Harry Styles",
    channel_is_verified: true,
    thumbnail: "https://i.ytimg.com/vi/8uD6s-X3590/maxresdefault.jpg",
    webpage_url: "https://www.youtube.com/watch?v=8uD6s-X3590",
  },
  {
    title: "Harry Styles   Sweet Creature Audio",
    view_count: 51,
    duration_string: "3:46",
    channel: "Harry Styles 2017",
    channel_is_verified: null,
    thumbnail: "https://i.ytimg.com/vi/TTjCGU1HTF0/maxresdefault.jpg",
    webpage_url: "https://www.youtube.com/watch?v=TTjCGU1HTF0",
  },
  {
    title: "Harry Styles - Sweet Creature (Audio)",
    view_count: 72361403,
    duration_string: "3:46",
    channel: "Harry Styles",
    channel_is_verified: true,
    thumbnail: "https://i.ytimg.com/vi/8uD6s-X3590/maxresdefault.jpg",
    webpage_url: "https://www.youtube.com/watch?v=8uD6s-X3590",
  },
  {
    title: "Harry Styles   Sweet Creature Audio",
    view_count: 51,
    duration_string: "3:46",
    channel: "Harry Styles 2017",
    channel_is_verified: null,
    thumbnail: "https://i.ytimg.com/vi/TTjCGU1HTF0/maxresdefault.jpg",
    webpage_url: "https://www.youtube.com/watch?v=TTjCGU1HTF0",
  },
  {
    title: "Harry Styles - Sweet Creature (Audio)",
    view_count: 72361403,
    duration_string: "3:46",
    channel: "Harry Styles",
    channel_is_verified: true,
    thumbnail: "https://i.ytimg.com/vi/8uD6s-X3590/maxresdefault.jpg",
    webpage_url: "https://www.youtube.com/watch?v=8uD6s-X3590",
  },
  {
    title: "Harry Styles   Sweet Creature Audio",
    view_count: 51,
    duration_string: "3:46",
    channel: "Harry Styles 2017",
    channel_is_verified: null,
    thumbnail: "https://i.ytimg.com/vi/TTjCGU1HTF0/maxresdefault.jpg",
    webpage_url: "https://www.youtube.com/watch?v=TTjCGU1HTF0",
  },
  {
    title: "Harry Styles - Sweet Creature (Audio)",
    view_count: 72361403,
    duration_string: "3:46",
    channel: "Harry Styles",
    channel_is_verified: true,
    thumbnail: "https://i.ytimg.com/vi/8uD6s-X3590/maxresdefault.jpg",
    webpage_url: "https://www.youtube.com/watch?v=8uD6s-X3590",
  },
  {
    title: "Harry Styles   Sweet Creature Audio",
    view_count: 51,
    duration_string: "3:46",
    channel: "Harry Styles 2017",
    channel_is_verified: null,
    thumbnail: "https://i.ytimg.com/vi/TTjCGU1HTF0/maxresdefault.jpg",
    webpage_url: "https://www.youtube.com/watch?v=TTjCGU1HTF0",
  },
  {
    title: "Harry Styles - Sweet Creature (Audio)",
    view_count: 72361403,
    duration_string: "3:46",
    channel: "Harry Styles",
    channel_is_verified: true,
    thumbnail: "https://i.ytimg.com/vi/8uD6s-X3590/maxresdefault.jpg",
    webpage_url: "https://www.youtube.com/watch?v=8uD6s-X3590",
  },
  {
    title: "Harry Styles   Sweet Creature Audio",
    view_count: 51,
    duration_string: "3:46",
    channel: "Harry Styles 2017",
    channel_is_verified: null,
    thumbnail: "https://i.ytimg.com/vi/TTjCGU1HTF0/maxresdefault.jpg",
    webpage_url: "https://www.youtube.com/watch?v=TTjCGU1HTF0",
  },
];
