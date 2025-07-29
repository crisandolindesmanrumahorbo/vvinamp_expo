import { Tabs, useRouter } from "expo-router";
import React from "react";
import Fontisto from "@expo/vector-icons/Fontisto";
import { BlurView } from "expo-blur";
import { colors, fontSize } from "@/constants/tokens";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingPlayer } from "@/components/FloatingPlayer";
import Entypo from "@expo/vector-icons/Entypo";

import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarLabelStyle: {
            fontSize: fontSize.xs,
            fontWeight: "500",
          },
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 0,
            paddingTop: 8,
          },
          tabBarBackground: () => (
            <BlurView
              intensity={130}
              tint="dark"
              style={{
                ...StyleSheet.absoluteFillObject,
                overflow: "hidden",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Entypo name="home" size={24} color={color} />
            ),
            headerShown: true,
            header: () => <Header />,
          }}
        />
        <Tabs.Screen
          name="(search)"
          options={{
            title: "Cook",
            tabBarIcon: ({ color }) => (
              <Fontisto name="laboratory" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      <FloatingPlayer
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          bottom: 85,
        }}
      />
    </SafeAreaView>
  );
}

function Header() {
  const navigation = useRouter();

  const goToSearch = () => {
    navigation.navigate("/(search)" as never);
  };
  return (
    <View className="flex-row justify-between items-center px-4 py-3 bg-black">
      <Text className="text-lg font-bold text-white">VVinamp</Text>

      <View className="flex-row items-center space-x-4 gap-4">
        <TouchableOpacity onPress={goToSearch}>
          <Fontisto name="search" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("/settings");
          }}
        >
          <Image
            source={require("@/assets/images/vvinamp.png")}
            className="w-8 h-8 rounded-full"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
