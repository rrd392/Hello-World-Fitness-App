import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Authentication Screens
import LoginScreen from "../screens/LoginScreen";
import OnBoardingPage from "../screens/OnBoardingPage";
import ForgotPage from "../screens/Forgot Password/ForgotPage";
import ResetPasswordPage from "../screens/Forgot Password/ResetPasswordPage";
import SignUpPageStep1 from "../screens/Sign up/SignUpPageStep1";
import SignUpPageStep2 from "../screens/Sign up/SignUpPageStep2";
import SignUpPageStep3 from "../screens/Sign up/SignUpPageStep3";
import SignUpPageStep4 from "../screens/Sign up/SignUpPageStep4";
import CreatedPage from "../screens/Sign up/CreatedPage";

// App Screens
import AdminPage from "../screens/AdminPage";
import MemberDashboard from "../screens/Dashboard/MemberDashboard";
import ProfileDashboard from "../screens/Profile/ProfileDashboard";
import BottomTabNavigator from "../screens/BottomTabNavigator";
import Notification from "../screens/Notification";

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{ headerShown: false }}
            >
                {/* Authentication Flow */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="OnBoardingPage" component={OnBoardingPage} />
                <Stack.Screen name="ForgotPage" component={ForgotPage} />
                <Stack.Screen name="ResetPasswordPage" component={ResetPasswordPage} />
                <Stack.Screen name="SignUpPageStep1" component={SignUpPageStep1} />
                <Stack.Screen name="SignUpPageStep2" component={SignUpPageStep2} />
                <Stack.Screen name="SignUpPageStep3" component={SignUpPageStep3} />
                <Stack.Screen name="SignUpPageStep4" component={SignUpPageStep4} />
                <Stack.Screen name="CreatedPage" component={CreatedPage} />

                {/* Main App Flow */}
                <Stack.Screen name="AdminPage" component={AdminPage} />
                <Stack.Screen name="MemberDashboard" component={MemberDashboard} />
                <Stack.Screen name="Notification" component={Notification} />
                <Stack.Screen name="ProfileDashboard" component={ProfileDashboard} />
                <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
