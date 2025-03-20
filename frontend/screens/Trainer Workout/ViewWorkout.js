import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import HeaderVer4 from "../HeaderVer4";
import { Ionicons, Feather } from '@expo/vector-icons';
import React, { useRef, useState, useEffect } from "react";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import API_BASE_URL from "../../env";

const ViewWorkout = () => {

    const navigation=useNavigation();
    const route = useRoute();
    const { workoutId, memberName, refreshPage, member } = route.params || {};
    const [workoutDetails, setWorkoutDetails] = useState([]);
    const [workoutName, setWorkoutName] = useState("");

    useEffect(() => {
        fetchWorkoutName();
        fetchWorkoutDetails();
    }, []);

    const fetchWorkoutName = async () => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/trainer-workout/displayWorkoutPlan/${workoutId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    
        const data = await response.json();
    
        if (data.success) {
            setWorkoutName(data.progress.plan_name);
        }
        } catch (error) {
        console.error("Error fetching workout name:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    };

    const fetchWorkoutDetails = async () => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/trainer-workout/displayWorkoutDetails/${workoutId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    
        const data = await response.json();
    
        if (data.success) {
            setWorkoutDetails(data.progress);
        }
        } catch (error) {
        console.error("Error fetching workout detail:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    };

    const [showDeleteModel, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const slideAnim = useRef(new Animated.Value(30)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current; 
    const [isVisible, setIsVisible] = useState(false);

    const toggleIcons = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: isVisible ? 30 : 0, 
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: isVisible ? 0 : 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();

        setIsVisible(!isVisible);
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderVer4
                title="Back" style={styles.headerRow}
                onPress={() => {refreshPage(); navigation.goBack()}}
            />

            <ScrollView style={styles.content}>
                <Text style={styles.titleText}>{memberName}'s Workout</Text>
                <View style={styles.bgStyle}>
                    <View style={styles.iconNtitle}>
                        <View style={styles.leftContent}>
                            <Ionicons name="play" style={styles.playIcon} size={24}/>
                            <Text style={styles.titleName}>{workoutName}</Text>
                        </View>
                        
                        {/* Ellipsis Button to Trigger Animation */}
                        <TouchableOpacity onPress={toggleIcons} style={styles.ellipsisButton}>
                            <Ionicons name="ellipsis-vertical-outline" size={24} color="#B3A0FF" />
                        </TouchableOpacity>

                        {/* Animated Edit & Trash Icons */}
                        <Animated.View style={[
                            styles.animatedIcons, 
                            { transform: [{ translateX: slideAnim }], opacity: opacityAnim },
                            { pointerEvents: isVisible ? "auto" : "none" }
                        ]}>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setShowEditModal(true)}>
                                <Feather name="edit" size={22} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setShowDeleteModal(true)}>
                                <Feather name="trash" size={22} color="#fff" />
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    <View style={styles.divider} />

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
                            <Text style={styles.setsText}>Sets {workout.sets}</Text>
                        </View>
                    ))}
                    </View>
                </View>
            </ScrollView>
            <DeleteModal
                visible={showDeleteModel}
                onCancel={() => setShowDeleteModal(false)}
                workoutId = {workoutId}
                member = {member}
                category = {"Coach"}
                refreshPage={""}
            />
            <EditModal
                visible={showEditModal}
                onCancel={() => setShowEditModal(false)}
                workout={workoutDetails}
                workoutId = {workoutId}
                refreshWorkoutDetails = {() => fetchWorkoutDetails()}
                refreshWorkoutName = {() => fetchWorkoutName()}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212020' },
    content: { padding: 20},
    bgStyle: { padding: 10, backgroundColor: 'white', marginTop: 10, borderRadius: 10},
    titleText: { color: '#E2F163', fontSize: 24, fontWeight: 'bold', alignSelf: 'center', marginBottom:10},
    iconNtitle: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 5, padding: 10},
    leftContent: { flexDirection: 'row', alignItems: 'center', gap: 5},
    playIcon: { color: '#B3A0FF' },
    titleName: { color: '#B3A0FF', fontSize: 20, fontWeight: 'bold', width:"85%"},
    actionsIcon: { alignItems: 'flex-end'},
    divider: { height: 3, backgroundColor: "#E2F163", marginBottom: 10, marginTop: 5},

    workoutDetailsContainer: { padding: 5},
    workoutDetailsText: { alignSelf: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10},
    workoutItem: { backgroundColor: '#E4E4E4', padding: 15, borderRadius: 20, marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    nameNtime: { flex: 1},
    iconNtime: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 3},
    workoutName: { fontSize: 14, fontWeight: 'bold', color: "#000" },
    restTime: { fontSize: 14, color: "#B3A0FF", flex: 1, fontWeight: 'bold' },
    setsText: { fontSize: 16, fontWeight: "bold", color: "#A586FF" },

    animatedIcons: { flexDirection: 'row', position: 'absolute', right: 40, top: 0, backgroundColor: "#B3A0FF", paddingHorizontal: 5, paddingVertical: 5, borderRadius: 10, zIndex: 10 },
    iconButton: { padding: 8, borderRadius: 5, marginHorizontal: 3},
});

export default ViewWorkout;