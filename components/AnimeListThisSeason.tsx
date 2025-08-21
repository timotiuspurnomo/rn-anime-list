import { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollViewProps,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fonts } from "@/constants";
import { AnimeCard } from "@/components";
import { getSeasonNowInfQuery } from "@/queries";

export default function AnimeListThisSeason(props: ScrollViewProps) {
  const {
    data,
    hasNextPage,
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
        <ActivityIndicator size={"large"} color={"#FFFFFF"} />
      </View>
    );
  }

  function renderLoadingMore() {
    return (
      !isLoading &&
      !isFetchNextPageError &&
      !isLoadingError && (
        <View style={styles.loadingMoreView}>
          <ActivityIndicator size={"large"} color={"#FFFFFF"} />
        </View>
      )
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
      ) : (
        <FlatList
          {...props}
          data={getSeasonNowData}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          columnWrapperStyle={styles.customColumnWrapper}
          renderItem={({ index, item }) => (
            <AnimeCard key={index} data={item} />
          )}
          onEndReached={() => hasNextPage && !isFetching && fetchNextPage()}
          onEndReachedThreshold={0.1}
          contentContainerStyle={styles.customContentContainerStyle}
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
    paddingHorizontal: 15,
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
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  subTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 15,
  },
  emptyText: {
    fontFamily: Fonts.bold,
    color: "#FFFFFF",
  },
  customColumnWrapper: {
    marginBottom: 30,
    gap: "5%",
  },
  customContentContainerStyle: {
    paddingBottom: 50,
  },
});
