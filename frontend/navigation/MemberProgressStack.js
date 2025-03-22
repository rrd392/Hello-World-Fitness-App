import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileStack from "./ProfileStack";
import MemberProgress from "../screens/MemberProgress";
import Notification from "../screens/Home/Notification";



const MemberProgressStackNavigator = createStackNavigator();

const MemberProgressStack = () => {
    return (
        <MemberProgressStackNavigator.Navigator
            initialRouteName="MemberProgress"
            screenOptions={{ headerShown: false }}
        >
            <MemberProgressStackNavigator.Screen name="MemberProgress" component={MemberProgress} />
            <MemberProgressStackNavigator.Screen name="Notification" component={Notification} />
            <MemberProgressStackNavigator.Screen name="ProfileStack" component={ProfileStack} />

            
        </MemberProgressStackNavigator.Navigator>
    );
};

export default MemberProgressStack;