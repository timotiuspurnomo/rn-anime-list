import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AnimeGenreList, AnimeList } from "@/components";
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
  const timeoutRef = useRef(setTimeout(() => {}));
  const { selectedGenresObj } = useGenreStore();
  const {
    data,
    hasNextPage,
    isError,
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

  function renderError() {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyText}>{"Can't connect to server"}</Text>
      </View>
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
      ) : isError ? (
        renderError()
      ) : (
        <AnimeList
          data={getResultsData}
          renderItem={undefined}
          onEndReached={() => hasNextPage && !isFetching && fetchNextPage()}
          ListEmptyComponent={renderEmptyList}
          ListFooterComponent={renderLoadingMore}
          style={styles.customFlatList}
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
    height: Variables.screenHeight * 0.65,
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
    height: Variables.screenHeight * 0.6,
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
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.white,
    textAlign: "center",
  },
  customFlatList: {
    marginTop: 20,
  },
});
