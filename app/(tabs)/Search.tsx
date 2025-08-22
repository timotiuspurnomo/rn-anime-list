import { useEffect, useMemo, useState } from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Background, SearchBar, SearchResults } from "@/components";
import { Colors } from "@/constants";
import { AnimeGenreType } from "@/types";
import { getAnimeGenresQuery } from "@/queries";

export default function Search() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const { data, refetch, isError } = useQuery(getAnimeGenresQuery());
  const animeGenres = useMemo(
    () =>
      data
        ? data.filter((genre: AnimeGenreType) => genre.count || 0 > 1000)
        : [],
    [data]
  );

  useEffect(() => {
    if (isError) {
      refetch();
    }
  }, [search]);

  return (
    <View style={styles.backgroundView}>
      <Background />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={[styles.mainView, { paddingTop: 80 - insets.top }]}>
          <SearchBar onChange={setSearch} style={styles.customSearchBar} />
          {search && (
            <SearchResults keyword={search.trim()} animeGenres={animeGenres} />
          )}
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
  customSearchBar: {
    marginBottom: 20,
  },
});
