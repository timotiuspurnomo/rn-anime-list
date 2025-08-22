import { FlatList, FlatListProps, StyleSheet } from "react-native";
import { AnimeCard } from "@/components";
import { AnimeDetailType } from "@/types";

export default function AnimeList(
  props: FlatListProps<AnimeDetailType | undefined>
) {
  return (
    <FlatList
      {...props}
      showsVerticalScrollIndicator={false}
      numColumns={3}
      renderItem={({ index, item }) => <AnimeCard key={index} data={item} />}
      onEndReachedThreshold={0.2}
      columnWrapperStyle={styles.customColumnWrapper}
      contentContainerStyle={styles.customContentContainerStyle}
    />
  );
}
const styles = StyleSheet.create({
  customColumnWrapper: {
    marginBottom: 30,
    gap: "5%",
  },
  customContentContainerStyle: {
    paddingBottom: 50,
  },
});
