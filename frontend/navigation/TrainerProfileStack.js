import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UpdateProfile from "../screens/Trainer Profile/UpdateProfile";
import ProfileDashboard from "../screens/Trainer Profile/ProfileDashboard";

const TrainerProfileStackNavigator = createStackNavigator();

const TrainerProfileStack = () => {
    return (
        <TrainerProfileStackNavigator.Navigator
            initialRouteName="ProfileDashboard"
            screenOptions={{ headerShown: false }}
        >
            <TrainerProfileStackNavigator.Screen name="ProfileDashboard" component={ProfileDashboard} />
            <TrainerProfileStackNavigator.Screen name="UpdateProfile" component={UpdateProfile} />
        </TrainerProfileStackNavigator.Navigator>
    );
};

export default TrainerProfileStack;