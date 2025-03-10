import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MemberDashboard from "../screens/Home/MemberDashboard";
import ProfileStack from "./ProfileStack";
import Notification from "../screens/Home/Notification";
import CheckIn from "../screens/Home/CheckIn";
import Classes from "../screens/Home/ClassesPage/Classes";
import SelectedClass from "../screens/Home/ClassesPage/SelectedClass";
import Nutrition from "../screens/Home/Nutrition/Nutrition";
import CalculateMeal from "../screens/Home/Nutrition/CalculateMeal";
import SelectedMeal from "../screens/Home/Nutrition/SelectedMeal";

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
      <HomeStackNavigator.Screen name="SelectedClass" component={SelectedClass} />
      <HomeStackNavigator.Screen name="Nutrition" component={Nutrition} />
      <HomeStackNavigator.Screen name="CalculateMeal" component={CalculateMeal} />
      <HomeStackNavigator.Screen name="SelectedMeal" component={SelectedMeal} />
    </HomeStackNavigator.Navigator>
  );
};

export default HomeStack;
