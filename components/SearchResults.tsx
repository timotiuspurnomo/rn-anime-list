import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AnimeCard, AnimeGenreList } from "@/components";
import { Colors, Fonts, Variables } from "@/constants";
import { getAnimeSearchInfQuery } from "@/queries";
import { useGenreStore } from "@/store";
import { AnimeGenreType } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  keyword: string;
  animeGenres: AnimeGenreType[];
};

export default function SearchResults({ keyword, animeGenres }: Props) {
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState("");
  const [isDelay, setIsDelay] = useState(false);
  const timeoutRef = useRef(0);
  const { selectedGenresObj } = useGenreStore();
  const {
    data,
    hasNextPage,
    isFetching,
    isLoading,
    fetchNextPage,
    isFetchNextPageError,
    isLoadingError,
  } = useInfiniteQuery(
    getAnimeSearchInfQuery({ limit: 10, q: query, genres: selectedGenres })
  );

  useEffect(() => {
    setIsDelay(true);
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setQuery(keyword);
      setSelectedGenres(
        Object.entries(selectedGenresObj)
          .map(([key]: [string, any]) => key)
          .join(",")
      );
      setIsDelay(false);
    }, 1000);
  }, [keyword, JSON.stringify(selectedGenresObj)]);

  const getResultsData = useMemo(
    () => (data ? data.pages.flatMap((page) => page.data) : []),
    [data]
  );

  function renderLoading() {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator size={"large"} color={Colors.white} />
      </View>
    );
  }

  function renderLoadingMore() {
    return (
      !isLoading &&
      !isLoadingError &&
      !isFetchNextPageError &&
      hasNextPage &&
      getResultsData.length > 0 && (
        <View style={styles.loadingMoreView}>
          <ActivityIndicator size={"large"} color={Colors.white} />
        </View>
      )
    );
  }

  function renderEmptyList() {
    return (
      !isLoading && (
        <View style={styles.emptyView}>
          <Text style={styles.emptyText}>{"No Result"}</Text>
        </View>
      )
    );
  }

  return (
    <View style={styles.mainView}>
      <Text style={styles.subTitle}>{"Search results"}</Text>
      {animeGenres.length > 0 && keyword.length > 0 && (
        <AnimeGenreList data={animeGenres} />
      )}
      {isLoading || isDelay ? (
        renderLoading()
      ) : (
        <FlatList
          data={getResultsData}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          columnWrapperStyle={styles.customColumnWrapper}
          renderItem={({ index, item }) => (
            <AnimeCard key={index} data={item} />
          )}
          onEndReached={() => hasNextPage && !isFetching && fetchNextPage()}
          onEndReachedThreshold={0.1}
          contentContainerStyle={styles.customContentContainerStyle}
          style={styles.customFlatList}
          ListEmptyComponent={renderEmptyList}
          ListFooterComponent={renderLoadingMore}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  loadingView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingMoreView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
    paddingBottom: 70,
  },
  emptyView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.white,
    marginBottom: 15,
  },
  emptyText: {
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  customColumnWrapper: {
    marginBottom: 30,
    gap: "5%",
  },
  customContentContainerStyle: {
    minHeight: Variables.screenHeight * 0.7,
    paddingBottom: 50,
  },
  customFlatList: {
    marginTop: 20,
  },
});
