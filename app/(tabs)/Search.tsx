import { useEffect, useMemo, useRef, useState } from "react";
import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Background, SearchBar, SearchResults } from "@/components";
import { Colors } from "@/constants";
import { AnimeGenresType } from "@/types";
import { getAnimeGenresQuery } from "@/queries";
import { useGenreStore } from "@/store";

export default function Search() {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDelay, setIsDelay] = useState(false);
  const timeoutRef = useRef(0);
  const { data, refetch, isError } = useQuery(getAnimeGenresQuery());
  const { clearSelectedGenresObj } = useGenreStore();
  const animeGenres = useMemo(
    () =>
      data ? data.filter((genre: AnimeGenresType) => genre.count > 1000) : [],
    [data]
  );

  useEffect(() => {
    clearSelectedGenresObj();
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSearchQuery(search);
      setIsDelay(false);
      if (isError) {
        refetch();
      }
    }, 1000);
  }, [search]);

  function onChange(text: string) {
    setIsDelay(true);
    setSearch(text);
  }

  return (
    <View style={styles.backgroundView}>
      <Background />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.mainView}>
          <SearchBar onChange={onChange} style={styles.customSearchBar} />
          {search && (
            <SearchResults
              keyword={searchQuery.trim()}
              animeGenres={animeGenres}
              isDelay={isDelay}
            />
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
    paddingTop: "5%",
    paddingHorizontal: 15,
  },
  customSearchBar: {
    marginBottom: 20,
  },
});
