import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; 
import { useSignup } from "../../context/SignupForm";

const SignUpPageStep1 = () => {
  const navigation = useNavigation();
  const { signupData, setSignupData } = useSignup();

  // const [email, setEmail] = useState("");
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [name, setName] = useState("");
  // const [contact, setContact] = useState("");

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

      <Text style={styles.subtitle}>Let's Start!</Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@example.com"
          placeholderTextColor="#999"
          value={signupData.email}
          onChangeText={(text) => setSignupData({ ...signupData, email: text })}
          
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={signupData.username}
          onChangeText={(text) => setSignupData({ ...signupData, username: text })}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="************"
          secureTextEntry
          placeholderTextColor="#999"
          value={signupData.password}
          onChangeText={(text) => setSignupData({ ...signupData, password: text })}
        />

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#999"
          value={signupData.name}
        onChangeText={(text) => setSignupData({ ...signupData, name: text })}
        />

        <Text style={styles.label}>Contact No.</Text>
        <TextInput
          style={styles.input}
          placeholder="+123 567 89000"
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
        onPress={() => navigation.navigate("SignUpPageStep2")}
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

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#191919",
    paddingHorizontal: 15,
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
  subtitle: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "#B3A0FF",
    padding: 20,
    marginTop: 15,
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
    paddingHorizontal:30,
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
