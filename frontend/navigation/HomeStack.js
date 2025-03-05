import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MemberDashboard from "../screens/Home/MemberDashboard";
import ProfileDashboard from "../screens/Profile/ProfileDashboard";
import Notification from "../screens/Home/Notification";

const HomeStackNavigator = createStackNavigator();

const HomeStack = () => {
    return (
        <HomeStackNavigator.Navigator
            initialRouteName="MemberDashboard"
            screenOptions={{ headerShown: false }}
        >
            <HomeStackNavigator.Screen name="MemberDashboard" component={MemberDashboard} />
            <HomeStackNavigator.Screen name="Notification" component={Notification} />
            <HomeStackNavigator.Screen name="ProfileDashboard" component={ProfileDashboard} />
        </HomeStackNavigator.Navigator>
    );
};

export default HomeStack