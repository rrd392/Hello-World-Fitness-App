import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import screens from the screens folder
import LoginScreen from "./screens/LoginScreen";
import AdminPage from "./screens/AdminPage";
import UserDashboard from "./screens/UserDashboard";
import OnBoardingPage from "./screens/OnBoardingPage"; 
import ForgotPage from "./screens/ForgotPage";
import SignUpPage from "./screens/SignUpPage";

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
          name="OnBoardingPage"  // Must match navigation.navigate('OnBoardingPage')
          component={OnBoardingPage} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUpPage" 
          component={SignUpPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ForgotPage" 
          component={ForgotPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}