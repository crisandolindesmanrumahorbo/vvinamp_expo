import { defaultStyles } from "@/styles";
import { Link } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View style={defaultStyles.container} className="p-4">
        <Link href="/log">Logs</Link>
        <Link href="/constants">Constants</Link>
      </View>
    </SafeAreaView>
  );
}
