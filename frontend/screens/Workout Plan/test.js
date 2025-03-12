import React, { useState, useEffect, useContext, useRef } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import API_BASE_URL from "../../env";
import * as SecureStore from 'expo-secure-store';
import { getUserId } from '../getUserId';
import { AuthContext } from "../../context/AuthContext";

const RunWorkoutPlan = ({ route }) => {
    const navigation = useNavigation();
    const { workout_plan, planDetails } = route.params;

    //Profile icon dropdown button
    const handleGoToProfile = () => navigation.navigate('ProfileDashboard');

    //Notification icon pop up page
    const toggleNotification = () => navigation.navigate('Notification');

    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        async function fetchUserId() {
            const token = await getUserId();
            setUserId(token.id)
            setUserName(token.name);
        }
        fetchUserId();
    }, []);

    const [clickCounts, setClickCounts] = useState({});
    const [isResting, setIsResting] = useState({});
    const [isAnyResting, setIsAnyResting] = useState(false);
    const rotateValues = useRef({});

    useEffect(() => {
        // Ensure each workout has an animated value
        planDetails.forEach(workout => {
            if (!rotateValues.current[workout.workout_detail_id]) {
                rotateValues.current[workout.workout_detail_id] = new Animated.Value(0);
            }
        });
    }, [planDetails]);

    const startRestTimer = (workoutId, restTime, totalSets) => {
        if (clickCounts[workoutId] >= totalSets || isAnyResting) return;
        // Start rotation animation
        setIsAnyResting(true);
        setIsResting(prev => ({ ...prev, [workoutId]: true }));

        if (rotateValues.current[workoutId]) {
            rotateValues.current[workoutId].setValue(0);
            Animated.timing(rotateValues.current[workoutId], {
                toValue: 1,
                duration: restTime * 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                // Increase the click count
                setClickCounts(prev => ({
                    ...prev,
                    [workoutId]: (prev[workoutId] || 0) + 1,
                }));
                setIsResting(prev => ({ ...prev, [workoutId]: false }));
                setIsAnyResting(false);
            });
        }
    };
    
    const [completedExercise, setCompleteExercise] = useState([]);

    const addPoints = async (user_id, difficulty, completedExercise, planDetails) => {
        let workout_plan_id = workout_plan.workout_plan_id;
        try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plan/addPoints`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, difficulty, completedExercise, planDetails, workout_plan_id })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
            }

            const data = await response.json();

            if (data.success) {
                alert(`You just earned ${data.points} points!`);
                navigation.navigate('MemberWorkoutPlan');
            }
        } catch (error) {
            console.error("Error adding points:", error);
            Alert.alert("Error", error.message || "Network request failed");
        }
    }

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <SafeAreaView style={styles.header}>
                <View style={styles.headerRow}>
                    <Text style={styles.greeting}>Hi, {userName}</Text>
                    <View style={styles.iconRow}>
                        <TouchableOpacity onPress={toggleNotification}><Ionicons name="notifications" size={24} color="#896CFE" /></TouchableOpacity>
                        <TouchableOpacity onPress={handleGoToProfile}><Ionicons name="person" size={24} color="#896CFE" /></TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.subtitle}>It’s time to challenge your limits.</Text>
            </SafeAreaView>

            <ScrollView>
                <View style={styles.header2}>
                    {/* Workout Card */}
                    <View style={styles.workoutCard}>
                        <Image source={{ uri: `${API_BASE_URL}/uploads/${workout_plan.workout_image}` }} style={styles.workoutImage} />
                        <View style={styles.levelTag}>
                            <Text style={styles.levelText}>{workout_plan.difficulty}</Text>
                        </View>
                        <View style={styles.planTag}>
                            <Text style={styles.workoutTitle}>{workout_plan.plan_name}</Text>
                            <Text style={styles.workoutDetails}><Ionicons name="accessibility"></Ionicons> {workout_plan.count} Exercises</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.header3}>
                    {/* Workout Details Section */}
                    <Text style={styles.sectionTitle}>Workout Progress</Text>

                    {planDetails.map(workout => {
                        const workoutId = workout.workout_detail_id;

                        const isCompleted = clickCounts[workoutId] >= workout.sets;

                        // Create an animated value for the progress bar
                        const progressRatio = (clickCounts[workoutId] || 0) / workout.sets;
                        const animatedProgress = useRef(new Animated.Value(0)).current;

                        const restProgress = useRef(new Animated.Value(0)).current;
                        useEffect(() => {
                            if (isResting[workoutId]) {
                                // Reset the progress value
                                restProgress.setValue(0);
                                Animated.timing(restProgress, {
                                    toValue: 1,
                                    duration: workout.rest_time_seconds * 1000, // convert seconds to milliseconds
                                    useNativeDriver: false, // width animation requires useNativeDriver false
                                }).start();
                            } else {
                                // Optionally, reset progress when not resting.
                                restProgress.setValue(0);
                            }
                        }, [isResting[workoutId]]);


                        useEffect(() => {
                            Animated.timing(animatedProgress, {
                                toValue: progressRatio,
                                duration: 300,
                                useNativeDriver: false, // width animation requires useNativeDriver false
                            }).start();
                        }, [progressRatio]);

                        const progressBarWidth = restProgress.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        });

                        const rotateInterpolate = rotateValues.current[workoutId]?.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0deg", "360deg"],
                        }) || "0deg";

                        useEffect(() => {
                            if (isCompleted) {
                                setCompleteExercise(prev => [...prev, workoutId]);
                            }
                        }, [isCompleted, workoutId]);

                        return (
                            <View key={workoutId} style={styles.workoutItem}>

                                {/* Animated overlay that fills the background */}
                                <Animated.View style={[styles.progressOverlay, { width: progressBarWidth }]} />

                                <View style={styles.contentContainer}>
                                    <TouchableOpacity
                                        onPress={() => startRestTimer(workoutId, workout.rest_time_seconds, workout.sets)}
                                        disabled={isAnyResting || isResting[workoutId]}
                                        style={styles.playButton}
                                    >
                                        {isCompleted ? (
                                            <Ionicons name="checkmark-circle" size={50} color="#E2F163" />
                                        ) : (
                                            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                                                <Ionicons name="caret-forward-circle" size={50} color={isAnyResting ? "gray" : "#000"} />
                                            </Animated.View>
                                        )}
                                    </TouchableOpacity>

                                    <View style={styles.textContainer}>
                                        <Text style={styles.workoutItemText}>
                                            {workout.exercise_name} {workout.reps ? `${workout.reps} Reps` : `${workout.duration_minutes} Minutes`}
                                        </Text>
                                        <Text style={styles.restTime}>
                                            <Ionicons name="time" size={13} /> {workout.rest_time_seconds}s Rest Time
                                        </Text>
                                    </View>
                                    <Text style={styles.setCount}>Sets {clickCounts[workoutId] || 0}/{workout.sets}</Text>
                                </View>
                            </View>
                        );
                    })}

                    {/* Complete Button */}
                    <TouchableOpacity
                        onPress={() => addPoints(userId, workout_plan.difficulty, completedExercise, planDetails)}
                        disabled={completedExercise.length == 0}
                        style={[styles.startButton, { backgroundColor: completedExercise.length > 0 ? "rgba(226, 241, 99, 1)" : "rgba(226, 241, 99, 0.5)" }]}
                    >
                        <Text style={styles.startButtonText}>Complete</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { padding: 20, marginBottom: -30 },
    header3: { padding: 20 },
    greeting: { fontSize: 24, color: '#896CFE', fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#fff', marginBottom: 10 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
    iconRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 20 },
    header2: { padding: 20, backgroundColor: '#B3A0FF' },
    workoutCard: {
        backgroundColor: "#8D5CF6",
        borderRadius: 15,
        overflow: 'hidden',
        height: 230
    },
    workoutImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    levelTag: {
        position: "absolute",
        top: 0,
        right: -10,
        backgroundColor: "#E2F163",
        borderRadius: 15,
        paddingHorizontal: 30,
        paddingVertical: 4,
    },
    levelText: {
        fontSize: 16,
        fontWeight: 500
    },
    planTag: {
        padding: 15,
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(33, 32, 32, 0.9)',
        width: '100%',
    },
    workoutTitle: {
        color: "#E2F163",
        fontWeight: 500,
        fontSize: 20,
        marginBottom: 5,
    },
    workoutDetails: {
        color: "#fff",
    },
    sectionTitle: {
        color: "#E2F163",
        fontSize: 24,
        marginTop: 10,
        textAlign: 'center'
    },
    workoutItem: {
        flexDirection: "row",
        backgroundColor: "white",
        padding: 15,
        // paddingRight: 30,
        borderRadius: 40,
        marginTop: 20,
        alignItems: 'center',
        position: 'relative',  // Required for absolute positioning of the overlay
        overflow: 'hidden'
    },

    progressOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        // This background color can be adjusted to your desired progress fill color and opacity.
        backgroundColor: '#E2F163',
        zIndex: 0,
        borderWidth:1,
        borderColor:"red",
    },
    contentContainer: {
        zIndex: 1,
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
    },

    playButton: {
        marginLeft: 0,
        marginRight: 15
    },
    textContainer: { flex: 1 },
    workoutItemText: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    restTime: {
        color: "#896CFE",
    },
    setCount: {
        color: "#896CFE",
        fontWeight: "bold",
        fontSize: 16,
        // right: 0,
        marginRight:20,
    },

    startButton: {
        padding: 15,
        borderRadius: 20,
        marginTop: 20,
        alignItems: "center",
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    restButtonDisabled: { backgroundColor: "#ccc" },
    disabledButton: { backgroundColor: "#ccc", }
});


export default RunWorkoutPlan;
