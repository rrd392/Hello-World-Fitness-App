import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MemberDashboard from "../screens/Home/MemberDashboard";
import ProfileStack from "./ProfileStack";
import Notification from "../screens/Home/Notification";
import CheckIn from "../screens/Home/CheckIn";
import Classes from "../screens/Home/ClassesPage/Classes";

const HomeStackNavigator = createStackNavigator();

const HomeStack = () => {
  return (
    <HomeStackNavigator.Navigator
      initialRouteName="MemberDashboard"
      screenOptions={{ headerShown: false }}
    >
      <HomeStackNavigator.Screen
        name="MemberDashboard"
        component={MemberDashboard}
      />
      <HomeStackNavigator.Screen name="Notification" component={Notification} />
      <HomeStackNavigator.Screen name="ProfileStack" component={ProfileStack} />
      <HomeStackNavigator.Screen name="CheckIn" component={CheckIn} />
      <HomeStackNavigator.Screen name="Classes" component={Classes} />
    </HomeStackNavigator.Navigator>
  );
};

export default HomeStack;
