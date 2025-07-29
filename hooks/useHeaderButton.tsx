import { useCallback, useLayoutEffect } from "react";
import { Pressable } from "react-native";
import { useNavigation } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

export const useHeaderButton = ({
  onRefreshPress,
}: {
  onRefreshPress?: () => void;
}) => {
  const navigation = useNavigation();

  const renderRefreshIcon = useCallback(() => {
    if (!onRefreshPress) return null;

    return (
      <Pressable onPress={onRefreshPress} style={{ marginRight: 12 }}>
        {/* fsfs */}
        <Feather name="refresh-ccw" size={20} color="black" />
      </Pressable>
    );
  }, [onRefreshPress]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderRefreshIcon,
    });
  }, [navigation, renderRefreshIcon]);
};
