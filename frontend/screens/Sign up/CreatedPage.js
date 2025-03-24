import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CreatedPage = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={80} color="#E2F163" />
        </View>

        {/* Success Title */}
        <Text style={styles.successTitle}>Payment Successful</Text>

        {/* Success Message */}
        <Text style={styles.successMessage}>
          Get ready to crush your fitness goals.
        </Text>
        <Text style={styles.successMessage}>
          We're excited to have you on board!
        </Text>

        {/* Membership Confirmation */}
        <Text style={styles.membershipText}>Your Membership Has Been</Text>
        <Text style={styles.activatedText}>Activated</Text>

        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={() => navigation.navigate("OnBoardingPage")}
        >
          <Text style={styles.continueButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#232323",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E2F163",
    textAlign: "center",
    marginBottom: 20,
  },
  successMessage: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 24,
  },
  membershipText: {
    fontSize: 20,
    color: "#FFF",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 5,
  },
  activatedText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E2F163",
    textAlign: "center",
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: "#E2F163",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

export default CreatedPage;