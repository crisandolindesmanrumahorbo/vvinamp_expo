import { StackScreenWithSearchBar } from "@/constants/layout";
import { defaultStyles } from "@/styles";
import { Stack } from "expo-router";
import { View } from "react-native";

const IndexScreenLayout = () => {
  return (
    <View style={defaultStyles.container}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            ...StackScreenWithSearchBar,
            headerTitle: "Songs",
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
};

export default IndexScreenLayout;
