import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const EditModal = ({ visible, onCancel, workout }) => {
    const [workoutName, setWorkoutName] = useState(workout?.name || "");
    const [description, setDescription] = useState("");
    const [selectedWorkouts, setSelectedWorkouts] = useState(workout ? [workout] : []);

    const [showAddButton, setShowAddButton] = useState(true);

    const handleToggleButton = () => {
        setShowAddButton(!showAddButton);
    };

    const workouts = [
        { id: 1, name: "Bench Press", reps: "8 Reps", restTime: "01:20 Rest Time", sets: "4x" },
        { id: 2, name: "Dead Lifts", reps: "8 Reps", restTime: "01:50 Rest Time", sets: "4x" },
        { id: 3, name: "Russian Twist", reps: "15 Reps", restTime: "01:30 Rest Time", sets: "4x" },
        { id: 4, name: "Overhead Press", reps: "10 Reps", restTime: "01:00 Rest Time", sets: "4x" },
    ];

    const exerciseData = {
        Strength: [
            { exercise_name: "Squats", sets: 4, reps: 10, time_taken: "1:30 Rest Time" },
            { exercise_name: "Bench Press", sets: 4, reps: 8, time_taken: "2:00 Rest Time" },
            { exercise_name: "Deadlifts", sets: 4, reps: 6, time_taken: "2:30 Rest Time" },
            { exercise_name: "Lunges", sets: 3, reps: 12, time_taken: "1:00 Rest Time" },
            { exercise_name: "Overhead Press", sets: 3, reps: 10, time_taken: "1:30 Rest Time" },
            { exercise_name: "Dumbbell Rows", sets: 3, reps: 10, time_taken: "1:30 Rest Time" },
            { exercise_name: "Kettlebell Swings", sets: 4, reps: 15, time_taken: "1:00 Rest Time" }
        ],
        Cardio: [
            { exercise_name: "Jump Rope", sets: 2, reps: null, time_taken: "0:30 Rest Time" },
            { exercise_name: "Burpees", sets: 3, reps: 12, time_taken: "0:30 Rest Time" },
            { exercise_name: "Cycling", sets: 2, reps: null, time_taken: "0:30 Rest Time" },
            { exercise_name: "Mountain Climbers", sets: 3, reps: 20, time_taken: "0:30 Rest Time" },
            { exercise_name: "Running", sets: 1, reps: null, time_taken: "0:30 Rest Time" }
        ],
        Bodyweight: [
            { exercise_name: "Push-Ups", sets: 3, reps: 15, time_taken: "1:00 Rest Time" },
            { exercise_name: "Pull-Ups", sets: 3, reps: 8, time_taken: "1:30 Rest Time" }
        ],
        Core: [
            { exercise_name: "Plank", sets: 2, reps: null, time_taken: "0:30 Rest Time" },
            { exercise_name: "Russian Twists", sets: 3, reps: 15, time_taken: "0:45 Rest Time" },
            { exercise_name: "Side Plank", sets: 2, reps: null, time_taken: "0:30 Rest Time" }
        ],
        Plyometric: [
            { exercise_name: "Box Jumps", sets: 3, reps: 15, time_taken: "0:45 Rest Time" }
        ]
    };
    
    console.log(exerciseData);

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onCancel}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
                        <Ionicons name="close" size={30} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Edit Workout</Text>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput style={styles.input} value={workoutName} onChangeText={setWorkoutName} />

                        <Text style={styles.label}>Description</Text>
                        <TextInput style={styles.input} value={description} onChangeText={setDescription} />

                        <View style={styles.workoutDetailsContainer}>
                        <Text style={styles.workoutDetailsText}>Workout Details</Text>
                        {workouts.map((workout) => (
                            <View key={workout.id} style={styles.workoutItem}>
                                <View style={styles.nameNtime}>
                                    <Text style={styles.workoutName}>{workout.name} {workout.reps}</Text>
                                    <View style={styles.iconNtime}>
                                        <Ionicons name="time-outline" size={16} color="#B3A0FF" /> 
                                        <Text style={styles.restTime}>{workout.restTime}</Text>
                                    </View>
                                </View>
                                <View style={styles.setNicon}>
                                    <Text style={styles.setsText}>Sets {workout.sets}</Text>

                                    <TouchableOpacity style={styles.iconButton}>
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
                            {Object.keys(exerciseData).map((category) => (
                                <View key={category}>
                                    <Text style={styles.categoryTitle}>{category}</Text>
                                    {exerciseData[category].map((workout, index) => (
                                        <View key={index} style={styles.workoutItem}>
                                            <View style={styles.nameNtime}>
                                                <Text style={styles.workoutName}>{workout.exercise_name} {workout.reps ? `${workout.reps} Reps` : ''}</Text>
                                                <View style={styles.iconNtime}>
                                                    <Ionicons name="time-outline" size={16} color="#B3A0FF" />
                                                    <Text style={styles.restTime}>{workout.time_taken}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.setNicon}>
                                                <Text style={styles.setsText}>Sets {workout.sets}x</Text>
                                                <TouchableOpacity style={styles.iconaddButton}>
                                                    <Ionicons name="add" size={22} color="#000" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </>
                    )}
                    </View>
                    </ScrollView>
                    
                    <TouchableOpacity style={styles.updateButton}>
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
    sectionTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
    workoutText: { fontSize: 14, fontWeight: 'bold' },
    workoutSubText: { fontSize: 12, color: '#B3A0FF' },
    setsText: { fontSize: 14, fontWeight: 'bold', color: '#A586FF' },
    addButton: { backgroundColor: '#A586FF', padding: 10, borderRadius: 50, alignSelf: 'center', marginVertical: 10 },
    updateButton: { backgroundColor: 'black', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 5 },
    updateButtonText: { color: '#E2F163', fontSize: 16, fontWeight: 'bold' },

    workoutDetailsContainer: { padding: 5},
    workoutDetailsText: { alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 5},
    workoutItem: { backgroundColor: 'white', padding: 15, borderRadius: 20, marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    nameNtime: { flex: 1},
    iconNtime: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 3},
    workoutName: { fontSize: 14, fontWeight: 'bold', color: "#000" },
    restTime: { fontSize: 14, color: "#B3A0FF", flex: 1, fontWeight: 'bold' },
    setsText: { fontSize: 16, fontWeight: "bold", color: "#A586FF" },
    setNicon: { gap: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
    addButtonBg: { backgroundColor: 'white', borderRadius: 20, marginVertical: 5, alignItems: 'center' },

    closeaddworkoutButton: { backgroundColor: 'white', padding: 10, borderRadius: 5, marginTop: 10, width: 60},
    closeButtonText: { fontSize: 15, fontWeight: 'bold'},
    categoryTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 2 },
    iconaddButton: { backgroundColor: '#A586FF', borderRadius: 50, padding: 5},
});

export default EditModal;
