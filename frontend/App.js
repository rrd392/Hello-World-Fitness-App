import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import screens from the screens folder
import LoginScreen from "./screens/LoginScreen";
import AdminPage from "./screens/AdminPage";
import MemberDashboard from "./screens/Dashboard/MemberDashboard";
import OnBoardingPage from "./screens/OnBoardingPage"; 
import ForgotPage from "./screens/Forgot Password/ForgotPage";
import ResetPasswordPage from "./screens/Forgot Password/ResetPasswordPage";
import SignUpPageStep1 from "./screens/Sign up/SignUpPageStep1";  // User details
import SignUpPageStep2 from "./screens/Sign up/SignUpPageStep2";  // Additional info
import SignUpPageStep3 from "./screens/Sign up/SignUpPageStep3";  // Goal selection
import SignUpPageStep4 from "./screens/Sign up/SignUpPageStep4";  // Membership selection
import CreatedPage from "./screens/Sign up/CreatedPage";
import BottomTabNavigator from './screens/BottomTabNavigator';
import Notification from "./screens/Notification";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AdminPage" 
          component={AdminPage} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MemberDashboard" 
          component={MemberDashboard} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Notification" 
          component={Notification} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="OnBoardingPage"  
          component={OnBoardingPage} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ForgotPage" 
          component={ForgotPage}
          options={{ headerShown: false }}
        />
         <Stack.Screen 
          name="ResetPasswordPage" 
          component={ResetPasswordPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUpPageStep1" 
          component={SignUpPageStep1}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUpPageStep2" 
          component={SignUpPageStep2}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUpPageStep3" 
          component={SignUpPageStep3}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUpPageStep4" 
          component={SignUpPageStep4}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CreatedPage" 
          component={CreatedPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="BottomTabNavigator" 
          component={BottomTabNavigator} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
