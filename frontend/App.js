import React from "react";
import AppNavigator from "./navigation/AppNavigation";

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
