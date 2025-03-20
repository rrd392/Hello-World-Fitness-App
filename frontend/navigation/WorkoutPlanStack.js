import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import MemberWorkoutPlan from "../screens/Workout Plan/MemberWorkoutPlan";
import ProfileDashboard from "../screens/Profile/ProfileDashboard";
import Notification from "../screens/Home/Notification";
import DetailWorkoutPlan from "../screens/Workout Plan/DetailWorkoutPlan";
import RunWorkoutPlan from "../screens/Workout Plan/RunWorkoutPlan";
import CustomDetailWorkoutPlan from "../screens/Workout Plan/CustomDetailWorkoutPlan";
import AddWorkoutPlan from "../screens/Workout Plan/AddWorkoutPlan";
import EditExistingWorkoutPlan from "../screens/Workout Plan/EditExistingWorkoutPlan";

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
            <WorkoutPlanStackNavigator.Screen name="DetailWorkoutPlan" component={DetailWorkoutPlan} />
            <WorkoutPlanStackNavigator.Screen name="RunWorkoutPlan" component={RunWorkoutPlan} />
            <WorkoutPlanStackNavigator.Screen name="CustomDetailWorkoutPlan" component={CustomDetailWorkoutPlan} />
            <WorkoutPlanStackNavigator.Screen name="AddWorkoutPlan" component={AddWorkoutPlan} />
            <WorkoutPlanStackNavigator.Screen name="EditExistingWorkoutPlan" component={EditExistingWorkoutPlan} />
        </WorkoutPlanStackNavigator.Navigator>
    );
};

export default WorkoutPlanStack