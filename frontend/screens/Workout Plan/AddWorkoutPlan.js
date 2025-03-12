import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from "expo-image-picker";
import HeaderVer2 from '../HeaderVer2';

const AddWorkoutPlan = () => {
    const navigation = useNavigation();

    //Profile icon dropdown button
    const handleGoToProfile = () => navigation.navigate('ProfileDashboard');

    //Notification icon pop up page
    const toggleNotification = () => navigation.navigate('Notification');

    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [planDetails, setPlanDetails] = useState([]);
    const [planType, setPlanType] = useState([]);

    useEffect(() => {
        async function fetchUserId() {
            const token = await getUserId();
            setUserId(token.id);
            setUserName(token.name);
        }
        fetchUserId();
    }, []);

    useEffect(() => {
        fetchWorkoutDetail();
    }, []);

    const fetchWorkoutDetail = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plan/displayWorkoutDetail`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
            }

            const data = await response.json();

            if (data) {
                setPlanDetails(data.results);
                setPlanType(data.type);
            }
        } catch (error) {
            console.error("Error fetching workout detail data:", error);
            Alert.alert("Error", error.message || "Network request failed");
        }
    };

    const [selectedDetails, setSelectedDetails] = useState([]);
    const [pressedItems, setPressedItems] = useState([]);
    const [addData, setAddData] = useState({
        name: "",
        description: "",
        difficulty: "",
        day: "",
        image: "",
    });

    function addItem(details) {
        if (!pressedItems.includes(details.workout_detail_id)) {
            setSelectedDetails((prevDetails) => [...prevDetails, details]);
            setPressedItems((prev) => [...prev, details.workout_detail_id]);
        }
    }

    const [visible, setVisible] = useState(false);
    function onClose() {
        setVisible(false);
    }

    const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
    const difficulty = [
        { label: 'Select level', value: '', disabled: true },
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' },
    ];

    const [showDayDropdown, setShowDayDropdown] = useState(false);
    const day = [
        { label: 'Select level', value: '', disabled: true },
        { label: 'Monday', value: 'Monday' },
        { label: 'Tuesday', value: 'Tuesday' },
        { label: 'Wednesday', value: 'Wednesday' },
        { label: 'Thursday', value: 'Thursday' },
        { label: 'Friday', value: 'Friday' },
        { label: 'Saturday', value: 'Saturday' },
        { label: 'Sunday', value: 'Sunday' },
    ];

    const deleteItem = (itemToDelete) => {
        setSelectedDetails((prevDetails) =>
            prevDetails.filter((item) => item.workout_detail_id !== itemToDelete.workout_detail_id)
        );
        setPressedItems((prevDetails) =>
            prevDetails.filter((id) => id !== itemToDelete.workout_detail_id)
        );
    };

    //Upload image
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
            setAddData((prevData) => ({ ...prevData, image: result.assets[0].uri }))
        }
    };

    const createWorkoutPlan = async (addData, workout_details) => {
        // Ensure addData exists before validating properties
        if (!addData ||
            addData.name.trim() === "" ||
            addData.description.trim() === "" ||
            addData.difficulty.trim() === "" ||
            addData.day.trim() === "" ||
            addData.image.trim() === ""
        ) {
            Alert.alert("Missing Information", "Please fill in all required fields.");
            return;
        }

        // Initialize FormData properly
        const formData = new FormData();

        // Append the image file
        formData.append("image", {
            uri: addData.image,
            type: "image/jpeg",
            name: `${addData.name}.jpg`,
        });

        // Append JSON data as a string
        formData.append("addData", JSON.stringify(addData));
        formData.append("workout_details", JSON.stringify(workout_details));
        formData.append("userId", userId);

        try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plan/createWorkoutPlan`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert("Success", "Workout Plan successfully created.");
                onClose();
                navigation.navigate('MemberWorkoutPlan');
            } else {
                Alert.alert(data.message);
            }
        } catch (error) {
            console.error("Error creating workout plan:", error);
            Alert.alert("Error", error.message || "Network request failed");
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <SafeAreaView style={styles.headertop}>
                <HeaderVer2
                    title="Workout Plans" style={styles.header}
                    onPress={() => navigation.goBack()}
                />
            </SafeAreaView>

            <ScrollView style={styles.containerScroll}>
                <View style={styles.header2}>
                    <Text style={styles.contentTitle}>Let's Create, {userName}</Text>
                    <Text style={styles.contentSubTitle}>Explore Different Workout Styles and Create Your Own
                        Workout Plan</Text>
                </View>

                <View style={styles.header3}>
                    {planType.map((type, index) => (
                        <View key={index} style={{ marginBottom: 20 }}>
                            <Text style={styles.sectionTitle}>{type.exercise_type}</Text>
                            {planDetails
                                .filter((details) => details.exercise_type === type.exercise_type)
                                .map((details) => (
                                    <View key={details.workout_detail_id} style={styles.workoutItem}>
                                        <View style={{ width: "60%" }}>
                                            <Text style={styles.workoutItemText} numberOfLines={1} ellipsizeMode="tail">
                                                {details.exercise_name} {details.reps ? `${details.reps} Reps` : `${details.duration_minutes} Minutes`}
                                            </Text>
                                            <Text style={styles.restTime}><Ionicons name="time" size={13}></Ionicons> {details.rest_time_seconds}s Rest Time</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
                                            <Text style={styles.setCount}>Sets {details.sets}x</Text>
                                            <TouchableOpacity
                                                style={[
                                                    styles.addButton,
                                                    pressedItems.includes(details.workout_detail_id) && styles.disabledButton
                                                ]}
                                                onPress={() => addItem(details)}
                                                disabled={pressedItems.includes(details.workout_detail_id)}
                                            >
                                                <Ionicons name="add" color={"white"} size={30} marginTop={5}></Ionicons>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    ))}
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.planCartButton} onPress={() => setVisible(true)}>
                <Text style={styles.planCartText}>View Your Selected Workout ({selectedDetails.length})</Text>
            </TouchableOpacity>

            <Modal transparent visible={visible} animationType="slide">
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>

                        {/* Title */}
                        <Text style={styles.title}>Custom Workout</Text>
                        <ScrollView style={{ width: "100%" }}>

                            {/* Name & Description Inputs */}
                            <Text style={styles.inputText}>Name <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
                            <TextInput style={styles.input} value={addData.name} placeholder="Name" onChangeText={(text) => setAddData((prevData) => ({ ...prevData, name: text.replace(/[^a-zA-Z0-9_/()[] ]/g, ''), }))} />
                            <Text style={styles.inputText}>Description <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
                            <TextInput style={styles.input} value={addData.description} placeholder="Description" multiline onChangeText={(text) => setAddData((prevData) => ({ ...prevData, description: text.replace(/[^a-zA-Z0-9_/()[] ]/g, ''), }))} />
                            <Text style={styles.inputText}>Difficulty <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
                            <DropDownPicker
                                open={showDifficultyDropdown}
                                value={addData.difficulty}
                                items={difficulty}
                                setOpen={setShowDifficultyDropdown}
                                setValue={(callback) =>
                                    setAddData(prevData => ({
                                        ...prevData,
                                        difficulty: callback(prevData.difficulty)
                                    }))
                                }
                                placeholder="Select level"
                                nestedScrollEnabled={true}
                                listMode="SCROLLVIEW"
                                style={styles.dropdown}
                                textStyle={styles.dropdownText}
                                containerStyle={{ marginBottom: 16, zIndex: 100 }}
                            />
                            <Text style={styles.inputText}>Select day <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
                            <DropDownPicker
                                open={showDayDropdown}
                                value={addData.day}
                                items={day}
                                setOpen={setShowDayDropdown}
                                setValue={(callback) =>
                                    setAddData(prevData => ({
                                        ...prevData,
                                        day: callback(prevData.day)
                                    }))
                                }
                                placeholder="Select level"
                                nestedScrollEnabled={true}
                                listMode="SCROLLVIEW"
                                style={styles.dropdown}
                                textStyle={styles.dropdownText}
                                containerStyle={{ marginBottom: 16, zIndex: 90 }}
                            />
                            <Text style={styles.inputText}>Upload Image <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
                            <TouchableOpacity style={styles.input} onPress={pickImage}><Ionicons name="image" size={20}>  <Text style={{ fontSize: 16 }}>{addData.image ? `Image uploaded` : `Upload Image`}</Text></Ionicons></TouchableOpacity>

                            {/* Selected Workouts Section */}
                            <Text style={styles.section2Title}>Your Selected Workout</Text>

                            {selectedDetails.map((item, index) => (
                                <View key={item.workout_detail_id} style={styles.workoutItem}>
                                    <View style={{ width: "50%" }}>
                                        <Text style={styles.workoutItemText} numberOfLines={2} ellipsizeMode="tail">
                                            {item.exercise_name} {item.reps ? `${item.reps} Reps` : `${item.duration_minutes} Minutes`}
                                        </Text>
                                        <Text style={styles.restTime}>
                                            <Ionicons name="time" size={13} /> {item.rest_time_seconds}s Rest Time
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
                                        <Text style={styles.setCount}>Sets {item.sets}x</Text>
                                        <TouchableOpacity
                                            onPress={() => deleteItem(item)}
                                        >
                                            <Ionicons name="trash-outline" color={"black"} size={30} style={{ marginTop: 5 }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            {/* Create Button */}
                            <TouchableOpacity style={styles.createButton} onPress={() => { console.log("Button pressed"); createWorkoutPlan(addData, pressedItems); }}>
                                <Text style={styles.createButtonText}>Create</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    )
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212020' },
    containerScroll: {
        padding: 20,
    },
    contentTitle: { color: '#E2F163', fontSize: 24, textAlign: 'left', marginBottom: 10, fontWeight: 500 },
    contentSubTitle: { fontSize: 14, color: '#fff', marginBottom: 30, textAlign: 'left' },
    sectionTitle: { color: "#fff", fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
    header3: { flex: 1, paddingBottom: 40 },
    workoutItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: 40,
        marginBottom: 15,
        alignItems: 'center',
        width: "100%",
    },
    workoutItemText: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5
    },
    restTime: {
        color: "#896CFE",
    },
    setCount: {
        color: "#896CFE",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "right",
    },
    addButton: {
        backgroundColor: "#896CFE",
        borderRadius: "50%",
        height: 40,
        width: 40,
        alignItems: "center",
    },
    disabledButton: {
        backgroundColor: "#C0C0C0",
        borderRadius: "50%",
        height: 40,
        width: 40,
        alignItems: "center",
    },
    planCartButton: {
        position: "absolute",
        backgroundColor: "#E2F163",
        bottom: 10,
        alignSelf: "center",
        padding: 20,
        width: "90%",
        borderRadius: 20,
        borderColor: "black",
        borderWidth: 2,
    },
    planCartText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "90%",
        height: "80%",
        backgroundColor: "#E2F163",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    closeButton: {
        position: "absolute",
        top: 15,
        right: 15,
    },
    section2Title: {
        color: "#000", fontSize: 24, marginBottom: 10, textAlign: 'center', fontWeight: 'bold', marginTop: 10
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    inputText: {
        color: "#000",
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 5,
        fontSize: 15,
        marginRight: 'auto'
    },
    dropdown: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
    },
    dropdownText: {
        color: '#000',
        fontSize: 16,
    },
    createButton: {
        backgroundColor: "black",
        padding: 12,
        borderRadius: 10,
        marginTop: 15,
        width: "100%",
        alignItems: "center",
    },
    createButtonText: {
        color: "#E2F163",
        fontSize: 16,
        fontWeight: "bold",
    },
});


export default AddWorkoutPlan;
