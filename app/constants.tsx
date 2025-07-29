import { useConstants } from "@/store/constants";
import { defaultStyles } from "@/styles";
import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Constants() {
  const { baseUrl, setBaseUrl } = useConstants();
  const [input, setInput] = useState(baseUrl || "");

  const handleSave = () => {
    if (!input.startsWith("http")) {
      Alert.alert("Invalid URL", "Please enter a valid URL.");
      return;
    }
    setBaseUrl(input);
    Alert.alert("Saved", `Base URL set to:\n${input}`);
  };
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View
        style={defaultStyles.container}
        className="flex-1 bg-white px-4 justify-center"
      >
        <Text className="text-lg font-bold mb-2">Set Base URL</Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="https://your-api.com"
          className="border border-gray-300 p-3 rounded mb-4"
          autoCapitalize="none"
          keyboardType="url"
        />
        <Button title="Save" onPress={handleSave} />
        <Text className="text-sm text-gray-500 mt-4">
          Current: {baseUrl || "Not set"}
        </Text>
      </View>
    </SafeAreaView>
  );
}
