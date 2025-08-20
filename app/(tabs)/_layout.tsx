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
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: styles.customTabBarItem,
        tabBarStyle: styles.customTabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} title={"Home"} icon={Icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="Favorite"
        options={{
          title: "Favorite",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
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
    height: 60,
    width: Variables.screenWidth * 0.15,
    top: 10.5,
  },
  focusedTabIconView: {
    width: (Variables.screenWidth - 12 * 2) / 2,
    flexDirection: "row",
    borderRadius: 99,
  },
  tabIconLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  tabIconIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  focusedTabIconIcon: {
    marginRight: 6,
  },
  tabIconImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: 999,
  },
  customTabBarItem: {
    height: 60,
  },
  customTabBar: {
    backgroundColor: "#0F0D23",
    height: 60,
    marginHorizontal: 15,
    marginBottom: 50,
    borderRadius: 99,
    position: "absolute",
  },
});

export default Layout;
