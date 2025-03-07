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

const UpdateProfile = () => {

    const navigation = useNavigation();

    const [fullName, setFullName] = useState('Madison Smith');
    const [email, setEmail] = useState('madisons@example.com');
    const [contactNumber, setContactNumber] = useState('123 567 8900');
    const [weight, setWeight] = useState('75');
    const [height, setHeight] = useState('165');

    //date picker for DOB
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [displayDob, setDisplayDob] = useState('01 / 04 / 199X');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDOBChange = (event, selectedDate) => {
        if (selectedDate === undefined) {
            setShowDatePicker(false);
            return;
        }
        setDateOfBirth(selectedDate);
        setDisplayDob(formatDate(selectedDate));
        setShowDatePicker(false);
    };

    //fitness goal dropdown
    const [showFitnessGoalDropdown, setShowFitnessGoalDropdown] = useState(false);
    const [fitnessGoal, setFitnessGoal] = useState('Muscle Mass Gain');
    const [goalitems, setGoalItems] = useState([
        { label: 'Select Fitness Goal', value: '', disabled: true },
        { label: 'Lose Weight', value: 'Lose Weight' },
        { label: 'Gain Weight', value: 'Gain Weight' },
        { label: 'Muscle Mass Gain', value: 'Muscle Mass Gain' },
        { label: 'Shape Body', value: 'Shape Body' },
    ]);

    //gender dropdown
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [gender, setGender] = useState('Female');
    const [genderitems, setGenderItems] = useState([
        { label: 'Select gender', value: '', disabled: true },
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ]);

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' });
    }

    const handleUpdateProfile = () => {
        // Handle profile update logic
        console.log('Profile Updated!');
    };


    return (
        <ScrollView style={styles.container} nestedScrollEnabled={true}>
            <SafeAreaView>
                <HeaderVer1
                    title="Profile"
                    onPress={() => navigation.goBack()}
                />

                {/* Header Section */}
                <View style={styles.headerSection}>
                    <TouchableOpacity style={styles.profileImageContainer} onPress={() => console.log("Profile image")}>
                        <Image
                            source={require("../../assets/icon.png")} //put profile image here
                            style={styles.profileImage}
                        />
                        <View style={styles.semiCircleShadow} />
                        <View style={styles.cameraIconContainer}>
                            <Ionicons name="camera-outline" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>Madison Smith</Text>
                        <Text style={styles.userSubtitle}>Hello World Fitness</Text>
                        <Text style={styles.userSubtitle}>Member Since Jan 2025</Text>
                        <Text style={styles.membershipBadge}>Standard Monthly</Text>
                    </View>

                </View>


                {/* Personal Details Form */}
                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Personal Details</Text>

                    <Text style={styles.label}>Full name</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter full name"
                        placeholderTextColor="#777"
                    />

                    <Text style={styles.label}>Gender</Text>
                    <DropDownPicker
                        open={showGenderDropdown}
                        value={gender}
                        items={genderitems}
                        setOpen={setShowGenderDropdown}
                        setValue={setGender}
                        setItems={setGenderItems}
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
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter email"
                        keyboardType="email-address"
                        placeholderTextColor="#777"
                    />

                    <Text style={styles.label}>Contact Number</Text>
                    <TextInput
                        style={styles.input}
                        value={contactNumber}
                        onChangeText={setContactNumber}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                        placeholderTextColor="#777"
                    />

                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity style={styles.DOBContainer} onPress={() => setShowDatePicker(true)} >
                        <TextInput
                            style={styles.input}
                            value={displayDob}
                            placeholder="Select Date of Birth"
                            placeholderTextColor="#777"
                            editable={false}
                        />
                        <Ionicons style={styles.calendarIcon} name="calendar-outline" size={24} color="#000" />

                        {showDatePicker && (
                            <DateTimePicker
                                value={dateOfBirth}
                                mode="date"
                                display="default"
                                onChange={onDOBChange}
                                maximumDate={new Date()} // Prevent selecting a future date
                                style={styles.picker}
                            />
                        )}
                    </TouchableOpacity>



                    <Text style={styles.label}>Weight</Text>
                    <TextInput
                        style={styles.input}
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="75 (in kg)"
                        placeholderTextColor="#777"
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Height</Text>
                    <TextInput
                        style={styles.input}
                        value={height}
                        onChangeText={setHeight}
                        placeholder="165 (in cm)"
                        placeholderTextColor="#777"
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Fitness Goal</Text>
                    <DropDownPicker
                        open={showFitnessGoalDropdown}
                        value={fitnessGoal}
                        items={goalitems}
                        setOpen={setShowFitnessGoalDropdown}
                        setValue={setFitnessGoal}
                        setItems={setGoalItems}
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
            </SafeAreaView>
        </ScrollView>

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
        alignSelf: "center",
    },
    updateButtonText: {
        color: '#212020',
        fontSize: 16,
        fontWeight: 'bold',
    },


});
export default UpdateProfile;