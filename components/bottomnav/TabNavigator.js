import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import DashboardMain from "../dashboard/Dashboard";
import HomeScreen from "../home/Home";
import MediaKitFiles from "../dashboard/MediaKitFiles";

import { bottomNav, colors } from "../../styles/base";
import TabBarIcon from "./TabBarIcon";

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigator(props) {
  const { token, currentUser } = props;
  return (
    <Tab.Navigator
      initialRouteName="Home"
      labeled={true}
      shifting={false}
      activeColor={colors.daclen_bg_highlighted}
      inactiveColor={colors.daclen_bg}
      barStyle={{
        backgroundColor: colors.daclen_bg,
        height: 24,
        justifyContent: "center",
        marginTop: 0,
        tabBarActiveTintColor: colors.daclen_bg_highlighted,
        tabBarInactiveTintColor: colors.daclen_bg,
      }}
      screenOptions={{
        elevation: 1,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.daclen_bg_highlighted,
        tabBarInactiveTintColor: colors.daclen_bg,
        tabBarLabel: false,
        tabBarShowLabel: false,
      }}
      tabBarOptions={{
        activeTintColor: colors.daclen_bg_highlighted,
        inactiveTintColor: colors.daclen_bg,
      }}
    >
      <Tab.Screen
        name="Home"
        key="Home"
        component={HomeScreen}
        navigation={props.navigation}
        options={{
          headerShown: false,
          title: "BELANJA",
          tabBarColor: bottomNav.activeColor,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="BELANJA"
              focused={focused}
            />
          ),
        }}
      />

      {token === null ||
      currentUser === null ||
      currentUser?.id === undefined ? null : (
        <Tab.Screen
          name="MediaKitTab"
          key="MediaKit"
          component={MediaKitFiles}
          navigation={props.navigation}
          options={{
            headerShown: false,
            title: "MATERI PROMOSI",
            tabBarColor: bottomNav.activeColor,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                title="MATERI PROMOSI"
                focused={focused}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="ProfileTab"
        key="Profile"
        component={DashboardMain}
        navigation={props.navigation}
        options={{
          headerShown: false,
          title: "PROFIL",
          tabBarColor: bottomNav.activeColor,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="PROFIL"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

