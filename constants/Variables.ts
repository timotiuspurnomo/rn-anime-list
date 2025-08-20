import { Dimensions, Platform, NativeModules } from "react-native";

const variables = {
  screenHeight: Dimensions.get("window").height,
  screenWidth: Dimensions.get("window").width,
  safeNotchHeight:
    Platform.OS === "android" ? NativeModules.StatusBarManager.HEIGHT : 0,
  notchHeight: NativeModules.StatusBarManager.HEIGHT,
};

export default variables;
