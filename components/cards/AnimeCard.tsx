import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { FasterImageView } from "@candlefinance/faster-image";
import { Fonts, Variables, Icons, Colors } from "@/constants";

type AnimeData = {
  titles: { title: string }[];
  images: { jpg: { image_url: string } };
  score: number | null;
  genres: { name: string }[];
};
export default function AnimeCard({ data }: { data: AnimeData }) {
  const genres = data.genres
    .slice(0, 2)
    .map((genre) => genre.name)
    .join(" • ");
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.mainView}>
      <FasterImageView
        source={{ url: data.images.jpg.image_url, borderRadius: 10 }}
        style={styles.animeImage}
      />
      <Text style={styles.titleText} numberOfLines={1}>
        {data.titles[data.titles.length - 1].title}
      </Text>
      <View style={styles.scoreView}>
        <Image source={Icons.star} style={styles.starImage} />
        <Text style={styles.scoreText} numberOfLines={2}>
          {data.score || "-"}
        </Text>
      </View>
      <Text style={styles.genreText} numberOfLines={2}>
        {genres}
      </Text>
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
    color: "#FFFFFF",
    marginBottom: 6,
  },
  scoreText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: "#FFFFFF",
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
});
