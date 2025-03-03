import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import screens from the screens folder
import LoginScreen from "./screens/LoginScreen";
import AdminPage from "./screens/AdminPage";
import UserDashboard from "./screens/UserDashboard";
import OnBoardingPage from "./screens/OnBoardingPage"; 
import ForgotPage from "./screens/ForgotPage";
import ResetPasswordPage from "./screens/ResetPasswordPage";
import SignUpPageStep1 from "./screens/SignUpPageStep1";  // User details
import SignUpPageStep2 from "./screens/SignUpPageStep2";  // Additional info
import SignUpPageStep3 from "./screens/SignUpPageStep3";  // Goal selection
import SignUpPageStep4 from "./screens/SignUpPageStep4";  // Membership selection
import CreatedPage from "./screens/CreatedPage";

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
          name="UserDashboard" 
          component={UserDashboard} 
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
