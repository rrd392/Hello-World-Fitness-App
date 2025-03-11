// WorkoutItem.js
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WorkoutItem = ({
    workout,
    clickCount,
    totalSets,
    restTimeSeconds,
    isResting,
    isAnyResting,
    rotateValue,
    startRestTimer,
    setCompleteExercise,
}) => {
    const workoutId = workout.workout_detail_id;
    const isCompleted = (clickCount || 0) >= totalSets;

    // Animated values for rest progress and rotation
    const restProgress = useRef(new Animated.Value(0)).current;
    const animatedProgress = useRef(new Animated.Value(0)).current;

    const progressRatio = (clickCount || 0) / totalSets;

    useEffect(() => {
        if (isResting) {
            restProgress.setValue(0);
            Animated.timing(restProgress, {
                toValue: 1,
                duration: restTimeSeconds * 1000,
                useNativeDriver: false,
            }).start();
        } else {
            restProgress.setValue(0);
        }
    }, [isResting, restTimeSeconds, restProgress]);

    useEffect(() => {
        Animated.timing(animatedProgress, {
            toValue: progressRatio,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [progressRatio, animatedProgress]);

    const progressBarWidth = restProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const rotateInterpolate = rotateValue
        ? rotateValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        })
        : '0deg';

    useEffect(() => {
        if (isCompleted) {
            setCompleteExercise(prev => [...prev, workoutId]);
        }
    }, [isCompleted, workoutId, setCompleteExercise]);

    return (
        <View style={styles.workoutItem}>
            {/* Progress overlay filling the background */}
            <Animated.View style={[styles.progressOverlay, { width: progressBarWidth }]} />

            <View style={styles.contentContainer}>
                <TouchableOpacity
                    onPress={() => startRestTimer(workoutId, restTimeSeconds, totalSets)}
                    disabled={isAnyResting || isResting}
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
                        <Ionicons name="time" size={13} /> {restTimeSeconds}s Rest Time
                    </Text>
                </View>
                <Text style={styles.setCount}>Sets {clickCount || 0}/{totalSets}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    workoutItem: {
        flexDirection: "row",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 40,
        marginTop: 20,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    progressOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        backgroundColor: '#E2F163',
        zIndex: 0,
    },
    contentContainer: {
        zIndex: 1,
        flex: 1,
        flexDirection: "row",
        alignItems: 'center',
    },
    playButton: {
        marginLeft: 0,
        marginRight: 15,
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
        marginRight: 20,
    },
});

export default WorkoutItem;
