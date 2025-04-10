import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSignup } from "../../context/SignupForm";
import HeaderVer3 from "../HeaderVer3";

const SignUpPageStep1 = () => {
  const navigation = useNavigation();
  const { signupData, setSignupData } = useSignup();

  const validateAndProceed = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactRegex = /^[0-9]{10,11}$/; 
    if (
      !signupData.email.trim() ||
      !signupData.username.trim() ||
      !signupData.password.trim() ||
      !signupData.name.trim() ||
      !signupData.contact.trim()
    ) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    if (!emailRegex.test(signupData.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
  
    if (!contactRegex.test(signupData.contact)) {
      Alert.alert("Invalid Contact Number", "Please enter a valid contact number (10-11 digits).");
      return;
    }

    navigation.navigate("SignUpPageStep2");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>

        <HeaderVer3
          title="Create Account"
          onPress={() => navigation.goBack()}
        />
      </KeyboardAvoidingView>


      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.subtitle}>Let's Start!</Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="example@example.com"
            placeholderTextColor="#999"
            value={signupData.email}
            onChangeText={(text) => setSignupData({ ...signupData, email: text.replace(/[^a-zA-Z0-9@._-]/g, '') })}
          />

          <Text style={styles.label}>Username <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={signupData.username}
            onChangeText={(text) => setSignupData({ ...signupData, username: text.replace(/[^a-zA-Z0-9_]/g, '') })}
          />

          <Text style={styles.label}>Password <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="************"
            secureTextEntry
            placeholderTextColor="#999"
            value={signupData.password}
            onChangeText={(text) => setSignupData({ ...signupData, password: text.trim() })}
          />

          <Text style={styles.label}>Name <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor="#999"
            value={signupData.name}
            onChangeText={(text) => setSignupData({ ...signupData, name: text.replace(/[^a-zA-Z0-9_/ ]/g, '') })}
          />

          <Text style={styles.label}>Contact No. <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="0123456789"
            keyboardType="numeric"
            returnKeyType="done"
            placeholderTextColor="#999"
            value={signupData.contact}
            onChangeText={(text) => setSignupData({ ...signupData, contact: text })}
          />
        </View>

        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          By continuing, you agree to{" "}
          <Text style={styles.linkText}>Terms of Use</Text> and{" "}
          <Text style={styles.linkText}>Privacy Policy</Text>.
        </Text>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={validateAndProceed}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text style={styles.loginText} onPress={() => navigation.navigate("Login")}>
            Log in
          </Text>
        </Text>
      </ScrollView>
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

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "#B3A0FF",
    padding: 30,
    // borderRadius: 10,
    marginTop: 15,
    width: '100%'
  },
  label: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 45,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  termsText: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 13,
    marginTop: 15,
    paddingHorizontal: 30,
  },
  linkText: {
    color: "#E2F163",
    fontWeight: "bold",
  },
  button: {
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    width: "60%",
    alignSelf: "center",
    marginTop: 15,
    backgroundColor:"#363636",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  footerText: {
    color: "#999",
    textAlign: "center",
    marginTop: 15,
  },
  loginText: {
    color: "#E2F163",
    fontWeight: "bold",
  },
});

export default SignUpPageStep1;
