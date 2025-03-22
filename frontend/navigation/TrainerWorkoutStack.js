import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CreateWorkout from "../screens/Trainer Workout/CreateWorkout";
import Workout from "../screens/Trainer Workout/Workout";
import Notification from "../screens/Trainer Home/Notification";
import TrainerProfileStack from "./TrainerProfileStack";
import EditExistingWorkoutModal from "../screens/Trainer Workout/EditExistingWorkoutModal";
import DeleteModal from "../screens/Trainer Workout/DeleteModal";
import MemberWorkoutPlan from "../screens/Trainer Workout/MemberWorkoutPlan";
import ViewWorkout from "../screens/Trainer Workout/ViewWorkout";
import EditModal from "../screens/Trainer Workout/EditModal";
import ViewSelectedWorkoutModal from "../screens/Trainer Workout/ViewSelectedWorkoutModal";

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
            <TrainerWorkoutStackNavigator.Screen name="TrainerProfileStack" component={TrainerProfileStack} />
            <TrainerWorkoutStackNavigator.Screen name="EditExistingWorkoutModal" component={EditExistingWorkoutModal} />
            <TrainerWorkoutStackNavigator.Screen name="DeleteModal" component={DeleteModal} />
            <TrainerWorkoutStackNavigator.Screen name="MemberWorkoutPlan" component={MemberWorkoutPlan} />
            <TrainerWorkoutStackNavigator.Screen name="ViewWorkout" component={ViewWorkout} />
            <TrainerWorkoutStackNavigator.Screen name="EditModal" component={EditModal} />
            <TrainerWorkoutStackNavigator.Screen name="ViewSelectedWorkoutModal" component={ViewSelectedWorkoutModal} />
            
        </TrainerWorkoutStackNavigator.Navigator>
    );
};

export default TrainerWorkoutStack;