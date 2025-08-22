import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { Tabs } from "expo-router";
import { Colors, Images, Variables, Icons, Fonts } from "@/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabIconProps = {
  focused: boolean;
  title: string;
  icon: ImageSourcePropType;
};

const TabIcon = ({ focused, title, icon }: TabIconProps) => {
  return focused ? (
    <View style={[styles.tabIconView, styles.focusedTabIconView]}>
      <Image source={Images.tabHighlight} style={styles.tabIconImage} />
      <Image
        tintColor={Colors.secondary}
        style={[styles.tabIconIcon, styles.focusedTabIconIcon]}
        source={icon}
      />
      <Text style={styles.tabIconLabel}>{title}</Text>
    </View>
  ) : (
    <View style={styles.tabIconView}>
      <Image
        source={icon}
        tintColor={Colors.light[200]}
        style={styles.tabIconIcon}
      />
    </View>
  );
};

const Layout = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: styles.customTabBarItem,
        tabBarStyle: {
          ...styles.customTabBar,
          marginBottom: insets.bottom + 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon focused={focused} title={"Home"} icon={Icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="Favorite"
        options={{
          title: "Favorite",
          headerShown: false,
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon
              focused={focused}
              title={"Favorites"}
              icon={Icons.favorite}
            />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabIconView: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: Variables.screenWidth * 0.15,
    top: 6,
  },
  focusedTabIconView: {
    width: (Variables.screenWidth - 40 * 2) / 2,
    flexDirection: "row",
    borderRadius: 999,
  },
  tabIconLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  tabIconIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  focusedTabIconIcon: {
    marginRight: 10,
  },
  tabIconImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: 999,
  },
  customTabBarItem: {
    height: 50,
  },
  customTabBar: {
    backgroundColor: "#0F0D23",
    height: 50,
    marginHorizontal: 50,
    borderRadius: 999,
    position: "absolute",
    borderTopWidth: 0,
  },
});

export default Layout;
