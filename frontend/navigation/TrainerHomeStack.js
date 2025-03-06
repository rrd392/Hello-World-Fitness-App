import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TrainerDashboard from "../screens/Home/TrainerDashboard";

const HomeStackNavigator = createStackNavigator();

const TrainerHomeStack = () => {
    return (
        <HomeStackNavigator.Navigator
            initialRouteName="TrainerDashboard"
            screenOptions={{ headerShown: false }}
        >
            <HomeStackNavigator.Screen name="TrainerDashboard" component={TrainerDashboard} />
            {/* <HomeStackNavigator.Screen name="Notification" component={Notification} />
            <HomeStackNavigator.Screen name="ProfileDashboard" component={ProfileDashboard} /> */}
        </HomeStackNavigator.Navigator>
    );
};

export default TrainerHomeStack