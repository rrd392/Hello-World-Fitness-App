import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SignupForm } from "../context/SignupForm"; 
import SignUpPageStep1 from "../screens/Sign up/SignUpPageStep1";
import SignUpPageStep2 from "../screens/Sign up/SignUpPageStep2";
import SignUpPageStep3 from "../screens/Sign up/SignUpPageStep3";
import SignUpPageStep4 from "../screens/Sign up/SignUpPageStep4";
import CreatedPage from "../screens/Sign up/CreatedPage";
import TrainerSelection from "../screens/Sign up/TrainerSelection";
import MemberDashboard from "../screens/Home/MemberDashboard";

const SignupStackNavigator = createStackNavigator();

export default function SignupStack() {
    return (
        <SignupStackNavigator.Navigator screenOptions={{ headerShown: false }}>
        <SignupStackNavigator.Screen name="SignUpPageStep1" component={SignUpPageStep1} />
        <SignupStackNavigator.Screen name="SignUpPageStep2" component={SignUpPageStep2} />
        <SignupStackNavigator.Screen name="SignUpPageStep3" component={SignUpPageStep3} />
        <SignupStackNavigator.Screen name="SignUpPageStep4" component={SignUpPageStep4} />
        <SignupStackNavigator.Screen name="CreatedPage" component={CreatedPage} />
        <SignupStackNavigator.Screen name="TrainerSelection" component={TrainerSelection} />
        <SignupStackNavigator.Screen name="MemberDashboard" component={MemberDashboard}/>
        </SignupStackNavigator.Navigator>
    );
  }

