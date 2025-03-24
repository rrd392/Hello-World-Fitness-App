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
  ScrollView,
  Alert, Platform,
  KeyboardAvoidingView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSignup } from "../../context/SignupForm";
import DateTimePicker from "@react-native-community/datetimepicker";
import HeaderVer3 from "../HeaderVer3";


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

  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
      if (selectedDate) {
          const fixedDate = new Date(selectedDate);
          fixedDate.setHours(12, 0, 0, 0);
          setSignupData((prevData) => ({ ...prevData, dob: fixedDate }));
      }
      setShowPicker(false); 
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
          <TouchableOpacity style={styles.DOBContainer} onPress={() => setShowPicker(true)}>
            <TextInput
                style={styles.input}
                placeholder="Select Date"
                placeholderTextColor="#777"
                value={signupData.dob.toLocaleDateString('en-GB')}
                editable={false}
            />
            <Ionicons style={styles.calendarIcon} name="calendar-outline" size={24} color="#000" />

            {Platform.OS === "ios" && showPicker && (
              <DateTimePicker
                value={signupData.dob || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                      const fixedDate = new Date(selectedDate);
                      fixedDate.setHours(12, 0, 0, 0);      
                      setSignupData((prevData) => ({ ...prevData, dob: fixedDate }));
                  }
                }}
                style={styles.dateInput}
              />
            )}
          </TouchableOpacity>
          {/* Date Picker for Android (Modal) */}
          {Platform.OS === "android" && showPicker && (
            <Modal transparent={true} animationType="slide">
                <View style={styles.modalContainer1}>
                    <View style={styles.modalContent}>
                        <DateTimePicker
                            value={signupData.dob}
                            mode="date"
                            display="calendar"
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                        />
                        <TouchableOpacity onPress={() => setShowPicker(false)}>
                            <Text style={styles.closeButton}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
          )}
        
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
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female"/>
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
  safeArea: {
    flex: 1,
    backgroundColor: "#232323",
  },
  container: {
    marginTop: 50,
  },
  modalContainer1: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10 },
  closeButton: { marginTop: 10, textAlign: "center", color: "blue" },
  scrollContainer: {
    flexGrow: 1,                
    justifyContent: "center",   
    alignItems: "center",             
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
    backgroundColor:'white',
    position:'absolute',
    marginTop:5,
    marginLeft:2,
  },
  DOBContainer: {
    position: "relative",
  },
  calendarIcon: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -20 }]
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
    backgroundColor: "#363636",

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