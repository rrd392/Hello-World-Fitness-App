import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSignup } from "../../context/SignupForm";
import HeaderVer3 from "../HeaderVer3";

export default function SignUpPageStep3() {
  const navigation = useNavigation();
  const { signupData, setSignupData } = useSignup();
  
  const validateAndProceed = () => {
    if (
      !signupData.goal.trim() 
      ) {
      Alert.alert("Missing Information", "Please select one goal.");
      return; 
    }

    navigation.navigate("SignUpPageStep4"); 
  };

  const goals = ["Lose Weight", "Gain Weight", "Muscle Mass Gain", "Shape Body", "Others"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>
        <HeaderVer3
          title="Create Account"
          onPress={() => navigation.goBack()}
        />
      </KeyboardAvoidingView>

      <ScrollView contentContainerStyle={styles.viewContainer}>
        <Text style={styles.mainTitle}>What Is Your Goal?</Text>
        <Text style={styles.subtitle}>Choose a goal that best matches your focus</Text>

        <View style={styles.goalsContainer}>
          {goals.map((goal, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.inputContainer,
                signupData.goal === goal && styles.selectedGoal
              ]}
              onPress={() => setSignupData({ ...signupData, goal: goal })}
            >
              <Text style={[
                styles.goalText,
                signupData.goal === goal && styles.selectedGoalText
              ]}>
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={validateAndProceed}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity> 
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#232323",
  },
  container: {
    marginTop: 50,
  },
  viewContainer: {
    flex: 1,                
    justifyContent: "center",   
    alignItems: "center",       
    paddingVertical: 20,       
  },
  goalsContainer: {
    backgroundColor: "#B3A0FF",
    padding: 30,
    width:"100%",
    // borderRadius: 10,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  inputContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#E2F163",
  },
  selectedGoal: {
    backgroundColor: "#E2F163",
    borderColor: "#000",
  },
  goalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  selectedGoalText: {
    color: "#000",
  },
  continueButton: {
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    width: "60%",
    alignSelf: "center",
    marginTop: 30,
    backgroundColor: "#363636",

  },
  continueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});