import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Fonts } from "@/constants";
import "react-native-reanimated";

export default function RootLayout() {
  const [loaded] = useFonts({
    [Fonts.bold]: require("../assets/fonts/Figtree-Bold.ttf"),
    [Fonts.medium]: require("../assets/fonts/Figtree-Medium.ttf"),
    [Fonts.regular]: require("../assets/fonts/Figtree-Regular.ttf"),
    [Fonts.semiBold]: require("../assets/fonts/Figtree-SemiBold.ttf"),
  });

  useEffect(() => {
    loaded && SplashScreen.hideAsync();
  }, [loaded]);

  return loaded ? (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="movies/[id]" options={{ headerShown: false }} /> */}
    </Stack>
  ) : null;
}
