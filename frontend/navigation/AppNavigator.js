// AppNavigator.js
import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import AuthContext and AuthProvider
import { AuthProvider, AuthContext } from "../context/AuthContext";

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
import BottomTabNavigator from "./BottomTabNavigator";

const AuthStack = createStackNavigator();

const AuthStackNavigator = () => (
    <AuthStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="OnBoardingPage" component={OnBoardingPage} />
        <AuthStack.Screen name="ForgotPage" component={ForgotPage} />
        <AuthStack.Screen name="ResetPasswordPage" component={ResetPasswordPage} />
        <AuthStack.Screen name="SignUpPageStep1" component={SignUpPageStep1} />
        <AuthStack.Screen name="SignUpPageStep2" component={SignUpPageStep2} />
        <AuthStack.Screen name="SignUpPageStep3" component={SignUpPageStep3} />
        <AuthStack.Screen name="SignUpPageStep4" component={SignUpPageStep4} />
        <AuthStack.Screen name="CreatedPage" component={CreatedPage} />
    </AuthStack.Navigator>
);

const RootNavigator = () => {
    const { userLoggedIn } = useContext(AuthContext);

    return userLoggedIn ? <BottomTabNavigator /> : <AuthStackNavigator />;
};

const AppNavigator = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </AuthProvider>
    );
};

export default AppNavigator;
