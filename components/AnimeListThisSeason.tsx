import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollViewProps,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Colors, Fonts, Variables } from "@/constants";
import { AnimeList } from "@/components";
import { getSeasonNowInfQuery } from "@/queries";

export default function AnimeListThisSeason(props: ScrollViewProps) {
  const {
    data,
    hasNextPage,
    isError,
    isFetching,
    isLoading,
    fetchNextPage,
    isFetchNextPageError,
    isLoadingError,
  } = useInfiniteQuery(getSeasonNowInfQuery({ limit: 10 }));
  const getSeasonNowData = useMemo(
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
      getSeasonNowData.length > 0 && (
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
          <Text style={styles.emptyText}>{"No Data"}</Text>
        </View>
      )
    );
  }

  return (
    <View style={styles.mainView}>
      <Text style={styles.subTitle}>{"Animes this season"}</Text>
      {isLoading ? (
        renderLoading()
      ) : isError ? (
        renderError()
      ) : (
        <AnimeList
          data={getSeasonNowData}
          renderItem={undefined}
          onEndReached={() => hasNextPage && !isFetching && fetchNextPage()}
          ListEmptyComponent={renderEmptyList}
          ListFooterComponent={renderLoadingMore}
          {...props}
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
    height: "70%",
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
    width: "100%",
    height: Variables.screenHeight * 0.5,
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
});
