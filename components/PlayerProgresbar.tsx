import { colors, fontSize } from "@/constants/tokens";
import { formatSecondsToMinutes } from "@/helpers/miscellaneous";
import { defaultStyles, utilsStyles } from "@/styles";
import { StyleSheet, Text, View, ViewProps } from "react-native";
// import { useSharedValue } from "react-native-reanimated";
import TrackPlayer, { useProgress } from "react-native-track-player";
import Slider from "@react-native-community/slider";

export const PlayerProgressBar = ({ style }: ViewProps) => {
  const { duration, position } = useProgress(250);
  //
  // const isSliding = useSharedValue(false);
  // const progress = useSharedValue(0);
  // const min = useSharedValue(0);
  // const max = useSharedValue(1);
  //
  const trackElapsedTime = formatSecondsToMinutes(position);
  const trackRemainingTime = formatSecondsToMinutes(duration - position);
  //
  // if (!isSliding.value) {
  //   progress.value = duration > 0 ? position / duration : 0;
  // }

  return (
    <View style={style}>
      <Slider
        style={styles.progressBar}
        value={position}
        minimumValue={0}
        maximumValue={duration}
        thumbTintColor="#FFD369"
        minimumTrackTintColor="#FFD369"
        maximumTrackTintColor="#fff"
        onSlidingComplete={async (value) => await TrackPlayer.seekTo(value)}
      />

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{trackElapsedTime}</Text>

        <Text style={styles.timeText}>
          {"-"} {trackRemainingTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    alignSelf: "stretch",
    marginTop: 40,
    marginLeft: 5,
    marginRight: 5,
    height: 7,
    borderRadius: 16,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 20,
  },
  timeText: {
    ...defaultStyles.text,
    color: colors.text,
    opacity: 0.75,
    fontSize: fontSize.xs,
    letterSpacing: 0.7,
    fontWeight: "500",
  },
});
