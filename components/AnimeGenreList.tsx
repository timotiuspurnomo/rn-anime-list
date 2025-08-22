import { Colors, Fonts } from "@/constants";
import { useGenreStore } from "@/store";
import { AnimeGenreType } from "@/types";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AnimeGenreProps = {
  data: AnimeGenreType & { index: number };
};

type AnimeGenreListProps = {
  data: AnimeGenreType[];
};

function AnimeGenre({ data }: AnimeGenreProps) {
  const { selectedGenresObj, toogleSelectedGenresObj } = useGenreStore();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => toogleSelectedGenresObj(`${data.mal_id}`)}
      style={[
        styles.animeGenreView,
        selectedGenresObj[data.mal_id] && styles.selectedAnimeGenreView,
      ]}
    >
      <Text
        style={[
          styles.animeGenreLabel,
          selectedGenresObj[data.mal_id] && styles.selectedAnimeGenreLabel,
        ]}
      >
        {data.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function AnimeGenreList({ data }: AnimeGenreListProps) {
  return (
    <View style={styles.flatListContainer}>
      <FlatList
        data={data}
        horizontal
        renderItem={({ index, item }) => (
          <AnimeGenre key={`${index}`} data={{ ...item, index }} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  animeGenreView: {
    height: 22,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderRadius: 99,
    backgroundColor: Colors.tertiary,
    marginRight: 10,
  },
  selectedAnimeGenreView: {
    borderWidth: 1,
    borderColor: Colors.white,
  },
  animeGenreLabel: {
    fontFamily: Fonts.medium,
    color: "#ECECFF",
  },
  selectedAnimeGenreLabel: {
    color: Colors.purple,
  },
  flatListContainer: {
    height: 35,
  },
});
