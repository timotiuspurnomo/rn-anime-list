import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { FasterImageView } from "@candlefinance/faster-image";
import { Fonts, Variables, Icons, Colors } from "@/constants";
import { useRouter } from "expo-router";
import { AnimeDetailType } from "@/types";
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { useFavoriteStore } from "@/store";

type Props = { data: AnimeDetailType | undefined };

export default function AnimeCard({ data }: Props) {
  const router = useRouter();
  const { favouriteAnimeList } = useFavoriteStore();
  const genres = data?.genres
    .slice(0, 2)
    .map((genre) => genre.name)
    .join(" • ");
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={!data?.mal_id}
      onPress={() => router.navigate(`/anime/${data?.mal_id}`)}
      style={styles.mainView}
    >
      <FasterImageView
        source={{
          url: data?.images.jpg.image_url || "",
          showActivityIndicator: true,
          borderRadius: 10,
        }}
        style={styles.animeImage}
      />
      <Text style={styles.titleText} numberOfLines={1}>
        {data?.titles[data?.titles.length - 1].title}
      </Text>
      <View style={styles.scoreView}>
        <Image source={Icons.star} style={styles.starImage} />
        <Text style={styles.scoreText} numberOfLines={2}>
          {data?.score || "-"}
        </Text>
      </View>
      <Text style={styles.genreText} numberOfLines={2}>
        {genres}
      </Text>
      {favouriteAnimeList[Number(data?.mal_id)] && (
        <FontAwesome6 name="heart" iconStyle="solid" style={styles.heartIcon} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: "30%",
  },
  scoreView: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 4,
  },
  titleText: {
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: 6,
  },
  scoreText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  genreText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.grey,
  },
  animeImage: {
    width: "100%",
    height: Variables.screenWidth * 0.4,
    resizeMode: "cover",
    marginBottom: 12,
  },
  starImage: {
    width: 12,
    height: 12,
    resizeMode: "contain",
    marginRight: 4,
  },
  heartIcon: {
    top: 5,
    right: 5,
    alignSelf: "flex-end",
    fontSize: 20,
    color: Colors.red,
    position: "absolute",
  },
});
