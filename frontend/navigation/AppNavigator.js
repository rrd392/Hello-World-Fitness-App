// AppNavigator.js
import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import AuthContext and AuthProvider
import { AuthProvider, AuthContext } from "../context/AuthContext";
import {SignupForm} from "../context/SignupForm";

// Authentication Screens
import LoginScreen from "../screens/LoginScreen";
import OnBoardingPage from "../screens/OnBoardingPage";
import ForgotPage from "../screens/Forgot Password/ForgotPage";
import ResetPasswordPage from "../screens/Forgot Password/ResetPasswordPage";
import MembershipStep1 from "../screens/Profile/MembershipStep1";

// App Screens
import BottomTabNavigator from "./BottomTabNavigator";
import SignupStack from "./SignupStack";

const AuthStack = createStackNavigator();

const AuthStackNavigator = () => (
    <AuthStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="OnBoardingPage" component={OnBoardingPage} />
        <AuthStack.Screen name="ForgotPage" component={ForgotPage} />
        <AuthStack.Screen name="ResetPasswordPage" component={ResetPasswordPage} />
        <AuthStack.Screen name="MembershipStep1" component={MembershipStep1} />
        <AuthStack.Screen name="SignupStack">
            {() => (  // Wrap SignupStack with SignupForm
                <SignupForm>
                    <SignupStack />
                </SignupForm>
            )}
        </AuthStack.Screen>
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
