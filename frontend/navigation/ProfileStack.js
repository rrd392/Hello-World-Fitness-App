import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UpdateProfile from "../screens/Profile/UpdateProfile";
import ProfileDashboard from "../screens/Profile/ProfileDashboard";
import MembershipStep1 from "../screens/Profile/MembershipStep1";
import TransactionHistory from "../screens/Profile/TransanctionHistory";

const ProfileStackNavigator = createStackNavigator();

const ProfileStack = () => {
    return (
        <ProfileStackNavigator.Navigator
            initialRouteName="ProfileDashboard"
            screenOptions={{ headerShown: false }}
        >
            <ProfileStackNavigator.Screen name="ProfileDashboard" component={ProfileDashboard} />
            <ProfileStackNavigator.Screen name="UpdateProfile" component={UpdateProfile} />
            <ProfileStackNavigator.Screen name="MembershipStep1" component={MembershipStep1} />
            <ProfileStackNavigator.Screen name="TransactionHistory" component={TransactionHistory} />

        </ProfileStackNavigator.Navigator>
    );
};

export default ProfileStack;