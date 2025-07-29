import { SafeAreaView } from "react-native-safe-area-context";
import { colors, screenPadding } from "@/constants/tokens";
import { defaultStyles } from "@/styles";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useHeaderButton } from "@/hooks/useHeaderButton";
import { Image } from "expo-image";
import { useConstants } from "@/store/constants";

type DownloadTask = {
  task_id: string;
  title: string;
  status: string;
  progress: number;
  log: string[];
};
// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// export const API_URL = "http://192.168.1.6:3001";

export default function LogScreen() {
  const { baseUrl: API_URL } = useConstants();

  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(
    new Set(),
  );
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const url = `${API_URL}/task-status`;
      console.log(url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log({ data });
      setResults(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };
  useHeaderButton({
    onRefreshPress: async () => {
      await getData();
    },
  });

  useEffect(() => {
    getData();
  }, []);

  const toggleExpand = (taskId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTaskIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) newSet.delete(taskId);
      else newSet.add(taskId);
      return newSet;
    });
  };

  const renderItem = ({ item }: { item: DownloadTask }) => {
    const expanded = expandedTaskIds.has(item.task_id);
    return (
      <View style={styles.taskContainer}>
        <TouchableOpacity onPress={() => toggleExpand(item.task_id)}>
          <View style={styles.header}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.status}>
              {item.status.toUpperCase()} ({item.progress}%)
            </Text>
          </View>
        </TouchableOpacity>
        {expanded && (
          <View style={styles.logContainer}>
            <ScrollView>
              <View>
                {item.log.map((line, idx) => (
                  <Text key={idx} style={styles.logLine}>
                    {line}
                  </Text>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View style={defaultStyles.container}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.task_id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View>
                <Text style={styles.emptyContentText}>No songs found</Text>
                <Image
                  style={styles.emptyContentImage}
                  source={require("@/assets/images/vvinamp.png")}
                />
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyContentText: {
    ...defaultStyles.text,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 20,
  },
  emptyContentImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 40,
    opacity: 0.3,
  },

  list: {
    paddingHorizontal: screenPadding.horizontal,
  },
  taskContainer: {
    borderRadius: 10,
    backgroundColor: "#1e1e1e",
    marginBottom: 16,
    padding: 12,
  },
  header: {
    flexDirection: "column",
    marginBottom: 4,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#fff",
  },
  status: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },
  logContainer: {
    marginTop: 10,
    backgroundColor: "#2a2a2a",
    padding: 8,
    borderRadius: 6,
    maxHeight: 300,
  },
  logLine: {
    color: "#d0d0d0",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
  },
});

const data = [
  {
    task_id: "91f446df-7d1b-4bed-a032-1af43430ddac",
    title: "Juicy Luicy - Lampu Kuning (Official Music Video)",
    status: "done",
    progress: 100,
    log: [
      "ffmpeg version 7.1.1 Copyright (c) 2000-2025 the FFmpeg developers",
      "  built with Apple clang version 17.0.0 (clang-1700.0.13.3)",
      "  configuration: --prefix=/opt/homebrew/Cellar/ffmpeg/7.1.1_3 --enable-shared --enable-pthreads --enable-version3 --cc=clang --host-cflags= --host-ldflags='-Wl,-ld_classic' --enable-ffplay --enable-gnutls --enable-gpl --enable-libaom --enable-libaribb24 --enable-libbluray --enable-libdav1d --enable-libharfbuzz --enable-libjxl --enable-libmp3lame --enable-libopus --enable-librav1e --enable-librist --enable-librubberband --enable-libsnappy --enable-libsrt --enable-libssh --enable-libsvtav1 --enable-libtesseract --enable-libtheora --enable-libvidstab --enable-libvmaf --enable-libvorbis --enable-libvpx --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxml2 --enable-libxvid --enable-lzma --enable-libfontconfig --enable-libfreetype --enable-frei0r --enable-libass --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-libspeex --enable-libsoxr --enable-libzmq --enable-libzimg --disable-libjack --disable-indev=jack --enable-videotoolbox --enable-audiotoolbox --enable-neon",
      "  libavutil      59. 39.100 / 59. 39.100",
      "  libavcodec     61. 19.101 / 61. 19.101",
      "  libavformat    61.  7.100 / 61.  7.100",
      "  libavdevice    61.  3.100 / 61.  3.100",
      "  libavfilter    10.  4.100 / 10.  4.100",
      "  libswscale      8.  3.100 /  8.  3.100",
      "  libswresample   5.  3.100 /  5.  3.100",
      "  libpostproc    58.  3.100 / 58.  3.100",
      "Input #0, mp3, from './mp3/Juicy Luicy - Lampu Kuning (Official Music Video).mp3':",
      "  Metadata:",
      "    encoder         : Lavf61.7.100",
      "  Duration: 00:04:15.24, start: 0.023021, bitrate: 125 kb/s",
      "  Stream #0:0: Audio: mp3 (mp3float), 48000 Hz, stereo, fltp, 125 kb/s",
      "      Metadata:",
      "        encoder         : Lavc61.19",
      "Stream mapping:",
      "  Stream #0:0 -> #0:0 (mp3 (mp3float) -> aac (native))",
      "Press [q] to stop, [?] for help",
      "[mpegts @ 0x12c90fd60] frame size not set",
      "Output #0, hls, to './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video).m3u8':",
      "  Metadata:",
      "    encoder         : Lavf61.7.100",
      "  Stream #0:0: Audio: aac (LC), 44100 Hz, stereo, fltp, 128 kb/s",
      "      Metadata:",
      "        encoder         : Lavc61.19.101 aac",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_000.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_001.ts' for writing",
      "size=N/A time=00:00:25.00 bitrate=N/A speed=49.5x    \r[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_002.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_003.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_004.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_005.ts' for writing",
      "size=N/A time=00:01:05.36 bitrate=N/A speed=64.7x    \r[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_006.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_007.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_008.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_009.ts' for writing",
      "size=N/A time=00:01:49.52 bitrate=N/A speed=72.3x    \r[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_010.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_011.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_012.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_013.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_014.ts' for writing",
      "size=N/A time=00:02:38.70 bitrate=N/A speed=78.7x    \r[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_015.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_016.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_017.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_018.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_019.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_020.ts' for writing",
      "size=N/A time=00:03:31.23 bitrate=N/A speed=83.8x    \r[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_021.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_022.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_023.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_024.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_025.ts' for writing",
      "[out#0/hls @ 0x600000184000] video:0KiB audio:3896KiB subtitle:0KiB other streams:0KiB global headers:0KiB muxing overhead: unknown",
      "size=N/A time=00:04:15.21 bitrate=N/A speed=87.3x    ",
      "[aac @ 0x12c90bb20] Qavg: 2592.304",
    ],
  },
  {
    task_id: "91f446df-7d1b-4bed-a032-1af43430dda",
    title: "Juicy Luicy - Lampu Kuning (Official Music Video)",
    status: "done",
    progress: 100,
    log: [
      "ffmpeg version 7.1.1 Copyright (c) 2000-2025 the FFmpeg developers",
      "  built with Apple clang version 17.0.0 (clang-1700.0.13.3)",
      "  configuration: --prefix=/opt/homebrew/Cellar/ffmpeg/7.1.1_3 --enable-shared --enable-pthreads --enable-version3 --cc=clang --host-cflags= --host-ldflags='-Wl,-ld_classic' --enable-ffplay --enable-gnutls --enable-gpl --enable-libaom --enable-libaribb24 --enable-libbluray --enable-libdav1d --enable-libharfbuzz --enable-libjxl --enable-libmp3lame --enable-libopus --enable-librav1e --enable-librist --enable-librubberband --enable-libsnappy --enable-libsrt --enable-libssh --enable-libsvtav1 --enable-libtesseract --enable-libtheora --enable-libvidstab --enable-libvmaf --enable-libvorbis --enable-libvpx --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxml2 --enable-libxvid --enable-lzma --enable-libfontconfig --enable-libfreetype --enable-frei0r --enable-libass --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-libspeex --enable-libsoxr --enable-libzmq --enable-libzimg --disable-libjack --disable-indev=jack --enable-videotoolbox --enable-audiotoolbox --enable-neon",
      "  libavutil      59. 39.100 / 59. 39.100",
      "  libavcodec     61. 19.101 / 61. 19.101",
      "  libavformat    61.  7.100 / 61.  7.100",
      "  libavdevice    61.  3.100 / 61.  3.100",
      "  libavfilter    10.  4.100 / 10.  4.100",
      "  libswscale      8.  3.100 /  8.  3.100",
      "  libswresample   5.  3.100 /  5.  3.100",
      "  libpostproc    58.  3.100 / 58.  3.100",
      "Input #0, mp3, from './mp3/Juicy Luicy - Lampu Kuning (Official Music Video).mp3':",
      "  Metadata:",
      "    encoder         : Lavf61.7.100",
      "  Duration: 00:04:15.24, start: 0.023021, bitrate: 125 kb/s",
      "  Stream #0:0: Audio: mp3 (mp3float), 48000 Hz, stereo, fltp, 125 kb/s",
      "      Metadata:",
      "        encoder         : Lavc61.19",
      "Stream mapping:",
      "  Stream #0:0 -> #0:0 (mp3 (mp3float) -> aac (native))",
      "Press [q] to stop, [?] for help",
      "[mpegts @ 0x12c90fd60] frame size not set",
      "Output #0, hls, to './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video).m3u8':",
      "  Metadata:",
      "    encoder         : Lavf61.7.100",
      "  Stream #0:0: Audio: aac (LC), 44100 Hz, stereo, fltp, 128 kb/s",
      "      Metadata:",
      "        encoder         : Lavc61.19.101 aac",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_000.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_001.ts' for writing",
      "size=N/A time=00:00:25.00 bitrate=N/A speed=49.5x    \r[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_002.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_003.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_004.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_005.ts' for writing",
      "size=N/A time=00:01:05.36 bitrate=N/A speed=64.7x    \r[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_006.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_007.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_008.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_009.ts' for writing",
      "size=N/A time=00:01:49.52 bitrate=N/A speed=72.3x    \r[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_010.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_011.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_012.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_013.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_014.ts' for writing",
      "size=N/A time=00:02:38.70 bitrate=N/A speed=78.7x    \r[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_015.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_016.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_017.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_018.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_019.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_020.ts' for writing",
      "size=N/A time=00:03:31.23 bitrate=N/A speed=83.8x    \r[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_021.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_022.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_023.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_024.ts' for writing",
      "[hls @ 0x12c904e50] Opening './hls/Juicy Luicy - Lampu Kuning (Official Music Video)/Juicy Luicy - Lampu Kuning (Official Music Video)_025.ts' for writing",
      "[out#0/hls @ 0x600000184000] video:0KiB audio:3896KiB subtitle:0KiB other streams:0KiB global headers:0KiB muxing overhead: unknown",
      "size=N/A time=00:04:15.21 bitrate=N/A speed=87.3x    ",
      "[aac @ 0x12c90bb20] Qavg: 2592.304",
    ],
  },
];
