import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SignupForm } from "../context/SignupForm"; 
import SignUpPageStep1 from "../screens/Sign up/SignUpPageStep1";
import SignUpPageStep2 from "../screens/Sign up/SignUpPageStep2";
import SignUpPageStep3 from "../screens/Sign up/SignUpPageStep3";
import SignUpPageStep4 from "../screens/Sign up/SignUpPageStep4";
import CreatedPage from "../screens/Sign up/CreatedPage";

const SignupStackNavigator = createStackNavigator();

export default function SignupStack() {
    return (
      <SignupForm> 
        <NavigationContainer>
          <SignupStackNavigator.Navigator screenOptions={{ headerShown: false }}>
            <SignupStackNavigator.Screen name="SignUpPageStep1" component={SignUpPageStep1} />
            <SignupStackNavigator.Screen name="SignUpPageStep2" component={SignUpPageStep2} />
            <SignupStackNavigator.Screen name="SignUpPageStep3" component={SignUpPageStep3} />
            <SignupStackNavigator.Screen name="SignUpPageStep4" component={SignUpPageStep4} />
            <SignupStackNavigator.Screen name="CreatedPage" component={CreatedPage} />
          </SignupStackNavigator.Navigator>
        </NavigationContainer>
      </SignupForm>
    );
  }

