import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderVer1 from "../HeaderVer1";
import { getUserId } from '../getUserId';
import API_BASE_URL from "../../env";
import * as ImagePicker from "react-native-image-picker";

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

    const [showDatePicker, setShowDatePicker] = useState(false);

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
    
        if (!result.canceled) {
            setUpdateData((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
            await uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (imageUri) => {
        setUploading(true);
    
        let formData = new FormData();
        formData.append("image", {
            uri: imageUri,
            type: "image/jpeg",
            name: "profile.jpg",
        });
    
        try {
            let response = await fetch(`${API_BASE_URL}/upload`, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            let result = await response.json();
            setUploading(false);
    
            if (response.ok) {
                Alert.alert("Success", "Image uploaded successfully!");
                setUpdateData((prev) => ({ ...prev, profileImage: result.imageUrl })); // Use server image URL
            } else {
                Alert.alert("Error", result.message);
            }
        } catch (error) {
            console.log("Upload Error:", error);
            Alert.alert("Error", "Failed to upload image");
            setUploading(false);
        }
    };    

    const handleUpdateProfile = () => {
        // Handle profile update logic
        console.log('Profile Updated!');
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
                                    ? { uri: updateData.profileImage }
                                    : require("../../assets/icon.png")}
                                style={styles.profileImage}
                            />
                            <View style={styles.semiCircleShadow} />
                            <View style={styles.cameraIconContainer}>
                                <Ionicons name="camera-outline" size={24} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.profileImageContainer} onPress={() => console.log("Profile image")}>
                            <Image
                                source={updateData.profileImage ? {uri: `${API_BASE_URL}/uploads/${upcomingClassData[0].class_image}`}
                                  :require("../../assets/icon.png")} 
                                style={styles.profileImage}
                            />
                            <View style={styles.semiCircleShadow} />
                            <View style={styles.cameraIconContainer}>
                                <Ionicons name="camera-outline" size={24} color="#fff" />
                            </View>
                        </TouchableOpacity> */}

                        <View style={styles.profileInfo}>
                            <Text style={styles.userName}>{updateData.name}</Text>
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
                        <TouchableOpacity style={styles.DOBContainer} onPress={() => setShowDatePicker(true)} >
                            <TextInput
                                style={styles.input}
                                value={updateData.dob.toLocaleDateString('en-GB')}
                                placeholder="Select Date of Birth"
                                placeholderTextColor="#777"
                                editable={false}
                            />
                            <Ionicons style={styles.calendarIcon} name="calendar-outline" size={24} color="#000" />

                            {showDatePicker && (
                                <DateTimePicker
                                    value={updateData.dob}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) { setUpdateData((prevData) => ({...prevData,dob: selectedDate}));}
                                    }}
                                    maximumDate={new Date()} 
                                    style={styles.picker}
                                />
                            )}
                        </TouchableOpacity>

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
        overflow: 'hidden', // Ensures round shape if the image is round
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
        height: 30, // half the height for a semicircle
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

    /* Form Section */
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
    selectedText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 8,
    },

    updateButton: {
        backgroundColor: '#E2F163',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 40,
        marginTop: 8,
        marginBottom:20,
        alignSelf: "center",
    },
    updateButtonText: {
        color: '#212020',
        fontSize: 16,
        fontWeight: 'bold',
    },


});
export default UpdateProfile;