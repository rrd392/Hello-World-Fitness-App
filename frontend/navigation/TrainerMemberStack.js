import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileDashboard from "../screens/Trainer Profile/ProfileDashboard";
import Members from "../screens/Trainer Members/Members";
import Notification from "../screens/Home/Notification";
import ViewProgress from "../screens/Trainer Members/ViewProgress";
import TrainerDashboard from "../screens/Trainer Home/TrainerDashboard";

const TrainerMemberStackNavigator = createStackNavigator();

const TrainerMemberStack = () => {
    return (
        <TrainerMemberStackNavigator.Navigator
            initialRouteName="Members"
            screenOptions={{ headerShown: false }}
        >
            <TrainerMemberStackNavigator.Screen name="Members" component={Members} />
            <TrainerMemberStackNavigator.Screen name="Notification" component={Notification} />
            <TrainerMemberStackNavigator.Screen name="ProfileDashboard" component={ProfileDashboard} />
            <TrainerMemberStackNavigator.Screen name="ViewProgress" component={ViewProgress} />
            <TrainerMemberStackNavigator.Screen name="TrainerDashboard" component={TrainerDashboard} />
            
        </TrainerMemberStackNavigator.Navigator>
    );
};

export default TrainerMemberStack;