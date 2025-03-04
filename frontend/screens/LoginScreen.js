import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet,
  SafeAreaView,
} from "react-native";
import API_BASE_URL from "../env";
import * as SecureStore from 'expo-secure-store';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        navigation.navigate(data.role === "admin" ? "AdminPage" : "OnBoardingPage");
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeTitle}>Welcome</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        </Text>
      </View>

      <View style={styles.centerFormContainer}>
        <View style={styles.formBox}>
          <View style={styles.inputGroup}>
            <Text style={styles.hearder1}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
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
        </View>
      </View>

      <View style={styles.bottomActionContainer}>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUpPageStep1')}>
          <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>



      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "#fff",
    paddingHorizontal: 32,
  },
  header: {
    marginTop: 40,
  },
  // center container
  centerFormContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10
  },
  formBox: {
    backgroundColor: '#B3A0FF',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
  },
  bottomActionContainer: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    height: 48,
    width:250,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop:150,
  },
  signupText: {
    color: "#232323",
    fontSize: 14,
  },
  signupLink: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  hearder1:{
    fontSize:18,
    fontWeight:"bold",
    marginHorizontal: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 24,
  },
});

export default LoginScreen;