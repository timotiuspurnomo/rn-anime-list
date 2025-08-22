import { useMemo } from "react";
import { Text, View, StyleSheet, SafeAreaView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimeList, Background } from "@/components";
import { Colors, Fonts, Variables } from "@/constants";
import { useFavoriteStore } from "@/store";
import { AnimeDetailType } from "@/types";

export default function Favorite() {
  const insets = useSafeAreaInsets();
  const { favouriteAnimeList: favouriteAnimeListObj } = useFavoriteStore();
  const favouriteAnimeList = useMemo(
    () =>
      Object.entries(favouriteAnimeListObj).map(
        ([_, favouriteAnime]: [_: string, favouriteAnime: AnimeDetailType]) =>
          favouriteAnime
      ),
    [favouriteAnimeListObj]
  );

  function renderEmptyList() {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyText}>
          {"Your favorite animes will show here"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.backgroundView}>
      <Background />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={[styles.mainView, { paddingTop: 80 - insets.top }]}>
          <Text style={styles.subTitle}>{"Favorite Animes"}</Text>
          <AnimeList
            data={favouriteAnimeList}
            renderItem={undefined}
            ListEmptyComponent={renderEmptyList}
            contentContainerStyle={{ flex: 1 }}
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
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  emptyView: {
    height: Variables.screenHeight * 0.7,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.white,
    textAlign: "center",
  },
  subTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.white,
    marginBottom: 15,
  },
});
