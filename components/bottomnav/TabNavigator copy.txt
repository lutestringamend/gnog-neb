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
  const { token, currentUser } = props;
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
        key="Home"
        component={
          token === null ||
          currentUser === null ||
          currentUser?.id === undefined
            ? HomeScreen
            : DashboardMain
        }
        navigation={props.navigation}
        options={{
          headerShown: false,
          title: "Beranda",
          tabBarColor: bottomNav.activeColor,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Beranda"
              iconName={token === null ||
                currentUser === null ||
                currentUser?.id === undefined ? "home" : "view-dashboard"}
              focused={focused}
            />
          ),
        }}
      />

      {token === null ||
      currentUser === null ||
      currentUser?.id === undefined ? null : (
        <Tab.Screen
          name="Belanja"
          key="Shop"
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
      )}

      {token === null ||
      currentUser === null ||
      currentUser?.id === undefined ? null : (
        <Tab.Screen
          name="HistoryTab"
          key="History"
          component={HistoryScreen}
          navigation={props.navigation}
          options={{
            headerShown: true,
            title: "Riwayat",
            tabBarColor: bottomNav.activeColor,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                title="Riwayat"
                iconName="history"
                focused={focused}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        key="Profile"
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

/*
<Tab.Screen
        name="BlogFeed"
        key="Blog"
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
*/
