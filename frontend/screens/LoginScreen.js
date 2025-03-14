import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import API_BASE_URL from "../env";
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { loginContext } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // const { logoutContext } = useContext(AuthContext);

  // async function logout() {
  //   await SecureStore.deleteItemAsync("userToken");
  //   logoutContext();
  //   console.log("Logged out, token removed.");
  // }

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });



      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
      }

      const data = await response.json();

      if (data.success) {
        await SecureStore.setItemAsync("userToken", data.token);
        // navigation.navigate(data.role === "admin" ? "AdminPage" : "Home", { screen: "MemberDashboard" });
        loginContext();
      } else {
        Alert.alert("Login Failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.title}>Log In</Text>

        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.subtitle}>
            Your fitness journey starts here! Log in to book classes, track your progress, and stay motivated.
          </Text>
        </View>

        <View style={styles.formBox}>
          <View style={styles.inputGroup}>
            <Text style={styles.hearder1}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
              autoCapitalize="none"
              onChangeText={setUsername}
              value={username}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.hearder1}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="*************"
              placeholderTextColor="#999"
              autoCapitalize="none"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => navigation.navigate('ForgotPage')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => logout()}
          >
            <Text style={styles.forgotPasswordText}>Logout</Text>
          </TouchableOpacity> */}
        </View>


      </KeyboardAvoidingView>
      <View style={styles.bottomActionContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignupStack')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  title: {
    fontSize: 24,
    color: "#E2F163",
    textAlign: "center",
    fontWeight: "bold",
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 12,
  },

  formBox: {
    backgroundColor: '#B3A0FF',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginHorizontal: 32,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: "#232323",
    fontSize: 14,
    fontWeight: "bold",
  },
  bottomActionContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    marginTop: 50,
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
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  signupText: {
    color: "white",
    fontSize: 14,
  },
  signupLink: {
    color: "#E2F163",
    fontSize: 14,
    fontWeight: "500",
  },

  hearder1: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 24,
  },
});

export default LoginScreen;