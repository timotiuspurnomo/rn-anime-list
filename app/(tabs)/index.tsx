import { useState } from "react";
import {
  Animated,
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Extrapolation } from "react-native-reanimated";
import { Background, AnimeListThisSeason } from "@/components";
import { Colors, Fonts, Images, Variables } from "@/constants";

export default function Index() {
  const insets = useSafeAreaInsets();
  const [scrollAnimatedValue] = useState(new Animated.Value(0));
  const welcomeHeaderMaxHeight = Variables.screenWidth * 0.5;
  const welcomeHeaderMinHeight = Variables.screenWidth * 0.01;
  const scrollDistance = welcomeHeaderMaxHeight - welcomeHeaderMinHeight;
  const welcomeHeaderHeight = scrollAnimatedValue.interpolate({
    inputRange: [
      0,
      Platform.OS === "android" ? scrollDistance * 2 : scrollDistance,
    ],
    outputRange: [welcomeHeaderMaxHeight, welcomeHeaderMinHeight],
    extrapolate: Extrapolation.CLAMP,
  });
  const welcomeHeaderAnimatedStyle = {
    opacity: scrollAnimatedValue.interpolate({
      inputRange:
        Platform.OS === "android"
          ? [0, scrollDistance, scrollDistance * 2]
          : [0, scrollDistance / 2, scrollDistance],
      outputRange: [1, 0.5, 0],
      extrapolate: Extrapolation.CLAMP,
    }),
    transform: [
      {
        translateY: scrollAnimatedValue.interpolate({
          inputRange: [0, scrollDistance],
          outputRange: [0, 0],
          extrapolate: Extrapolation.CLAMP,
        }),
      },
    ],
  };
  return (
    <View style={styles.backgroundView}>
      <Background />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={[styles.mainView, { paddingTop: 80 - insets.top }]}>
          <Animated.View
            style={[styles.logoAppView, { height: welcomeHeaderHeight }]}
          >
            <Animated.Image
              source={Images.gon}
              style={[styles.logoAppImage, welcomeHeaderAnimatedStyle]}
            />
            <Animated.Text
              style={[styles.welcomeText, welcomeHeaderAnimatedStyle]}
            >
              {"Welcome, Gon!"}
            </Animated.Text>
            <Animated.Text
              style={[styles.welcomeDescText, welcomeHeaderAnimatedStyle]}
            >
              {"What should we watch today?"}
            </Animated.Text>
          </Animated.View>
          <AnimeListThisSeason
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollAnimatedValue } } }],
              { useNativeDriver: false }
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  safeAreaView: {
    flex: 1,
  },
  mainView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  logoAppView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeText: {
    fontFamily: Fonts.medium,
    fontSize: 20,
    color: Colors.white,
  },
  welcomeDescText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.grey,
  },
  logoAppImage: {
    width: 80,
    height: 80,
    borderRadius: 99,
    resizeMode: "cover",
    marginBottom: 10,
  },
});
