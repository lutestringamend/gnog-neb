import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import DashboardMain from "../dashboard/Dashboard";
import HomeScreen from "../home/Home";
import MediaKitFiles from "../mediakit/MediaKitFiles";

import { bottomNav, colors } from "../../styles/base";
import TabBarIcon from "./TabBarIcon";

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigator(props) {
  const { token, currentUser, recruitmentTimer } = props;
  return (
    <Tab.Navigator
      initialRouteName="Home"
      labeled={true}
      shifting={false}
      activeColor={bottomNav.activeColor}
      inactiveColor={bottomNav.inactiveColor}
      barStyle={{
        backgroundColor: bottomNav.barBackground,
        height: 32,
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
        component={HomeScreen}
        navigation={props.navigation}
        options={{
          headerShown: false,
          title: "BELANJA",
          tabBarColor: bottomNav.activeColor,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="BELANJA" iconName="shopping" focused={focused} />
          ),
        }}
      />

      {token === null ||
      currentUser === null ||
      currentUser?.id === undefined ||
      currentUser?.isActive === undefined ||
      currentUser?.isActive === null ||
      !currentUser?.isActive ? null : (
        <Tab.Screen
          name="MediaKitTab"
          key="MediaKit"
          component={MediaKitFiles}
          navigation={props.navigation}
          options={{
            headerShown: false,
            title: "STARTER KIT",
            tabBarColor: bottomNav.activeColor,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                title="STARTER KIT"
                iconName="file-image"
                focused={focused}
              />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="ProfileTab"
        key="Profile"
        children={() => <DashboardMain recruitmentTimer={recruitmentTimer} />}
        navigation={props.navigation}
        options={{
          headerShown: false,
          title: "PROFIL",
          tabBarColor: bottomNav.activeColor,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="PROFIL"
              iconName="account-circle"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
