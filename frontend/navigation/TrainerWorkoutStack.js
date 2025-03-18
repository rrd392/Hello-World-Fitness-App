import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CreateWorkout from "../screens/Trainer Members/CreateWorkout";
import Workout from "../screens/Trainer Workout/Workout";
import Notification from "../screens/Home/Notification";
import ProfileDashboard from "../screens/Trainer Profile/ProfileDashboard";
import TrainerProfileStack from "./TrainerProfileStack";
import EditExistingWorkoutModal from "../screens/Trainer Workout/EditExistingWorkoutModal";
import DeleteModal from "../screens/Trainer Members/DeleteModal";

const TrainerWorkoutStackNavigator = createStackNavigator();

const TrainerWorkoutStack = () => {
    return (
        <TrainerWorkoutStackNavigator.Navigator
            initialRouteName="Workout"
            screenOptions={{ headerShown: false }}
        >
            <TrainerWorkoutStackNavigator.Screen name="Workout" component={Workout} />
            <TrainerWorkoutStackNavigator.Screen name="CreateWorkout" component={CreateWorkout} />
            <TrainerWorkoutStackNavigator.Screen name="Notification" component={Notification} />
            <TrainerWorkoutStackNavigator.Screen name="ProfileDashboard" component={ProfileDashboard} />
            <TrainerWorkoutStackNavigator.Screen name="TrainerProfileStack" component={TrainerProfileStack} />
            <TrainerWorkoutStackNavigator.Screen name="EditExistingWorkoutModal" component={EditExistingWorkoutModal} />
            <TrainerWorkoutStackNavigator.Screen name="DeleteModal" component={DeleteModal} />
            
        </TrainerWorkoutStackNavigator.Navigator>
    );
};

export default TrainerWorkoutStack;