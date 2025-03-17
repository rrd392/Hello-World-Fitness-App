import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileDashboard from "../screens/Trainer Profile/ProfileDashboard";
import Members from "../screens/Trainer Members/Members";
import Notification from "../screens/Home/Notification";
import ViewProgress from "../screens/Trainer Members/ViewProgress";
import TrainerDashboard from "../screens/Trainer Home/TrainerDashboard";
import MemberWorkoutPlan from "../screens/Trainer Members/MemberWorkoutPlan";
import DeleteModal from "../screens/Trainer Members/DeleteModal";
import ViewWorkout from "../screens/Trainer Members/ViewWorkout";
import EditModal from "../screens/Trainer Members/EditModal";
import CreateWorkout from "../screens/Trainer Members/CreateWorkout";
import ViewSelectedWorkoutModal from "../screens/Trainer Members/ViewSelectedWorkoutModal";

const TrainerMemberStackNavigator = createStackNavigator();

const TrainerMemberStack = () => {
    return (
        <TrainerMemberStackNavigator.Navigator
            initialRouteName="Members"
            screenOptions={{ headerShown: false }}
        >
            <TrainerMemberStackNavigator.Screen name="Members" component={Members} />
            <TrainerMemberStackNavigator.Screen name="Notification" component={Notification} />
            <TrainerMemberStackNavigator.Screen name="ProfileDashboard" component={ProfileDashboard} />
            <TrainerMemberStackNavigator.Screen name="ViewProgress" component={ViewProgress} />
            <TrainerMemberStackNavigator.Screen name="TrainerDashboard" component={TrainerDashboard} />
            <TrainerMemberStackNavigator.Screen name="MemberWorkoutPlan" component={MemberWorkoutPlan} />
            <TrainerMemberStackNavigator.Screen name="DeleteModal" component={DeleteModal} />
            <TrainerMemberStackNavigator.Screen name="ViewWorkout" component={ViewWorkout} />
            <TrainerMemberStackNavigator.Screen name="EditModal" component={EditModal} />
            <TrainerMemberStackNavigator.Screen name="CreateWorkout" component={CreateWorkout} />
            <TrainerMemberStackNavigator.Screen name="ViewSelectedWorkoutModal" component={ViewSelectedWorkoutModal} />
        </TrainerMemberStackNavigator.Navigator>
    );
};

export default TrainerMemberStack;