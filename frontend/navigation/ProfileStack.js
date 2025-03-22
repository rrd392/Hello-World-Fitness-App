import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UpdateProfile from "../screens/Profile/UpdateProfile";
import ProfileDashboard from "../screens/Profile/ProfileDashboard";
import TransactionHistory from "../screens/Profile/TransanctionHistory";
import Achievement from "../screens/Profile/Achievement";
import Leaderboard from "../screens/Profile/Leaderboard";
import MembershipStatus from "../screens/Profile/MembershipStatus";
import MembershipRenew from "../screens/Profile/MembershipRenew";
import PaymentConfirmation from "../screens/Profile/PaymentConfirmation";
import TrainerSelection from "../screens/Sign up/TrainerSelection";
import MemberDashboard from "../screens/Home/MemberDashboard";


const ProfileStackNavigator = createStackNavigator();

const ProfileStack = () => {
    return (
        <ProfileStackNavigator.Navigator
            initialRouteName="ProfileDashboard"
            screenOptions={{ headerShown: false }}
        >
            <ProfileStackNavigator.Screen name="ProfileDashboard" component={ProfileDashboard} />
            <ProfileStackNavigator.Screen name="UpdateProfile" component={UpdateProfile} />
            <ProfileStackNavigator.Screen name="MembershipStatus" component={MembershipStatus} />
            <ProfileStackNavigator.Screen name="MembershipRenew" component={MembershipRenew} /> 
            <ProfileStackNavigator.Screen name="TransactionHistory" component={TransactionHistory} />
            <ProfileStackNavigator.Screen name="Achievement" component={Achievement} />
            <ProfileStackNavigator.Screen name="Leaderboard" component={Leaderboard} />
            <ProfileStackNavigator.Screen name="PaymentConfirmation" component={PaymentConfirmation} />
            <ProfileStackNavigator.Screen name="TrainerSelection" component={TrainerSelection} />
            <ProfileStackNavigator.Screen name="MemberDashboard" component={MemberDashboard}/>
        </ProfileStackNavigator.Navigator>
    );
};

export default ProfileStack;