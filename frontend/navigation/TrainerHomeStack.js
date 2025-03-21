import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TrainerDashboard from "../screens/Trainer Home/TrainerDashboard";
import TrainerProfileStack from "./TrainerProfileStack";
import TrainerWorkoutStack from "./TrainerWorkoutStack";
import Notification from "../screens/Trainer Home/Notification";
import TrainerMemberStack from "./TrainerMemberStack";
import Schedule1 from "../screens/Trainer Home/SchedulePage/Schedule1";
import MarkAttendance from "../screens/Trainer Home/SchedulePage/MarkAttendance";
import ClassAttendance from "../screens/Trainer Home/SchedulePage/ClassAttendance";
import ClassPastAttendance from "../screens/Trainer Home/SchedulePage/ClassPastAttendance";
import ClassReport from "../screens/Trainer Home/SchedulePage/ClassReport";
import ClassHistory from "../screens/Trainer Home/SchedulePage/ClassHistory";

const TrainerHomeStackNavigator = createStackNavigator();

const TrainerHomeStack = () => {
  return (
    <TrainerHomeStackNavigator.Navigator
      initialRouteName="TrainerDashboard"
      screenOptions={{ headerShown: false }}
    >
      <TrainerHomeStackNavigator.Screen
        name="TrainerDashboard"
        component={TrainerDashboard}
      />
      <TrainerHomeStackNavigator.Screen
        name="Notification"
        component={Notification}
      />
      <TrainerHomeStackNavigator.Screen
        name="TrainerProfileStack"
        component={TrainerProfileStack}
      />
      <TrainerHomeStackNavigator.Screen
        name="TrainerWorkoutStack"
        component={TrainerWorkoutStack}
      />
      <TrainerHomeStackNavigator.Screen
        name="Schedule1"
        component={Schedule1}
      />
      <TrainerHomeStackNavigator.Screen
        name="MarkAttendance"
        component={MarkAttendance}
      />

      <TrainerHomeStackNavigator.Screen
        name="Member"
        component={TrainerMemberStack}
      />
      <TrainerHomeStackNavigator.Screen
        name="ClassAttendance"
        component={ClassAttendance}
      />
      <TrainerHomeStackNavigator.Screen
        name="ClassPastAttendance"
        component={ClassPastAttendance}
      />
      <TrainerHomeStackNavigator.Screen
        name="ClassReport"
        component={ClassReport}
      />
      <TrainerHomeStackNavigator.Screen
        name="ClassHistory"
        component={ClassHistory}
      />
      
    </TrainerHomeStackNavigator.Navigator>
  );
};

export default TrainerHomeStack;
