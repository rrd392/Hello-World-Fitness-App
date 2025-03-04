import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { getUserId } from "./getUserId";

// Member Screens
import MemberHomeScreen from "./Dashboard/MemberDashboard";
import MemberProfileScreen from "./OnBoardingPage";
import MemberWorkoutScreen from "./LoginScreen";
import MemberClassesScreen from "./AdminPage";

// Dummy Trainer Screens
const TrainerHomeScreen = () => <View><Text>Trainer Home</Text></View>;
const TrainerClassesScreen = () => <View><Text>Trainer Classes</Text></View>;
const TrainerScheduleScreen = () => <View><Text>Trainer Schedule</Text></View>;
const TrainerProfileScreen = () => <View><Text>Trainer Profile</Text></View>;

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      const userData = await getUserId();
      if (userData) {
        setUserRole(userData.role);
      }
      setLoading(false);
    }
    fetchUserRole();
  }, []);

  // Show loading while fetching role
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5C3CAF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Classes") iconName = "calendar-outline";
          else if (route.name === "WorkoutPlan" || route.name === "Schedule") iconName = "barbell-outline";
          else if (route.name === "Profile") iconName = "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: "#5C3CAF" },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#D1B6FF",
      })}
    >
      {userRole === "member" ? (
        <>
          <Tab.Screen name="Home" component={MemberHomeScreen} />
          <Tab.Screen name="Classes" component={MemberClassesScreen} />
          <Tab.Screen name="WorkoutPlan" component={MemberWorkoutScreen} />
          <Tab.Screen name="Profile" component={MemberProfileScreen} />
        </>
      ) : userRole === "trainer" ? (
        <>
          <Tab.Screen name="Home" component={TrainerHomeScreen} />
          <Tab.Screen name="Classes" component={TrainerClassesScreen} />
          <Tab.Screen name="Schedule" component={TrainerScheduleScreen} />
          <Tab.Screen name="Profile" component={TrainerProfileScreen} />
        </>
      ) : (
        <Tab.Screen name="Error" component={() => <Text>Invalid Role</Text>} />
      )}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
