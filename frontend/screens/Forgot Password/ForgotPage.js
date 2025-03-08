import React, { useState } from "react";
import { View, Text, TextInput, Alert, SafeAreaView, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../env";

import HeaderVer3 from "../HeaderVer3";

const ForgotPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailVerification = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json(); // <-- Fixed this line

      if (data.success) {
        Alert.alert("Success", "Email verified! You can now reset your password.");
        navigation.navigate("ResetPasswordPage", { email });
      } else {
        Alert.alert("Error", data.error || "Email verification failed");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Could not verify email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>
        <HeaderVer3 title="Forgotten Password" onPress={() => navigation.goBack()} />

        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Enter your registered email to reset your password</Text>
        </View>

        <View style={styles.centerFormContainer}>
          <View style={styles.formBox}>
            <View style={styles.inputGroup}>
              <Text style={styles.header1}>Email address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter registered email"
                placeholderTextColor="#999"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.bottomActionContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleEmailVerification} disabled={isLoading}>
              <Text style={styles.loginButtonText}>{isLoading ? "Checking..." : "Verify Email"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#232323",
  },
  container: {
    marginTop: 50,
  },
  header: {
    marginVertical: 50,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    lineHeight: 20,
  },
  centerFormContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
    paddingHorizontal: 32,
  },
  formBox: {
    backgroundColor: "#B3A0FF",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  bottomActionContainer: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#363636",
    height: 48,
    width: 200,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  header1: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ForgotPage;
