import React, { useState, useEffect,useContext } from 'react';
import { ScrollView,View, Image, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import API_BASE_URL from "../../env";
import * as SecureStore from 'expo-secure-store';
import { getUserId } from '../getUserId';
import { AuthContext } from "../../context/AuthContext";

const DetailWorkoutPlan = ({ route }) => {
    const navigation = useNavigation();
    const { workout_plan } = route.params;

    //Profile icon dropdown button
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

    const handleGoToProfile = () =>navigation.navigate('ProfileDashboard');

    //Notification icon pop up page
    const toggleNotification = () => navigation.navigate('Notification');

    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [planDetails, setPlanDetails] = useState([]);

    useEffect(() => {
        async function fetchUserId() {
            const token = await getUserId();
            setUserId(token.id);
            setUserName(token.name);
        }
        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchPlanDetail = async () => {
            try {
            const response = await fetch(`${API_BASE_URL}/api/workout-plan/displayDetailPlan/${workout_plan.workout_plan_id}`, {
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
            }
            } catch (error) {
            console.error("Error fetching workout plan data:", error);
            Alert.alert("Error", error.message || "Network request failed");
            }
        };
        
        fetchPlanDetail();
    }, [workout_plan.workout_plan_id]); 

    function toggleRunWorkout(workout_plan, planDetails){
        navigation.navigate('RunWorkoutPlan', { workout_plan, planDetails})
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState("Monday");

    const handleConfirm = () => {
        setModalVisible(false);
        onAddWorkout(userId, workout_plan.workout_plan_id, selectedDay); 
    };

    const onAddWorkout = async (user_id, workout_plan_id, selectedDay) => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/workout-plan/addUserWorkoutPlan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({user_id, workout_plan_id, selectedDay})
        });
    
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
        }
    
        const data = await response.json();
    
        if (data.success) {
            alert("Workout Plan successfully added.");
        }
        } catch (error) {
        console.error("Error adding workout plan:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    };

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
                    <Text style={styles.sectionTitle}>Workout Details</Text>

                    {/* Workout List */}
                    {planDetails.map((workout) => (
                        <View key={workout.workout_detail_id} style={styles.workoutItem}>
                            <View>
                                <Text style={styles.workoutItemText}>
                                {workout.exercise_name} {workout.reps ? `${workout.reps} Reps` : `${workout.duration_minutes} Minutes`}
                                </Text>
                                <Text style={styles.restTime}><Ionicons name="time" size={13}></Ionicons> {workout.rest_time_seconds}s Rest Time</Text>
                            </View>
                            <Text style={styles.setCount}>Sets {workout.sets}x</Text>
                        </View>
                    ))}

                    {/* Start Button */}
                    <TouchableOpacity style={styles.startButton} onPress={() => toggleRunWorkout(workout_plan, planDetails)}>
                        <Text style={styles.startButtonText}>Let's Start</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                        <Text style={styles.startButtonText}>Add Workout Plan</Text>
                    </TouchableOpacity> 
                    {/* Modal */}
                    <Modal 
                        animationType="slide" 
                        transparent={true} 
                        visible={modalVisible} 
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select a Day</Text>

                                {/* Picker Dropdown */}
                                <Picker
                                    selectedValue={selectedDay}
                                    onValueChange={(itemValue) => setSelectedDay(itemValue)}
                                    style={styles.picker}
                                    itemStyle={{ color: "black" }} 
                                >
                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                        <Picker.Item key={day} label={day} value={day} />
                                    ))}
                                </Picker>

                                {/* Buttons */}
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                                        <Text style={styles.buttonText}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000'},
    header: { padding: 20, marginBottom:-30 },
    header3:{padding:20},
    greeting: { fontSize: 24, color: '#896CFE', fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#fff', marginBottom: 10 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
    iconRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 20 },
    header2:{padding:20, backgroundColor:'#B3A0FF'},
    workoutCard: {
        backgroundColor: "#8D5CF6",
        borderRadius: 15,
        overflow:'hidden',
        height:230
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
    levelText:{
        fontSize:16,
        fontWeight:500
    },
    planTag:{
        padding:15,
        position:'absolute',
        bottom:0,
        backgroundColor:'rgba(33, 32, 32, 0.9)',
        width:'100%',
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
        textAlign:'center'
    },
    workoutItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 15,
        paddingHorizontal:30,
        borderRadius: 40,
        marginTop: 20,
        alignItems:'center'
    },
    workoutItemText: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom:5
    },
    restTime: {
        color: "#896CFE",
    },
    setCount: {
        color: "#896CFE",
        fontWeight: "bold",
        fontSize: 16,
    },
    startButton: {
        backgroundColor: "#E2F163",
        padding: 15,
        borderRadius: 20,
        marginTop: 20,
        alignItems: "center",
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    addButton: {
        backgroundColor: "#E2F163",
        padding: 15,
        borderRadius: 20,
        marginTop: 20,
        marginBottom:30,
        alignItems: "center",
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 350,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    picker: {
        width: "100%",
        height: 150,
        color:'black'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 100,
    },
    cancelButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    confirmButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});


export default DetailWorkoutPlan;
