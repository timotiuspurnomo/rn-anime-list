import { View, SafeAreaView, StyleSheet } from "react-native";
import { Background, AnimeThisSeason } from "@/components";
import { Colors } from "@/constants";

export default function Index() {
  return (
    <View style={styles.backgroundView}>
      <Background />
      <SafeAreaView style={styles.mainView}>
        <AnimeThisSeason />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  mainView: {
    flex: 1,
  },
});
