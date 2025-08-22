import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from "react-native";
import React, { useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { Colors, Fonts, Icons, Variables } from "@/constants";
import { Background } from "@/components";
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { useQuery } from "@tanstack/react-query";
import { getAnimeByIdQuery } from "@/queries";
import { useFavoriteStore } from "@/store";
import { AnimeDetailType, AnimeGenreType } from "@/types";

const AnimeDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { favouriteAnimeList, toogleFavorite } = useFavoriteStore();
  const { data, isLoading } = useQuery(getAnimeByIdQuery(Number(id)));
  const redHeartAnimatedVal = useRef(
    new Animated.Value(getIsFavorite() ? 1 : 0)
  );

  function capitalize(str: string) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  function getAbbreviationScoredBy(scoredBy: number) {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(scoredBy);
  }

  function getEpisodes(episodes: number | null) {
    return episodes ? `${episodes} Episodes` : null;
  }

  function getIsFavorite() {
    return !!favouriteAnimeList[Number(id)];
  }

  function onFavorite() {
    startHeartAnimation(getIsFavorite());
    toogleFavorite(data);
  }

  function startHeartAnimation(isFavorite: boolean) {
    Animated.sequence([
      Animated.timing(redHeartAnimatedVal.current, {
        toValue: 1.4,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(redHeartAnimatedVal.current, {
        toValue: isFavorite ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
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
    return [
      {
        name: "Release Date",
        values: moment(data.aired.from).format("D MMMM YYYY"),
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
        values: data.demographics.map(({ name }: { name: string }) => name),
      },
      { name: "Duration", values: data.duration },
      { name: "Rating", values: data.rating },
    ].map((info, i) => renderSimpleInfo(i, info.name, info.values));
  }

  function renderSimpleInfo(
    index: number,
    name: string,
    values: string | string[]
  ) {
    const value = values.constructor === Array ? values.join(" • ") : values;
    return (
      <View key={index} style={styles.extraInfoView}>
        <Text style={styles.infoText}>{name}</Text>
        <Text style={styles.extraInfoText}>{value || "-"}</Text>
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
        ) : (
          <ScrollView
            contentContainerStyle={styles.customContentContainerStyle}
            style={styles.customScrollView}
          >
            <Image
              source={{
                uri: data?.images.jpg.large_image_url,
              }}
              style={styles.animeCoverImage}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => onFavorite()}
              style={styles.favoriteView}
            >
              <FontAwesome6
                name="heart"
                iconStyle="solid"
                style={[styles.heartIcon, styles.greyHeartIcon]}
              />
              <Animated.View
                style={{ transform: [{ scale: redHeartAnimatedVal.current }] }}
              >
                <FontAwesome6
                  name="heart"
                  iconStyle="solid"
                  style={styles.heartIcon}
                />
              </Animated.View>
            </TouchableOpacity>
            {renderAnimeDetail(data)}
          </ScrollView>
        )}
      </View>
      <SafeAreaView>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => router.back()}
          style={styles.backTouch}
        >
          <FontAwesome6
            name="chevron-left"
            iconStyle="solid"
            style={styles.chevronLeftIcon}
          />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundView: {
    flex: 1,
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.white,
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
  titleText: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.white,
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
  backTouch: {
    width: 50,
    height: 50,
    backgroundColor: `${Colors.grey}B3`,
    alignItems: "center",
    justifyContent: "center",
    top: Variables.safeNotchHeight + 10,
    left: 15,
    borderRadius: 99,
  },
  chevronLeftIcon: {
    fontSize: 22,
    color: Colors.white,
  },
  heartIcon: {
    fontSize: 30,
    color: Colors.red,
  },
  greyHeartIcon: {
    color: Colors.grey,
    position: "absolute",
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
    paddingBottom: 50,
  },
  customScrollView: {
    flex: 1,
  },
});
export default AnimeDetail;
