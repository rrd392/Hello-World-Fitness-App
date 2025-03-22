import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Alert} from "react-native";
import HeaderVer4 from "../HeaderVer4";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import ViewSelectedWorkoutModal from "./ViewSelectedWorkoutModal";
import API_BASE_URL from "../../env";

const CreateWorkout = () => {

    const [showViewSelectedWorkoutModal, setShowViewSelectedWorkoutModal] = useState(false);
    const route = useRoute();
    const { memberId, member, category } = route.params || {};
    const [fullWorkoutDetails, setFullWorkoutDetails] = useState([]);
    const [exerciseType, setExerciseType] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState([]);

    useEffect(() => {
        fetchWorkoutDetails();
    }, []);

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

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <HeaderVer4
                title="Back" style={styles.headerRow}
                onPress={() => navigation.goBack()}
            />

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 80 }}>
                {/* Loop through each category and then map the exercises */}
                {exerciseType.map((category, index) => (
                    <View key={category.exercise_type}>
                        <Text style={[styles.categoryTitle, index !==0 && {marginTop: 15}]}>{category.exercise_type}</Text>
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
                                    <TouchableOpacity style={selectedExercise.includes(workout.workout_detail_id)? styles.iconButton :styles.iconaddButton} 
                                    onPress={() => setSelectedExercise((prevDetails) => [...prevDetails, workout.workout_detail_id])}
                                    disabled={selectedExercise.includes(workout.workout_detail_id)}>
                                        <Ionicons name="add" size={22} color="#000" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ):null))}
                    </View>
                ))}
                
            </ScrollView>
            <TouchableOpacity style={styles.viewButton} onPress={() => setShowViewSelectedWorkoutModal(true)}>
                <View style={styles.countingColumn}>
                    <Text>{selectedExercise.length}</Text>
                </View>
                <Text style={styles.viewText}>View Your Selected Workout</Text>
            </TouchableOpacity>
            <ViewSelectedWorkoutModal
                visible={showViewSelectedWorkoutModal}
                onCancel={() => setShowViewSelectedWorkoutModal(false)}
                fullWorkoutDetails = {fullWorkoutDetails}
                selectedExercise = {selectedExercise}
                refreshSelectedExercise = {setSelectedExercise}
                memberId = {memberId}
                member = {member}
                category = {category}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { padding: 15, },
    categoryTitle: { fontSize: 25, fontWeight: 'bold', color: 'white', alignSelf: 'center', marginBottom: 5, marginTop: -10 },
    iconaddButton: { backgroundColor: '#A586FF', borderRadius: 50, padding: 5},
    iconButton: { backgroundColor: '#A5A5A5', borderRadius: 50, padding: 5},
    workoutItem: { backgroundColor: 'white', padding: 15, borderRadius: 20, marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    nameNtime: { flex: 1},
    workoutName: { fontSize: 14, fontWeight: 'bold', color: "#000" },
    iconNtime: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 3},
    restTime: { fontSize: 14, color: "#B3A0FF", flex: 1, fontWeight: 'bold' },
    setsText: { fontSize: 14, fontWeight: "bold", color: "#A586FF" },
    setNicon: { gap: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
    viewButton: { flexDirection: 'row', marginTop: 10 ,backgroundColor: '#E2F163', width: "90%", height: 50, borderWidth:1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position:'absolute', bottom:10},
    countingColumn: { borderWidth: 1, width: 25, height: 25, alignItems: 'center', borderRadius: 15, justifyContent: 'center', position: 'absolute', left:17},
    viewText: { fontSize: 18, fontWeight: 'bold'},

});

export default CreateWorkout;