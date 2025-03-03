import React, { useState } from "react";
import { View, Text, TextInput, Alert, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";

const ResetPasswordPage = ({ route, navigation }) => {
  const { email, token } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.100.19:3000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token,
          newPassword
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
      Alert.alert("Error", "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.Title}>Reset Password</Text>
      </View>

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
            style={styles.loginButton} 
            onPress={handlePasswordReset}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "Resetting..." : "Reset Password"}
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
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 32,
  },
  backButton: {
    marginTop: 20,
    marginLeft: 10,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "yellow",
  },
  subtitle: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
    paddingHorizontal: 24,
    marginTop: 10,
    lineHeight: 20,
  },
  centerFormContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  formBox: {
    backgroundColor: "#B3A0FF",
    padding: 24,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
  resetButton: {
    backgroundColor: "#333",
    height: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResetPasswordPage;
