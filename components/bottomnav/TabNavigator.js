import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import DashboardMain from "../dashboard/Dashboard";
import HomeScreen from "../home/Home";
import MediaKitFiles from "../mediakit/MediaKitFiles";

import { bottomNav, colors } from "../../styles/base";
import TabBarIcon from "./TabBarIcon";

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigator(props) {
  const { isLogin, isActive, recruitmentTimer } = props;
  return (
    <Tab.Navigator
      initialRouteName="Home"
      labeled={true}
      shifting={false}
      safeAreaInsets={{top: 0}}
      activeColor={bottomNav.activeColor}
      inactiveColor={bottomNav.inactiveColor}
      barStyle={{
        backgroundColor: bottomNav.barBackground,
        height: 60,
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
        tabStyle: {
          paddingVertical: 0,
          paddingTop: 0,
        },
        style: {
          backgroundColor: bottomNav.barBackground,
        }
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
            <TabBarIcon title="BELANJA" iconName="shopping" isLogin={isLogin && isActive} focused={focused} />
          ),
        }}
      />

      {isLogin && isActive ? <Tab.Screen
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
                title={`STARTER KIT`}
                iconName="file-image"
                isLogin={isLogin && isActive}
                focused={focused}
              />
            ),
          }}
        /> : null}

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
              isLogin={isLogin && isActive}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
