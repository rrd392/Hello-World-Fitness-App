import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TrainerDashboard from "../screens/Trainer Home/TrainerDashboard";
import TrainerProfileStack from "./TrainerProfileStack";
// import WorkoutPlanStack from "./WorkoutPlanStack";
import Notification from "../screens/Trainer Home/Notification";
// import CheckIn from "../screens/Home/CheckIn";
// import Classes from "../screens/Home/ClassesPage/Classes";
// import SelectedClass from "../screens/Home/ClassesPage/SelectedClass";
// import Nutrition from "../screens/Home/Nutrition/Nutrition";
// import CalculateMeal from "../screens/Home/Nutrition/CalculateMeal";
// import SelectedMeal from "../screens/Home/Nutrition/SelectedMeal";
// import YourClasses from "../screens/Home/ClassesPage/YourClasses";
import Schedule1 from "../screens/Trainer Home/SchedulePage/Schedule1";

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
        name="Schedule1"
        component={Schedule1}
      />
      {/* <TrainerHomeStackNavigator.Screen name="WorkoutPlanStack" component={WorkoutPlanStack} />
      <TrainerHomeStackNavigator.Screen name="CheckIn" component={CheckIn} />
      <TrainerHomeStackNavigator.Screen name="Classes" component={Classes} />
      <TrainerHomeStackNavigator.Screen
        name="SelectedClass"
        component={SelectedClass}
      />
      <TrainerHomeStackNavigator.Screen name="YourClasses" component={YourClasses} />
      <TrainerHomeStackNavigator.Screen name="Nutrition" component={Nutrition} />
      <TrainerHomeStackNavigator.Screen
        name="CalculateMeal"
        component={CalculateMeal}
      />
      <TrainerHomeStackNavigator.Screen name="SelectedMeal" component={SelectedMeal} /> */}
    </TrainerHomeStackNavigator.Navigator>
  );
};

export default TrainerHomeStack;
