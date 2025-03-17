import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, ScrollViewComponent} from "react-native";
import HeaderVer2 from "../HeaderVer2";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import ViewSelectedWorkoutModal from "./ViewSelectedWorkoutModal";

const CreateWorkout = () => {

    const [showViewSelectedWorkoutModal, setShowViewSelectedWorkoutModal] = useState(false);

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

    const navigation=useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <HeaderVer2
                title="Back" style={styles.headerRow}
                onPress={() => navigation.navigate("MemberWorkoutPlan")}
            />

            <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 80 }}>
                {/* Loop through each category and then map the exercises */}
                {Object.keys(exerciseData).map((category, index) => (
                    <View key={category}>
                        <Text style={[styles.categoryTitle, index !==0 && {marginTop: 15}]}>{category}</Text>
                        {exerciseData[category].map((workout, i) => (
                            <View key={i} style={styles.workoutItem}>
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
                
            </ScrollView>
            <TouchableOpacity style={styles.viewButton} onPress={() => setShowViewSelectedWorkoutModal(true)}>
                <View style={styles.countingColumn}>
                    <Text>0</Text>
                </View>
                <Text style={styles.viewText}>View Your Selected Workout</Text>
            </TouchableOpacity>
            <ViewSelectedWorkoutModal
                visible={showViewSelectedWorkoutModal}
                onCancel={() => setShowViewSelectedWorkoutModal(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212020' },
    content: { padding: 15, },
    scrollViewContent: { paddingBottom: 30},
    categoryTitle: { fontSize: 25, fontWeight: 'bold', color: 'white', alignSelf: 'center', marginBottom: 5, marginTop: -10 },
    iconaddButton: { backgroundColor: '#A586FF', borderRadius: 50, padding: 5},
    workoutItem: { backgroundColor: 'white', padding: 15, borderRadius: 20, marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    nameNtime: { flex: 1},
    workoutName: { fontSize: 14, fontWeight: 'bold', color: "#000" },
    iconNtime: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 3},
    restTime: { fontSize: 14, color: "#B3A0FF", flex: 1, fontWeight: 'bold' },
    setsText: { fontSize: 16, fontWeight: "bold", color: "#A586FF" },
    setNicon: { gap: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
    viewButton: { flexDirection: 'row', marginTop: 10 ,backgroundColor: '#E2F163', width: "90%", height: 50, borderWidth:1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position:'absolute', bottom:10},
    countingColumn: { borderWidth: 1, width: 25, height: 25, alignItems: 'center', borderRadius: 15, justifyContent: 'center', position: 'absolute', left:17},
    viewText: { fontSize: 18, fontWeight: 'bold'},

});

export default CreateWorkout;