import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from "expo-image-picker";
import { Ionicons, Feather } from "@expo/vector-icons";
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';
import { useNavigation } from "@react-navigation/native";

const ViewSelectedWorkoutModal = ({ visible, onCancel, fullWorkoutDetails, selectedExercise, refreshSelectedExercise, memberId, member, category }) => {

    const navigation = useNavigation();
    
    const [workoutPlan, setWorkoutPlan] = useState({
        plan_name : "",
        description : "",
        difficulty : "",
        workoutImage : "",
    });
    const [workoutDetails, setWorkoutDetails] = useState([]);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        async function fetchUserId() {
            const token = await getUserId();
            setUserId(token.id);
        }
        fetchUserId();
    }, []);

    const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
    const difficulty = [
        { label: 'Select level', value: '', disabled: true },
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Intermediate', value: 'Intermediate' },
        { label: 'Advanced', value: 'Advanced' },
    ];

    useEffect(() => {
        setWorkoutDetails(fullWorkoutDetails.filter((workout) => 
            selectedExercise.some((selected) => workout.workout_detail_id === selected)
        ));
    }, [fullWorkoutDetails, selectedExercise]);    

    const deleteWorkoutDetail = (workout_detail_id) => {
        setWorkoutDetails(prevDetails =>
            prevDetails.filter(workout => workout.workout_detail_id !== workout_detail_id)
        );
        selectedExercise.pop(workout_detail_id);
    }

    const pickImage = async () => {
        // Request media library permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied!", "We need access to your gallery to upload images.");
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
            setWorkoutPlan((prevData) => ({ ...prevData, workoutImage: result.assets[0].uri }))
        }
    };

    const createWorkoutPlan = async () => {
        // Ensure addData exists before validating properties
        if (!workoutPlan ||
            workoutPlan.plan_name.trim() === "" ||
            workoutPlan.description.trim() === "" ||
            workoutPlan.difficulty.trim() === "" ||
            workoutPlan.workoutImage.trim() === ""
        ) {
            Alert.alert("Missing Information", "Please fill in all required fields.");
            return;
        }

        // Initialize FormData properly
        const formData = new FormData();

        // Append the image file
        formData.append("image", {
            uri: workoutPlan.workoutImage,
            type: "image/jpeg",
            name: `${workoutPlan.plan_name}.jpg`,
        });

        // Append JSON data as a string
        formData.append("workoutPlan", JSON.stringify(workoutPlan));
        formData.append("workout_details", JSON.stringify(selectedExercise));
        formData.append("trainerId", userId);
        formData.append("memberId", memberId);
        formData.append("category", category);

        try {
            const response = await fetch(`${API_BASE_URL}/api/trainer-workout/createWorkoutPlan`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert("Success", "Workout Plan successfully created.");
                if(category == "General"){
                    navigation.navigate('Workout');
                }else if (category == "Coach"){
                    navigation.navigate('MemberWorkoutPlan', {member});
                }
                onCancel();
            } else {
                Alert.alert(data.message);
            }
        } catch (error) {
            console.error("Error creating workout plan:", error);
            Alert.alert("Error", error.message || "Network request failed");
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={() => {refreshSelectedExercise(selectedExercise); onCancel();}}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => {refreshSelectedExercise(selectedExercise); onCancel();}}>
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Custom Workout</Text>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.label}>Name <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
                        <TextInput style={styles.input} value={workoutPlan.plan_name} onChangeText={(text) =>setWorkoutPlan((prevData) => ({...prevData,plan_name: text.replace(/[^a-zA-Z0-9_/ '-]/g, ''),}))} />

                        <Text style={styles.label}>Description <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
                        <TextInput style={styles.input} value={workoutPlan.description} onChangeText={(text) =>setWorkoutPlan((prevData) => ({...prevData,description: text.replace(/[^a-zA-Z0-9_/ '-.!?]/g, ''),}))} />
                        
                        <Text style={styles.label}>Difficulty <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
                        <DropDownPicker
                            open={showDifficultyDropdown}
                            value={workoutPlan.difficulty}
                            items={difficulty}
                            setOpen={setShowDifficultyDropdown}
                            setValue={(callback) =>
                                setWorkoutPlan(prevData => ({
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
                        <Text style={styles.label}>Upload Image <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
                        <TouchableOpacity style={styles.input} onPress={pickImage}><Ionicons name="image" size={20}>  <Text style={{ fontSize: 16 }}>{workoutPlan.workoutImage ? `Image uploaded` : `Upload Image`}</Text></Ionicons></TouchableOpacity>

                        <View style={styles.workoutDetailsContainer}>
                        <Text style={styles.workoutDetailsText}>Your Selected Workout</Text>
                        {workoutDetails.map((workout) => (
                            <View key={workout.workout_detail_id} style={styles.workoutItem}>
                                <View style={styles.nameNtime}>
                                    <Text style={styles.workoutName}>{workout.exercise_name} {workout.reps}</Text>
                                    <View style={styles.iconNtime}>
                                        <Ionicons name="time-outline" size={16} color="#B3A0FF" /> 
                                        <Text style={styles.restTime}>{workout.rest_time_seconds}s rest time</Text>
                                    </View>
                                </View>
                                <View style={styles.setNicon}>
                                    <Text style={styles.setsText}>Sets {workout.sets}</Text>

                                    <TouchableOpacity onPress={() => deleteWorkoutDetail(workout.workout_detail_id)}>
                                        <Feather name="trash" size={22} color="#000" />
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                        ))}
                    </View>
                    </ScrollView>
                    
                    <TouchableOpacity style={styles.createButton} onPress={() => createWorkoutPlan()}>
                        <Text style={styles.createButtonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#E2F163', padding: 20, borderRadius: 10, width: '90%', maxHeight: '80%' },
    closeButton: { position: 'absolute', top: 10, right: 10 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 3 },
    label: { fontSize: 16, fontWeight: 'bold', marginTop: 3 },
    input: { backgroundColor: 'white', padding: 10, borderRadius: 5, marginTop: 5, marginBottom:10 },
    createButton: { backgroundColor: 'black', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 5 },
    createButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

    workoutDetailsContainer: { padding: 5},
    workoutDetailsText: { alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 5},
    workoutItem: { backgroundColor: 'white', padding: 15, borderRadius: 20, marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    nameNtime: { flex: 1},
    iconNtime: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 3},
    workoutName: { fontSize: 14, fontWeight: 'bold', color: "#000" },
    restTime: { fontSize: 14, color: "#B3A0FF", flex: 1, fontWeight: 'bold' },
    setsText: { fontSize: 14, fontWeight: "bold", color: "#A586FF" },
    setNicon: { gap: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},

    dropdown: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        marginTop:5
    },
    dropdownText: {
        color: '#000',
        fontSize: 16,
    },
});

export default ViewSelectedWorkoutModal;
