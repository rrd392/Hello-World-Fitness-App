import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpPageStep3() {
  const navigation = useNavigation();
  const [selectedGoal, setSelectedGoal] = useState(null);

  const goals = ["Lose Weight", "Gain Weight", "Muscle Mass Gain", "Shope Body", "Others"];

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={26} color="#E2F163" />
      </TouchableOpacity>
      <Text style={styles.title}>Create Account</Text>
    </View>

    <Text style={styles.mainTitle}>What Is Your Goal?</Text>
    <Text style={styles.subtitle}>Choose a goal that best matches your focus</Text>


        <View style={styles.formContainer}>
        <ScrollView contentContainerStyle={styles.goalsContainer}>
          {goals.map((goal, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.inputContainer,
                selectedGoal === goal && styles.selectedGoal
              ]}
              onPress={() => setSelectedGoal(goal)}
            >
              <Text style={[
                styles.goalText,
                selectedGoal === goal && styles.selectedGoalText
              ]}>
                {goal}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={() => navigation.navigate("SignUpPageStep4")}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E2F163",
    textAlign: "center",
    flex: 1,
  },
  formContainer: {
    backgroundColor: "#B3A0FF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 55,
    flex: 1,
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
  goalsContainer: {
    flexGrow: 1,
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
  },
  continueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});