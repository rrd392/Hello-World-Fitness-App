import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import API_BASE_URL from "../../env";

const EditModal = ({ visible, onCancel, workout, workoutId, refreshWorkoutDetails, refreshWorkoutName}) => {
   
    const [showAddButton, setShowAddButton] = useState(true);
    const [workoutPlan, setWorkoutPlan] = useState([]);
    const [fullWorkoutDetails, setFullWorkoutDetails] = useState([]);
    const [exerciseType, setExerciseType] = useState([]);
    const [workoutDetails, setWorkoutDetails] = useState([]);

    useEffect(() => {
        if (workout) {
            setWorkoutDetails(workout);
        }
    }, [workout]);

    useEffect(() => {
        fetchWorkoutPlan();
        fetchWorkoutDetails();
    }, []);

    const fetchWorkoutPlan = async () => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/trainer-workout/displayWorkoutPlan/${workoutId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    
        const data = await response.json();
    
        if (data.success) {
            setWorkoutPlan(data.progress);
        }
        } catch (error) {
        console.error("Error fetching workout plan:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    };

    const fetchWorkoutDetails = async () => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/workout-plan/displayWorkoutDetail`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    
        const data = await response.json();
    
        if (data) {
            setFullWorkoutDetails(data.results);
            setExerciseType(data.type);
        }
        } catch (error) {
        console.error("Error fetching workout details:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    };

    const handleToggleButton = () => {
        setShowAddButton(!showAddButton);
    };

    const deleteWorkoutDetail = async(workout_detail_id) => {
        const workout_plan_id = workoutId;
        try {
        const response = await fetch(`${API_BASE_URL}/api/trainer-workout/deleteWorkoutDetail`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workout_detail_id, workout_plan_id }),
        });
    
        const data = await response.json();
    
        if (data.success) {
            Alert.alert('Exercise deleted successfully!');
            setWorkoutDetails(prevDetails =>
                prevDetails.filter(workout => workout.workout_detail_id !== workout_detail_id)
            );
        }
        } catch (error) {
        console.error("Error fetching workout details:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    }

    const addWorkoutDetail = async(workout_detail_id) => {
        const workout_plan_id = workoutId;
        try {
        const response = await fetch(`${API_BASE_URL}/api/trainer-workout/addWorkoutDetail`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workout_detail_id, workout_plan_id }),
        });
    
        const data = await response.json();
    
        if (data.success) {
            Alert.alert('Exercise added successfully!');
            setWorkoutDetails(prevDetails => [
                ...prevDetails,  
                data.result      
            ]);
        }else{
            Alert.alert(data.message);
        }
        } catch (error) {
        console.error("Error fetching workout details:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    }

    const updateWorkoutPlan = async(workout_plan_id) => {
        if(!workoutPlan.plan_name || !workoutPlan.description){
            Alert.alert("Please fill in all the fields.");
            return
        }
        try {
        const response = await fetch(`${API_BASE_URL}/api/trainer-workout/updateWorkoutPlan`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({planName: workoutPlan.plan_name, description: workoutPlan.description, workout_plan_id}),
        });
    
        const data = await response.json();
    
        if (data.success) {
            Alert.alert('Workout plan updated successfully!');
            refreshWorkoutDetails();
            refreshWorkoutName();
            onCancel();
        }else{
            Alert.alert(data.message);
        }
        } catch (error) {
        console.error("Error updating workout plan:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    }

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={() => {refreshWorkoutDetails(); onCancel();}}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => {refreshWorkoutDetails(); onCancel();}}>
                        <Ionicons name="close" size={30} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit Workout</Text>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.label}>Name <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
                        <TextInput style={styles.input} value={workoutPlan.plan_name} onChangeText={(text) =>setWorkoutPlan((prevData) => ({...prevData,plan_name: text.replace(/[^a-zA-Z0-9_/ '-]/g, ''),}))} />

                        <Text style={styles.label}>Description <Text style={{ color: "rgb(255, 0, 0)" }}>*</Text></Text>
                        <TextInput style={styles.input} value={workoutPlan.description} onChangeText={(text) =>setWorkoutPlan((prevData) => ({...prevData,description: text.replace(/[^a-zA-Z0-9_/ '-.!?:]/g, ''),}))} />

                        <View style={styles.workoutDetailsContainer}>
                        <Text style={styles.workoutDetailsText}>Workout Details</Text>
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

                                    <TouchableOpacity style={styles.iconButton} onPress={() => deleteWorkoutDetail(workout.workout_detail_id)}>
                                        <Feather name="trash" size={22} color="#000" />
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                        ))}
                        {showAddButton ? (
                            <TouchableOpacity style={styles.addButton} onPress={handleToggleButton}>
                                <Ionicons name="add" size={30} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <>
                            <TouchableOpacity style={styles.addButton} onPress={handleToggleButton}>
                                <Ionicons name="arrow-up" size={30} color="white" />
                            </TouchableOpacity>

                            {/* Loop through each category and then map the exercises */}
                            {exerciseType.map((category) => (
                                <View key={category.exercise_type}>
                                    <Text style={styles.categoryTitle}>{category.exercise_type}</Text>
                                    {fullWorkoutDetails.map((workout) => (
                                        workout.exercise_type == category.exercise_type? (
                                        <View key={workout.workout_detail_id} style={styles.workoutItem}>
                                            <View style={styles.nameNtime}>
                                                <Text style={styles.workoutName}>{workout.exercise_name} {workout.reps ? `${workout.reps} Reps` : ''}</Text>
                                                <View style={styles.iconNtime}>
                                                    <Ionicons name="time-outline" size={16} color="#B3A0FF" />
                                                    <Text style={styles.restTime}>{workout.rest_time_seconds}s rest time</Text>
                                                </View>
                                            </View>
                                            <View style={styles.setNicon}>
                                                <Text style={styles.setsText}>Sets {workout.sets}x</Text>
                                                <TouchableOpacity style={styles.iconaddButton} onPress={() => addWorkoutDetail(workout.workout_detail_id)}>
                                                    <Ionicons name="add" size={22} color="#000" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ):null))}
                                </View>
                            ))}
                        </>
                    )}
                    </View>
                    </ScrollView>
                    
                    <TouchableOpacity style={styles.updateButton} onPress={() => updateWorkoutPlan(workoutId)}>
                        <Text style={styles.updateButtonText}>Update</Text>
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
    input: { backgroundColor: 'white', padding: 10, borderRadius: 5, marginTop: 5 },
    addButton: { backgroundColor: '#A586FF', padding: 10, borderRadius: 50, alignSelf: 'center', marginVertical: 10 },
    updateButton: { backgroundColor: 'black', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 5 },
    updateButtonText: { color: '#E2F163', fontSize: 16, fontWeight: 'bold' },

    workoutDetailsContainer: { padding: 5},
    workoutDetailsText: { alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 20},
    workoutItem: { backgroundColor: 'white', padding: 15, borderRadius: 20, marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    nameNtime: { flex: 1},
    iconNtime: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 3},
    workoutName: { fontSize: 14, fontWeight: 'bold', color: "#000" },
    restTime: { fontSize: 14, color: "#B3A0FF", flex: 1, fontWeight: 'bold' },
    setsText: { fontSize: 14, fontWeight: "bold", color: "#A586FF" },
    setNicon: { gap: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},

    categoryTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom:5 },
    iconaddButton: { backgroundColor: '#A586FF', borderRadius: 50, padding: 5},
});

export default EditModal;
