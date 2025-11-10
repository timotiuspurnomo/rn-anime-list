import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";
import { Colors, Fonts, Icons, Variables } from "@/constants";
import { Background } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { getAnimeByIdQuery } from "@/queries";
import { useFavoriteStore } from "@/store";
import { AnimeDetailType, AnimeGenreType } from "@/types";
const dayjs = require("dayjs");

const AnimeDetail = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { favouriteAnimeList, toogleFavorite } = useFavoriteStore();
  const { data, isLoading } = useQuery(getAnimeByIdQuery(Number(id)));

  const heartAnimatedValue = useSharedValue(getIsFavorite() ? 1 : 0);
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartAnimatedValue.value }],
  }));
  const scrollAnimatedValue = useSharedValue(1);
  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollAnimatedValue.value,
      [0, Variables.screenHeight * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollAnimatedValue.value,
      [Variables.screenHeight * 0.55, Variables.screenHeight * 0.6],
      [`${Colors.primary}00`, Colors.primary]
    ),
  }));

  const headerTitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollAnimatedValue.value,
      [Variables.screenHeight * 0.55, Variables.screenHeight * 0.6],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  const extraInfo = useMemo(
    () =>
      data
        ? [
            {
              name: "Release Date",
              values: dayjs(data.aired.from).format("D MMMM YYYY"),
            },
            { name: "Status", values: data.status },
            {
              name: "Licensors",
              values: data.licensors.map(({ name }: { name: string }) => name),
            },
            {
              name: "Studios",
              values: data.studios.map(({ name }: { name: string }) => name),
            },
            { name: "Source", values: data.source },
            { name: "Episodes", values: data.episodes },
            {
              name: "Themes",
              values: data.themes.map(({ name }: { name: string }) => name),
            },
            {
              name: "Demographic",
              values: data.demographics.map(
                ({ name }: { name: string }) => name
              ),
            },
            { name: "Duration", values: data.duration },
            { name: "Rating", values: data.rating },
          ]
        : [],
    [data]
  );

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollAnimatedValue.value = event.contentOffset.y;
  });

  function capitalize(str: string) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  function getAbbreviationScoredBy(scoredBy: number) {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(scoredBy);
  }

  function getIsFavorite() {
    return !!favouriteAnimeList[Number(id)];
  }

  function onFavorite() {
    startHeartAnimation(getIsFavorite());
    toogleFavorite(data);
  }

  function startHeartAnimation(isFavorite: boolean) {
    heartAnimatedValue.value = withSequence(
      withTiming(1.5, { duration: 200 }),
      withTiming(isFavorite ? 0 : 1, { duration: 200 })
    );
  }

  function renderHeader() {
    return (
      <Animated.View
        style={[
          styles.headerView,
          headerAnimatedStyle,
          { paddingTop: Platform.select({ android: insets.top, ios: 0 }) },
        ]}
      >
        <SafeAreaView>
          <View style={styles.headerRowView}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => router.back()}
              style={styles.backTouch}
            >
              <FontAwesome6
                name="chevron-left"
                style={styles.chevronLeftIcon}
              />
            </TouchableOpacity>
            {data && (
              <Animated.View
                style={[styles.headerTitleView, headerTitleAnimatedStyle]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.titleText, styles.smallerTitleText]}
                >
                  {data.titles[data.titles.length - 1].title}
                </Text>
                <Text numberOfLines={1} style={styles.alternativeTitleText}>
                  {data.titles[0].title}
                </Text>
              </Animated.View>
            )}
          </View>
        </SafeAreaView>
      </Animated.View>
    );
  }

  function renderAnimeDetail(data: AnimeDetailType) {
    return (
      <View style={styles.animeDetailView}>
        <Text style={styles.titleText}>
          {data.titles[data.titles.length - 1].title}
        </Text>
        <Text style={styles.alternativeTitleText}>{data.titles[0].title}</Text>
        <Text style={styles.subTitleText}>
          {[
            data.type,
            capitalize(
              `${[data.season, data.year].filter((value) => !!value).join(" ")}`
            ),
          ]
            .filter((value) => !!value)
            .join(" • ")}
        </Text>
        <View style={[styles.boxView, styles.scoreView]}>
          <Image source={Icons.star} style={styles.starImage} />
          <Text style={[styles.scoreText, styles.otherScoreText]}>
            <Text style={styles.scoreText}>{data.score}</Text>
            {`/10 (${getAbbreviationScoredBy(data.scored_by)})`}
          </Text>
        </View>
        <Text style={styles.infoText}>{"Overview"}</Text>
        <Text style={styles.descText}>{data.synopsis}</Text>
        <Text style={styles.infoText}>{"Genres"}</Text>
        {renderGenres()}
        {renderExtraInfo()}
        {data.url && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.navigate({
                pathname: "/WebView",
                params: { url: data.url, title: "MyAnimeList.net" },
              })
            }
            style={styles.openMalButton}
          >
            <Text style={styles.openMalButtonLabel}>
              {"Open this page in MAL site"}
            </Text>
            <Octicons name="link-external" style={styles.linkExternalIcon} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderGenres() {
    return (
      <View style={styles.genresView}>
        {data.genres.map((genre: AnimeGenreType, i: number) => (
          <View key={i} style={styles.boxView}>
            <Text style={styles.genreText}>{genre.name}</Text>
          </View>
        ))}
      </View>
    );
  }

  function renderExtraInfo() {
    return extraInfo.map((info, i) =>
      renderSimpleInfo(i, info.name, info.values)
    );
  }

  function renderSimpleInfo(
    index: number,
    name: string,
    values: string | string[]
  ) {
    const value =
      values?.constructor === Array ? values.join(" • ") : values || "-";
    return (
      <View key={index} style={styles.extraInfoView}>
        <Text style={styles.infoText}>{name}</Text>
        <Text style={styles.extraInfoText}>{value || "-"}</Text>
      </View>
    );
  }

  function renderError() {
    return (
      <View style={styles.emptyView}>
        <Text style={styles.emptyText}>{"Ooops... something went wrong"}</Text>
      </View>
    );
  }

  function renderLoading() {
    return (
      <View style={styles.loadingView}>
        <ActivityIndicator size={"large"} color={Colors.white} />
      </View>
    );
  }

  return (
    <View style={styles.backgroundView}>
      <Background />
      <View style={styles.mainView}>
        {isLoading ? (
          renderLoading()
        ) : data ? (
          <Animated.ScrollView
            onScroll={scrollHandler}
            contentContainerStyle={styles.customContentContainerStyle}
            style={styles.customScrollView}
          >
            <Animated.Image
              source={{
                uri: data?.images.jpg.large_image_url,
              }}
              style={[styles.animeCoverImage, imageAnimatedStyle]}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onFavorite()}
              style={styles.favoriteView}
            >
              <FontAwesome
                name="heart"
                style={[styles.heartIcon, styles.greyHeartIcon]}
              />
              <Animated.View style={heartAnimatedStyle}>
                <FontAwesome name="heart" style={styles.heartIcon} />
              </Animated.View>
            </TouchableOpacity>
            {renderAnimeDetail(data)}
          </Animated.ScrollView>
        ) : (
          renderError()
        )}
      </View>
      {!isLoading && renderHeader()}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  headerView: {
    width: "100%",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: Colors.primary,
    paddingLeft: 15,
  },
  headerRowView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  headerTitleView: {
    flexShrink: 1,
  },
  mainView: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  favoriteView: {
    width: 60,
    height: 60,
    bottom: 30,
    right: "7%",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 99,
    backgroundColor: "#221F3D",
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  animeDetailView: {
    bottom: 15,
    paddingHorizontal: 15,
  },
  boxView: {
    alignSelf: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: "#221F3D",
    borderRadius: 5,
  },
  scoreView: {
    marginTop: 10,
    marginBottom: 30,
  },
  genresView: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 10,
  },
  extraInfoView: {
    marginTop: 20,
  },
  loadingView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  smallerTitleText: {
    fontSize: 20,
  },
  alternativeTitleText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.grey,
  },
  subTitleText: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.blueLight,
    marginTop: 15,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.white,
  },
  otherScoreText: {
    color: Colors.blueLight,
  },
  genreText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
  },
  infoText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.blueLight,
    marginBottom: 8,
  },
  extraInfoText: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.purple,
    marginBottom: 8,
  },
  descText: {
    fontSize: 18,
    fontFamily: Fonts.medium,
    color: Colors.white,
    marginBottom: 25,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.white,
    textAlign: "center",
  },
  openMalButtonLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  backTouch: {
    width: 50,
    height: 50,
    backgroundColor: `${Colors.grey}B3`,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 99,
    marginRight: 15,
    marginVertical: 10,
  },
  openMalButton: {
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: Colors.purple,
    marginTop: 30,
  },
  chevronLeftIcon: {
    fontSize: 22,
    color: Colors.white,
  },
  heartIcon: {
    fontSize: 32,
    color: Colors.red,
    marginTop: 2,
  },
  greyHeartIcon: {
    fontSize: 31,
    color: "#e8e8e8",
    position: "absolute",
  },
  linkExternalIcon: {
    fontSize: 20,
    color: Colors.primary,
    marginLeft: 10,
  },
  animeCoverImage: {
    width: "100%",
    height: Variables.screenHeight * 0.6,
    resizeMode: "cover",
  },
  starImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 5,
  },
  customContentContainerStyle: {
    paddingBottom: 80,
  },
  customScrollView: {
    flex: 1,
  },
});
export default AnimeDetail;
