import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { bottomNav, staticDimensions, dimensions } from "../styles/base";
import TabBarIcon from "../components/bottomnav/TabBarIcon";
import DashboardMain from "../screens/dashboard/DashboardScreen";
import ShopScreen from "../screens/Shop/ShopScreen";
import StarterKitScreen from "../screens/StarterKit/StarterKitScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator(props) {
  //const { isLogin, isActive, recruitmentTimer } = props;
  return (
    <Tab.Navigator
      initialRouteName="Shop"
      tabBarOptions={{
        showLabel: false,
        style: {
          backgroundColor: bottomNav.barBackground,
          borderRadius: bottomNav.borderRadius,
          position: "absolute",
          start: (dimensions.fullWidth - bottomNav.width) / 2,
          end: (dimensions.fullWidth - bottomNav.width) / 2,
          bottom: staticDimensions.marginHorizontal,
          elevation: 0,
          width: bottomNav.width,
          height: bottomNav.height,
          alignSelf: "center",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        key="Home"
        component={DashboardMain}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Home" iconName="home" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Shop"
        key="Shop"
        component={ShopScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Shop" iconName="shopping" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="StarterKit"
        key="StarterKit"
        component={StarterKitScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Starter Kit"
              iconName="newspaper-variant"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        key="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Profil" iconName="account" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
