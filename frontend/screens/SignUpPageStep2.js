import React, { useState, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
import { 
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Keyboard
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SignUpPageStep2 = ({ navigation }) => {
  const [gender, setGender] = useState("male");
  const [dob, setDob] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  
  const heightInputRef = useRef();
  const weightInputRef = useRef();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

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
      
      <Text style={styles.subtitle}>Let's Get To Know More About You!</Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Gender</Text>
        <TouchableOpacity 
          style={styles.input} 
          onPress={() => setShowGenderPicker(true)}
        >
          <Text style={styles.inputText}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput 
          style={styles.input} 
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#999"
          value={dob} 
          onChangeText={setDob}
          onSubmitEditing={dismissKeyboard}
        />

        <Text style={styles.label}>Height</Text>
        <TextInput 
          ref={heightInputRef}
          style={styles.input} 
          placeholder="cm"
          placeholderTextColor="#999"
          keyboardType="numeric"
          returnKeyType="done"
          value={height} 
          onChangeText={setHeight}
          onSubmitEditing={() => heightInputRef.current.blur()}
        />

        <Text style={styles.label}>Weight</Text>
        <TextInput 
          ref={weightInputRef}
          style={styles.input} 
          placeholder="kg"
          placeholderTextColor="#999"
          keyboardType="numeric"
          returnKeyType="done"
          value={weight} 
          onChangeText={setWeight}
          onSubmitEditing={() => weightInputRef.current.blur()}
        />
      </View>

      {/* Gender Picker Modal */}
      <Modal
        visible={showGenderPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(value) => setGender(value)}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("SignUpPageStep3")}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#191919",
    paddingHorizontal: 15,
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
  subtitle: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 50,
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: "#B3A0FF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
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
    justifyContent: 'center',
  },
  inputText: {
    color: '#000',
  },
  button: {
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    width: "60%",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  doneButton: {
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    width: "60%",
    alignSelf: "center",
    marginTop: 15,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUpPageStep2;