import { View, Text, StyleSheet, SafeAreaView } from "react-native";

export default function Search() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.mainWrapper}></View>
        <View>
          <Text style={styles.hello}>Hello World</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222831",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  hello: {
    fontSize: 20,
  },
});
