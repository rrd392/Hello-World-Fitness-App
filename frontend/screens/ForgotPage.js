import React, { useState } from "react";
import { View, Text, TextInput, Alert, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ForgotPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailVerification = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch("http://192.168.100.19:3000/api/forgot-password", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        navigation.navigate('ResetPasswordPage', { email });
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.Title}>Forgotten Password</Text>
      </View>

      <Text style={styles.subtitle}>
        Enter your registered email to reset your password
      </Text>

      <View style={styles.centerFormContainer}>
        <View style={styles.formBox}>
          <View style={styles.inputGroup}>
            <Text style={styles.header1}>Email</Text>
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
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleEmailVerification}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Checking..." : "Verify Email"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  backButton: {
    marginRight: 10, // Adjust spacing between button and title
  },
  Title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    flex: 1, // Ensures centering within the header
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 24,
    marginTop: 10,
  },
  centerFormContainer: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    paddingBottom: 50, // Prevents button from sticking to the bottom
  },
  formBox: {
    backgroundColor: "#B3A0FF",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: "100%", // Set a fixed width to keep form balanced
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
    marginTop: 20, // Ensures button is separate from the form
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    height: 48,
    width: 250,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header1: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ForgotPage;