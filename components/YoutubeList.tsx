import { defaultStyles, utilsStyles } from "@/styles";
import { Image } from "expo-image";
import { colors, fontSize, screenPadding } from "@/constants/tokens";
import {
  StyleSheet,
  FlatList,
  Text,
  TouchableHighlight,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { formatNumberCompact } from "@/helpers/numbers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import LoaderKit from "react-native-loader-kit";
import { useConstants } from "@/store/constants";

const ItemDivider = () => (
  <View
    style={{ ...utilsStyles.itemSeparator, marginVertical: 9, marginLeft: 60 }}
  />
);

interface IYoutubeQuery {
  title: string;
  view_count: number;
  duration_string: string;
  channel: string;
  channel_is_verified: boolean | null;
  thumbnail: string;
  webpage_url: string;
}

export default function YoutubeList({
  ytbs,
  isLoading,
}: {
  ytbs: IYoutubeQuery[];
  isLoading: boolean;
}) {
  const router = useRouter();
  const { baseUrl: API_URL } = useConstants();
  const [loadingDownload, setLoading] = useState(false);

  const handleTrackSelect = async (yt: IYoutubeQuery) => {
    console.log("donwloading...");

    setLoading(true);
    try {
      const url = `${API_URL}/download`;
      console.log(url);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: yt.title,
          youtube_url: yt.webpage_url,
        }),
      };
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data) {
        router.navigate("/log");
      }
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  };
  return (
    <FlatList
      data={ytbs}
      ListFooterComponent={renderFooter}
      contentContainerStyle={{
        paddingTop: 10,
        paddingBottom: 128,
        paddingHorizontal: screenPadding.horizontal,
      }}
      // ListHeaderComponent={
      //   !hideQueueControls ? (
      //     <QueueControls tracks={tracks} style={{ paddingBottom: 20 }} />
      //   ) : undefined
      // }
      // ListFooterComponent={ItemDivider}
      ItemSeparatorComponent={ItemDivider}
      ListEmptyComponent={
        <View>
          <Image
            style={utilsStyles.emptyContentImage}
            source={require("@/assets/images/vvinamp.png")}
          />
          <Text style={utilsStyles.emptyContentText}>Search your mood lae</Text>
        </View>
      }
      renderItem={({ item: ytb }) => (
        <TouchableHighlight onPress={() => handleTrackSelect(ytb)}>
          <View style={styles.trackItemContainer}>
            {/* <View> */}
            {/*   <Image */}
            {/*     style={{ */}
            {/*       ...styles.trackArtworkImage, */}
            {/*     }} */}
            {/*     source={ytb.thumbnail} */}
            {/*   /> */}
            {/* </View> */}
            <View>
              <Image
                style={{
                  ...styles.trackArtworkImage,
                  opacity: loadingDownload ? 0.5 : 1,
                }}
                source={ytb.thumbnail}
              />

              {loadingDownload && (
                <LoaderKit
                  style={styles.trackPlayingIconIndicator}
                  name="BallPulse"
                  color={colors.icon}
                />
              )}
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Track title + artist */}
              <View className="w-full flex-col gap-1">
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.trackTitleText,
                    color: colors.text,
                  }}
                >
                  {ytb.title}
                </Text>

                <View className="flex-row gap-1 items-center">
                  <Text>{ytb.channel}</Text>
                  {ytb.channel_is_verified && (
                    <MaterialIcons name="verified" size={12} color="white" />
                  )}
                </View>
                <View className="flex-row gap-2 items-center">
                  <Text>{ytb.duration_string}</Text>
                  <Text>{formatNumberCompact(ytb.view_count)} x ditonton</Text>
                </View>
              </View>

              {/* <StopPropagation> */}
              {/*   <TrackShortcutsMenu track={track}> */}
              {/*     <Entypo */}
              {/*       name="dots-three-horizontal" */}
              {/*       size={18} */}
              {/*       color={colors.icon} */}
              {/*     /> */}
              {/*   </TrackShortcutsMenu> */}
              {/* </StopPropagation> */}
            </View>
          </View>
        </TouchableHighlight>
      )}
    />
  );
}

const styles = StyleSheet.create({
  trackItemContainer: {
    flexDirection: "row",
    columnGap: 14,
    alignItems: "center",
    paddingRight: 20,
  },
  trackPlayingIconIndicator: {
    position: "absolute",
    top: 18,
    left: 16,
    width: 16,
    height: 16,
  },
  trackPausedIndicator: {
    position: "absolute",
    top: 14,
    left: 14,
  },
  trackArtworkImage: {
    borderRadius: 8,
    width: 50,
    height: 50,
  },
  trackTitleText: {
    ...defaultStyles.text,
    fontSize: fontSize.sm,
    fontWeight: "600",
    maxWidth: "90%",
  },
  trackArtistText: {
    ...defaultStyles.text,
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
});
