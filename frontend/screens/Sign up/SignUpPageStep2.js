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
  Keyboard,
  ScrollView,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSignup } from "../../context/SignupForm";
import DateTimePicker from "@react-native-community/datetimepicker";

const SignUpPageStep2 = () => {
  const navigation = useNavigation();
  const { signupData, setSignupData } = useSignup();
  
  const validateAndProceed = () => {
    if (
      !signupData.gender.trim() ||
      !signupData.dob ||
      !signupData.height.trim() ||
      !signupData.weight.trim() 
      ) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return; 
    }

    navigation.navigate("SignUpPageStep3"); 
  };

  const [showGenderPicker, setShowGenderPicker] = useState(false);
  
  const heightInputRef = useRef();
  const weightInputRef = useRef();

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
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.subtitle}>Let's Get To Know More About You!</Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Gender <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowGenderPicker(true)}
          >
            <Text style={styles.inputText}>{signupData.gender.charAt(0).toUpperCase() + signupData.gender.slice(1)}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Date of Birth <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
          <DateTimePicker
            value={signupData.dob || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setSignupData({ ...signupData, dob: selectedDate });
              }
            }}
            style={styles.dateInput}
          />

          <Text style={styles.label}>Height <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
          <TextInput 
            ref={heightInputRef}
            style={styles.input} 
            placeholder="cm"
            placeholderTextColor="#999"
            keyboardType="numeric"
            returnKeyType="done"
            value={signupData.height}
            onChangeText={(text) => setSignupData({ ...signupData, height: text })}
            onSubmitEditing={() => heightInputRef.current.blur()}
          />

          <Text style={styles.label}>Weight <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
          <TextInput 
            ref={weightInputRef}
            style={styles.input} 
            placeholder="kg"
            placeholderTextColor="#999"
            keyboardType="numeric"
            returnKeyType="done"
            value={signupData.weight}
            onChangeText={(text) => setSignupData({ ...signupData, weight: text })}
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
                selectedValue={signupData.gender}
                onValueChange={(value) => setSignupData({ ...signupData, gender: value })}
                style={{color:'black'}}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female"/>
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
          onPress={validateAndProceed}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: "#000",
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
    marginTop:30,
    marginBottom: 30,
    width:"100%",
    borderRadius: 10,
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
  dateInput:{
    height: 45,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
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
    backgroundColor: '#B3A0FF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  doneButton: {
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    backgroundColor: "#FFF",
    width: "60%",
    alignSelf: "center",
    marginBottom: 15,
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: 500,
  },
});

export default SignUpPageStep2;