import {
  View,
  StyleSheet,
  Image,
  TextInput,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Colors, Icons } from "@/constants";

type OnChangeType = (text: string) => void;

export default function SearchBar({
  onChange,
  style,
}: {
  onChange: OnChangeType;
  style: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.mainView, style]}>
      <Image source={Icons.search} style={styles.searchIcon} />
      <TextInput
        placeholder={"What isekai are you looking for?"}
        placeholderTextColor={Colors.grey}
        onChangeText={onChange}
        style={styles.customTextInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: Colors.tertiary,
    borderRadius: 99,
    paddingHorizontal: 15,
  },
  searchIcon: {
    width: 22,
    height: 22,
    tintColor: Colors.purple,
    resizeMode: "contain",
    marginRight: 15,
  },
  customTextInput: {
    flex: 1,
    height: "100%",
    flexShrink: 1,
    color: Colors.white,
    fontSize: 15,
  },
});
