import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from "./Dashboard/MemberDashboard";
import ProfileScreen from "./OnBoardingPage";
import WorkoutScreen from "./LoginScreen";
import ClassesScreen from "./AdminPage";

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
            headerShown: false, 
            tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home-outline';
            else if (route.name === 'Classes') iconName = 'calendar-outline';
            else if (route.name === 'WorkoutPlan') iconName = 'barbell-outline';
            else if (route.name === 'Profile') iconName = 'person-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarStyle: { backgroundColor: '#5C3CAF' },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#D1B6FF',                                                                                 
        })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Classes" component={ClassesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="WorkoutPlan" component={WorkoutScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
