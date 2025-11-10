import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useNavigation } from "expo-router";

type Params = {
  url: string;
  title?: string;
};

export default function App() {
  const { url, title: paramTitle } = useLocalSearchParams<Params>();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: paramTitle || title || "" });
  }, [title]);

  return (
    <View style={styles.mainView}>
      {isLoading && (
        <View style={styles.progressBarView}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}
      <WebView
        style={styles.mainView}
        source={{ uri: url }}
        onLoadProgress={({ nativeEvent: { progress } }) =>
          setProgress(progress)
        }
        onLoadEnd={({ nativeEvent: { title } }) => {
          setIsLoading(false);
          setTitle(title);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  loadingView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  progressBarView: {
    width: "100%",
    height: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#2E51A2",
    position: "absolute",
  },
});
