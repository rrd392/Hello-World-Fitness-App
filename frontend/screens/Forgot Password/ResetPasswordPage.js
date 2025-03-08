import React, { useState } from "react";
import { View, Text, TextInput, Alert, SafeAreaView, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import API_BASE_URL from "../../env";
import HeaderVer3 from "../HeaderVer3";

const ResetPasswordPage = ({ route, navigation }) => {
  const { email, token } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,  
          newPassword: newPassword.trim(),
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Password updated successfully!");
        navigation.navigate('Login');
      } else {
        Alert.alert("Error", data.error || "Password reset failed");
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      Alert.alert("Error", "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>

        <HeaderVer3
          title="Reset Password"
          onPress={() => navigation.goBack()}
        />

        <Text style={styles.subtitle}>
          Set your new password below.
          Make sure it's strong and easy to remember. Once updated, you can log in with your new password.
        </Text>

        <View style={styles.centerFormContainer}>
          <View style={styles.formBox}>
            <View style={styles.inputGroup}>
              <Text style={styles.header1}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#999"
                onChangeText={setNewPassword}
                value={newPassword}
                secureTextEntry
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.header1}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#999"
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.bottomActionContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handlePasswordReset}
              disabled={isLoading}
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Text>
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

  subtitle: {
    marginTop:60,
    marginBottom:30,
    fontSize: 14,
    color: "white",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal:24,

  },
  centerFormContainer: {
    justifyContent: "center",
    paddingBottom: 50, // Prevents button from sticking to the bottom
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
  },

  header1: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  bottomActionContainer: {
    marginTop: 50, // Ensures button is separate from the form
    justifyContent: "center",
    alignItems: "center",
  },

  resetButton: {
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
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResetPasswordPage;
