import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Images, Colors } from "@/constants";

export default function Background() {
  return (
    <View style={styles.mainView}>
      <Image style={styles.customImageBackground} source={Images.homeBg} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    position: "absolute",
    backgroundColor: Colors.primary,
  },
  customImageBackground: {
    width: "100%",
    resizeMode: "cover",
  },
});
