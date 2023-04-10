import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import DashboardMain from "../dashboard/Dashboard";
import HomeScreen from "../home/Home";
import HistoryScreen from "../history/History";
import BlogScreen from "../blog/BlogFeed";
import ProfileScreen from "../profile/Profile";

import { bottomNav } from "../../styles/base";
import TabBarIcon from "./TabBarIcon";

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigator(props) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      labeled={true}
      shifting={false}
      activeColor={bottomNav.activeColor}
      inactiveColor={bottomNav.inactiveColor}
      barStyle={{
        backgroundColor: bottomNav.barBackground,
        height: 48,
        justifyContent: "center",
        marginTop: 0,
        tabBarActiveTintColor: bottomNav.activeColor,
        tabBarInactiveTintColor: bottomNav.inactiveColor,
      }}
      screenOptions={{
        elevation: 1,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: bottomNav.activeColor,
        tabBarInactiveTintColor: bottomNav.inactiveColor,
        tabBarLabel: true,
        tabBarShowLabel: true,
      }}
      tabBarOptions={{
        activeTintColor: bottomNav.activeColor,
        inactiveTintColor: bottomNav.inactiveColor,
      }}
    >
      <Tab.Screen
        name="Home"
        component={props?.login ? DashboardMain : HomeScreen}
        navigation={props.navigation}
        options={{
          headerShown: false,
          title: "Beranda",
          tabBarColor: bottomNav.activeColor,
          tabBarIcon: ({ focused }) =>
            props?.login ? (
              <TabBarIcon
                title="Beranda"
                iconName="view-dashboard"
                focused={focused}
              />
            ) : (
              <TabBarIcon title="Beranda" iconName="home" focused={focused} />
            ),
        }}
      />

      {props?.login ? (
        <Tab.Screen
          name="Belanja"
          component={HomeScreen}
          navigation={props.navigation}
          options={{
            headerShown: false,
            title: "Belanja",
            tabBarColor: bottomNav.activeColor,

            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                title="Belanja"
                iconName="shopping"
                focused={focused}
              />
            ),
          }}
        />
      ) : null}

      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        navigation={props.navigation}
        options={{
          headerShown: true,
          title: "Riwayat",
          tabBarColor: bottomNav.activeColor,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Riwayat" iconName="history" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="BlogFeed"
        component={BlogScreen}
        navigation={props.navigation}
        options={{
          headerShown: true,
          title: "Blog",
          tabBarColor: bottomNav.activeColor,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Blog"
              iconName="book-open-outline"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Profile", { uid: "selfTab" });
          },
        })}
        options={{
          headerShown: true,
          title: "Profil Pengguna",
          tabBarColor: bottomNav.activeColor,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Profil"
              iconName="account-circle"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
