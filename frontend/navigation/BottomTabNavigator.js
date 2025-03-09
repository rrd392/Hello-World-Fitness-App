import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { getUserId } from "../screens/getUserId";
import HomeStack from "./HomeStack";
import TrainerHomeStack from "./TrainerHomeStack";
import WorkoutPlanStack from "./WorkoutPlanStack";
import ProfileStack from "./ProfileStack";

// Member Screens
import MemberClassesScreen from "../screens/AdminPage";


// Dummy Trainer Screens
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
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Classes") iconName = "calendar";
          else if (route.name === "WorkoutPlan" || route.name === "Schedule") iconName = "barbell";
          else if (route.name === "More") iconName = "ellipsis-vertical-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { backgroundColor: "#B3A0FF" },
        tabBarActiveTintColor: "#E2F163",
        tabBarInactiveTintColor: "#fff",
      })}
    >
      {userRole === "member" ? (
        <>
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Classes" component={MemberClassesScreen} />
          <Tab.Screen name="WorkoutPlan" component={WorkoutPlanStack} />
          <Tab.Screen name="More" component={ProfileStack} />
        </>
      ) : userRole === "trainer" ? (
        <>
          <Tab.Screen name="Home" component={TrainerHomeStack} />
          <Tab.Screen name="Classes" component={TrainerClassesScreen} />
          <Tab.Screen name="Schedule" component={TrainerScheduleScreen} />
          <Tab.Screen name="More" component={TrainerProfileScreen} />
        </>
      ) : (
        <Tab.Screen name="Error" component={() => <Text>Invalid Role</Text>} />
      )}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
