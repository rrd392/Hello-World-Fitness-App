import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert, Platform, Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderVer1 from "../HeaderVer1";
import { getUserId } from '../getUserId';
import API_BASE_URL from "../../env";
import * as ImagePicker from "expo-image-picker";

const UpdateProfile = () => {

    const navigation = useNavigation();
    const [userId, setUserId] = useState("");
    
    useEffect(() => {
        async function fetchUserId() {
            const token = await getUserId();
            setUserId(token.id);
        }
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {  
            fetchUserData();
        }
    }, [userId]);

    const [updateData, setUpdateData] = useState({
        email: "",
        username: "",
        password: "",
        name: "",
        contact: "",
        dob: new Date(),
        gender: "",
        height:"",
        weight:"",
        goal:"",
        dateJoined: new Date(),
        profileImage:"",
        membershipPlan:""
    });

    const fetchUserData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/profile/displayUserData/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
    
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
          }
    
          const data = await response.json();
    
          if (data) {
            setUpdateData((prevData) => ({
                ...prevData,
                email: data.email || "",
                username: data.username || "",
                password: "", 
                name: data.name || "",
                contact: data.contact_number || "",
                dob: data.date_of_birth ? new Date(data.date_of_birth) : new Date(),
                gender: data.gender || "",
                height: data.height || "",
                weight: data.weight || "",
                goal: data.fitness_goals || "",
                dateJoined : data.date_joined ? new Date(data.date_joined) : new Date(),
                profileImage: data.profile_picture || "",
                membershipPlan: data.plan_name || ""
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", error.message || "Network request failed");
        }
    };

    //fitness goal dropdown
    const [showFitnessGoalDropdown, setShowFitnessGoalDropdown] = useState(false);
    const goalitems = [
        { label: 'Select Fitness Goal', value: '', disabled: true },
        { label: 'Lose Weight', value: 'Lose Weight' },
        { label: 'Gain Weight', value: 'Gain Weight' },
        { label: 'Muscle Mass Gain', value: 'Muscle Mass Gain' },
        { label: 'Shape Body', value: 'Shape Body' },
        { label: 'Others', value: 'Others' },
    ];

    //gender dropdown
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const genderitems =[
        { label: 'Select gender', value: '', disabled: true },
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];

    //Upload image
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        // Request media library permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "We need access to your gallery to upload images.");
            return;
        }
    
        // Launch Image Picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
            await uploadImage(result.assets[0].uri, updateData.username);
        }        
    };

    const uploadImage = async (imageUri, username) => {
        setUploading(true);
    
        let formData = new FormData();
        formData.append("image", {
            uri: imageUri,
            type: "image/jpeg",
            name: `${username}.jpg`,
        });
        formData.append("userId", userId); 
    
        try {
            let response = await fetch(`${API_BASE_URL}/api/profile/uploadImage`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                },
            });
    
            let result = await response.json();
            setUploading(false);
    
            if (response.ok) {
                ((prev) => ({ ...prev, profileImage: result.imageUrl })); 
                Alert.alert("Success", "Image uploaded successfully!");
            } else {
                Alert.alert("Error", result.message);
            }
        } catch (error) {
            console.log("Upload Error:", error);
            Alert.alert("Error", "Failed to upload image");
            setUploading(false);
        }
    };    

    const handleUpdateProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/updateUser`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ updateData, userId })
            });
      
            const data = await response.json();
      
            if (data.success) {
                Alert.alert(data.message);
                fetchUserData();
            }else{
                Alert.alert(data.message);
            }
        } catch (error) {
        console.error("Error updating user data:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    };

    const [showPicker, setShowPicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        if (selectedDate) {
            const fixedDate = new Date(selectedDate);
            fixedDate.setHours(12, 0, 0, 0);
            setUpdateData((prevData) => ({ ...prevData, dob: fixedDate }));
        }
        setShowPicker(false); 
    };

    return (
        <View style={styles.container} nestedScrollEnabled={true}>
            <SafeAreaView>
                <HeaderVer1
                    title="Profile"
                    onPress={() => navigation.goBack()}
                />
                <ScrollView>
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage} disabled={uploading}>
                            <Image
                                source={updateData.profileImage
                                    ? { uri: `${API_BASE_URL}/uploads/${updateData.profileImage}?t=${Date.now()}`}
                                    : require("../../assets/icon.png")}
                                style={styles.profileImage}
                            />
                            <View style={styles.semiCircleShadow} />
                            <View style={styles.cameraIconContainer}>
                                <Ionicons name="camera-outline" size={24} color="#fff" />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>{updateData.username}</Text>
                            <Text style={styles.userSubtitle}>Hello World Fitness</Text>
                            <Text style={styles.userSubtitle}>Member Since {updateData.dateJoined.toLocaleDateString('en-GB')}</Text>
                            <Text style={styles.membershipBadge}>{updateData.membershipPlan}</Text>
                        </View>

                    </View>


                    {/* Personal Details Form */}
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Personal Details</Text>

                        <Text style={styles.label}>Full name</Text>
                        <TextInput
                            style={styles.input}
                            value={updateData.name}
                            onChangeText={(text) =>setUpdateData((prevData) => ({...prevData,name: text.replace(/[^a-zA-Z0-9_/ ]/g, ''),}))}                            
                            placeholder="Enter full name"
                            placeholderTextColor="#777"
                        />

                        <Text style={styles.label}>Gender</Text>
                        <DropDownPicker
                            open={showGenderDropdown}
                            value={updateData.gender}
                            items={genderitems}
                            setOpen={setShowGenderDropdown}
                            setValue={(callback) => 
                                setUpdateData(prevData => ({
                                    ...prevData,
                                    gender: callback(prevData.gender) 
                                }))
                            }
                            placeholder="Select gender"
                            nestedScrollEnabled={true}
                            listMode="SCROLLVIEW"
                            style={styles.dropdown}
                            textStyle={styles.dropdownText}
                            containerStyle={{ marginBottom: 16 }}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={updateData.email}
                            onChangeText={(text) =>setUpdateData((prevData) => ({...prevData,email: text.replace(/[^a-zA-Z0-9@._-]/g, '')}))}
                            placeholder="Enter email"
                            keyboardType="email-address"
                            placeholderTextColor="#777"
                        />

                        <Text style={styles.label}>Contact Number</Text>
                        <TextInput
                            style={styles.input}
                            value={updateData.contact}
                            onChangeText={(text) =>setUpdateData((prevData) => ({...prevData,contact: text}))}
                            placeholder="Enter phone number"
                            keyboardType="phone-pad"
                            placeholderTextColor="#777"
                        />

                        <Text style={styles.label}>Date of Birth</Text>
                        <TouchableOpacity style={styles.DOBContainer} onPress={() => setShowPicker(true)}>
                            <TextInput
                                style={styles.input}
                                placeholder="Select Date"
                                placeholderTextColor="#777"
                                value={updateData.dob.toLocaleDateString('en-GB')}
                                editable={false}
                            />
                            <Ionicons style={styles.calendarIcon} name="calendar-outline" size={24} color="#000" />

                            {Platform.OS === "ios" && showPicker && (
                                <DateTimePicker
                                    value={updateData.dob}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            const fixedDate = new Date(selectedDate);
                                            fixedDate.setHours(12, 0, 0, 0);
                                            setUpdateData((prevData) => ({ ...prevData, dob: fixedDate }));
                                        }
                                    }}                                                                                                                       
                                    maximumDate={new Date()} 
                                    style={styles.picker}
                                />
                            )}
                        </TouchableOpacity>
                        {/* Date Picker for Android (Modal) */}
                        {Platform.OS === "android" && showPicker && (
                            <Modal transparent={true} animationType="slide">
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                        <DateTimePicker
                                            value={updateData.dob}
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

                        <Text style={styles.label}>Weight</Text>
                        <TextInput
                            style={styles.input}
                            value={updateData.weight ? updateData.weight.toString() : ""}
                            onChangeText={(text) =>setUpdateData((prevData) => ({...prevData,weight: text}))}
                            placeholder="75 (in kg)"
                            placeholderTextColor="#777"
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Height</Text>
                        <TextInput
                            style={styles.input}
                            value={updateData.height ? updateData.height.toString() : ""}
                            onChangeText={(text) =>setUpdateData((prevData) => ({...prevData,height: text}))}
                            placeholder="165 (in cm)"
                            placeholderTextColor="#777"
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Fitness Goal</Text>
                        <DropDownPicker
                            open={showFitnessGoalDropdown}
                            value={updateData.goal}
                            items={goalitems}
                            setOpen={setShowFitnessGoalDropdown}
                            setValue={(callback) => 
                                setUpdateData(prevData => ({
                                    ...prevData,
                                    goal: callback(prevData.goal) 
                                }))
                            }                            
                            placeholder="Select fitness goal"
                            nestedScrollEnabled={true}
                            listMode="SCROLLVIEW"
                            style={styles.dropdown}
                            textStyle={styles.dropdownText}
                            containerStyle={{ marginBottom: 16 }}
                        />

                        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                            <Text style={styles.updateButtonText}>Update Profile</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>

    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#212020",

    },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10 },
    closeButton: { marginTop: 10, textAlign: "center", color: "blue" },
    headerSection: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    profileInfo: {
        marginLeft: 20,
    },

    profileImageContainer: {
        position: 'relative',
        width: 120,
        height: 120,
        borderRadius: 75,
        overflow: 'hidden', 
        justifyContent: 'center',
        alignItems: 'center',
    },

    profileImage: {
        width: '100%',
        height: "100%",
    },

    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        paddingVertical: 5,
    },

    semiCircleShadow: {
        position: 'absolute',
        bottom: 0,
        width: 110,
        height: 30, 
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignSelf: 'center',
    },

    userName: { fontSize: 24, fontWeight: "bold", color: "#fff" },
    userSubtitle: { color: "#A5A5A5", marginBottom: 5 },
    membershipBadge: {
        marginTop: 5,
        backgroundColor: "#FFF",
        color: "#896CFE",
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        fontWeight: "bold",
        textAlign: "center",
    },

    formSection: {
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        color: '#896CFE',
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: 15,
        padding: 12,
        fontSize: 18,
        marginBottom: 16,
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

    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 12,
    },
    dropdownText: {
        color: '#000',
        fontSize: 18,
    },

    updateButton: {
        backgroundColor: '#E2F163',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 40,
        marginTop: 8,
        marginBottom:20,
        alignSelf: "center",
        marginBottom: 40,
    },
    updateButtonText: {
        color: '#212020',
        fontSize: 16,
        fontWeight: 'bold',
    },
    picker:{
        backgroundColor:'white',
        position:'absolute',
        marginTop:8,
        marginLeft:5
    }

});
export default UpdateProfile;