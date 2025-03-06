import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MemberWorkoutPlan from "../screens/Workout Plan/MemberWorkoutPlan";
import ProfileDashboard from "../screens/Profile/ProfileDashboard";
import Notification from "../screens/Home/Notification";

const WorkoutPlanStackNavigator = createStackNavigator();

const WorkoutPlanStack = () => {
    return (
        <WorkoutPlanStackNavigator.Navigator
            initialRouteName="MemberWorkoutPlan"
            screenOptions={{ headerShown: false }}
        >
            <WorkoutPlanStackNavigator.Screen name="MemberWorkoutPlan" component={MemberWorkoutPlan} />
            <WorkoutPlanStackNavigator.Screen name="Notification" component={Notification} />
            <WorkoutPlanStackNavigator.Screen name="ProfileDashboard" component={ProfileDashboard} />
        </WorkoutPlanStackNavigator.Navigator>
    );
};

export default WorkoutPlanStack