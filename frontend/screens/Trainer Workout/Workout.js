import { View, SafeAreaView, Text, TouchableOpacity, FlatList, Image, Animated } from "react-native";
import { StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import DeleteModal from "../Trainer Members/DeleteModal";
import EditExistingWorkoutModal from "./EditExistingWorkoutModal";

const existingPlans = [
    {
        workout_plan_id: 1,
        plan_name: "Full Body Blast",
        description: "A high-intensity workout focusing on all muscle groups.",
        count: 10,
        difficulty: "Intermediate",
        workout_image: require("../../assets/bck1.png"),
    },
    {
        workout_plan_id: 2,
        plan_name: "Cardio Burn",
        description: "A cardio-focused workout to get your heart pumping.",
        count: 8,
        difficulty: "Beginner",
        workout_image: require("../../assets/bck1.png"),
    },
];

// Created Workout Plans
const createdPlans = [
    ...existingPlans,
    {
        workout_plan_id: 3,
        plan_name: "Full Body Blast",
        description: "A high-intensity workout focusing on all muscle groups.",
        count: 10,
        difficulty: "Intermediate",
        workout_image: require("../../assets/bck1.png"),
    },
    {
        workout_plan_id: 4,
        plan_name: "Cardio Burn",
        description: "A cardio-focused workout to get your heart pumping.",
        count: 8,
        difficulty: "Beginner",
        workout_image: require("../../assets/bck1.png"),
    },
    {
        workout_plan_id: 5,
        plan_name: "Full Body Blast",
        description: "A high-intensity workout focusing on all muscle groups.",
        count: 10,
        difficulty: "Intermediate",
        workout_image: require("../../assets/bck1.png"),
    },
    {
        workout_plan_id: 6,
        plan_name: "Cardio Burn",
        description: "A cardio-focused workout to get your heart pumping.",
        count: 8,
        difficulty: "Beginner",
        workout_image: require("../../assets/bck1.png"),
    },
];
    
    const Workout = () => {

        const [showDeleteModel, setShowDeleteModal] = useState(false);
        const [showEditExistingWorkoutModal, setShowEditExistingWorkoutModal] = useState(false);
        
        const slideAnim = useRef(new Animated.Value(30)).current;
        const opacityAnim = useRef(new Animated.Value(0)).current; 
        const [isVisible, setIsVisible] = useState(false);

        const navigation = useNavigation();

        const [selectedTab, setSelectedTab] = useState("existing");
        const [selectedWorkout, setSelectedWorkout] = useState(null);

        const workoutPlans = selectedTab === "existing" ? existingPlans : createdPlans;
    
        const toggleWorkOutDetails = (item) => {
            setSelectedWorkout(selectedWorkout === item.workout_plan_id ? null : item.workout_plan_id);
        };

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <Text style={styles.titleStyle}>Existing Workout Plan</Text>
                <View style={styles.workoutplanSelection}>
                    <TouchableOpacity
                        style={[
                            styles.selectionBg,
                            selectedTab === "existing" ? styles.selectedBg : styles.defaultBg
                        ]}
                        onPress={() => setSelectedTab("existing")}
                    >
                        <Text
                            style={[
                                styles.text,
                                selectedTab === "existing" ? styles.selectedText : styles.defaultText
                            ]}
                        >
                            Existing
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.selectionBg,
                            selectedTab === "created" ? styles.selectedBg : styles.defaultBg
                        ]}
                        onPress={() => setSelectedTab("created")}
                    >
                        <Text
                            style={[
                                styles.text,
                                selectedTab === "created" ? styles.selectedText : styles.defaultText
                            ]}
                        >
                            Created
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatList style={styles.addPadding}
                    data={workoutPlans}  
                    keyExtractor={(item) => item.workout_plan_id.toString()} 
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.generalCard}>
                            <View style={styles.generalItem}>
                                <Text style={styles.generalTitle}>{item.plan_name}</Text>
                                <Text style={styles.generalText} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
                                <Text><Ionicons name="accessibility" size={13}></Ionicons>{item.count} Exercises</Text>
                            </View>
                            <View style={styles.imageContainer}>
                                <Image source={item.workout_image} style={styles.workoutImage} />
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{item.difficulty}</Text>
                                </View>
                            </View>
                            {selectedTab === "existing" && (
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity style={styles.iconButton} onPress={() => setShowEditExistingWorkoutModal(true)}>
                                        <Feather name="edit" size={22} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconButton}>
                                        <Feather name="trash" size={22} color="black" onPress={() => setShowDeleteModal(true)}/>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.listSection}
                    ListFooterComponent={<View style={{ height: 180 }} />}
                />
            </SafeAreaView>
            <TouchableOpacity style={styles.createBg} onPress={() => navigation.navigate("CreateWorkout")}>
                <View style={styles.createButton}>
                    <Text style={styles.createText}>Create</Text>
                    <Ionicons name="add" size={22} color='black' />
                </View>
            </TouchableOpacity>
            <DeleteModal
                visible={showDeleteModel}
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={() => setShowDeleteModal(false)}
            />
            <EditExistingWorkoutModal
                visible={showEditExistingWorkoutModal}
                onCancel={() => setShowEditExistingWorkoutModal(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212020' },
    titleStyle: { fontSize: 24, color: '#E2F163', fontWeight: 'bold', alignSelf: 'center', marginTop: 60},
    workoutplanSelection: { flexDirection: 'row', gap: 10, alignSelf: 'center'},
    selectionBg: { borderRadius: 20, paddingHorizontal: 30, paddingVertical: 10, marginTop: 20, marginBottom: 15},
    selectedBg: { backgroundColor: "#E2F163"},
    defaultBg: { backgroundColor: "white" },
    selectedText: { fontWeight: 'bold'},
    defaultText: { color: '#896CFE', fontWeight: 'bold'},

    addPadding: { padding: 15},
    generalCard:{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', marginBottom: 30, alignItems:'center', borderRadius: 20, overflow: "hidden", height:150, gap:'5%'},
    generalItem: { width:'50%', marginLeft:15 },
    generalTitle: { fontWeight: 'bold', color: 'black', fontSize:18, marginBottom:10 },
    generalText: { color: 'black', marginBottom:15 },
    workoutImage:{ width:'100%', height: '100%', borderRadius: 10 },
    imageContainer: { width: '45%', height:'100%'},
    badge: { position: "absolute", top: 0, right: 0, backgroundColor: "#E2F163", paddingHorizontal: 20, paddingRight:28, paddingVertical: 4, borderRadius: 10 },
    badgeText: { color: "#000", fontSize: 12 },
    addButton:{ borderRadius:"50%", backgroundColor:"#E2F163", width:50, height:50, alignItems:"center", position:'absolute', bottom:20, right:0 },
    iconContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: -30, position: "absolute", bottom: 0, left: "50%", transform: [{ translateX: 80 }], backgroundColor: "rgba(255, 255, 255, 0.8)", padding: 5, borderRadius: 10, gap: 5 },
    iconButton: { padding: 8 },
    createBg: { position: 'absolute', bottom: 20, left: 0, right: 0, backgroundColor: '#E2F163', borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', padding: 10, marginHorizontal: 150, borderWidth: 1},
    createButton: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
    createText: { fontWeight: 'bold', fontSize: 16},
});

export default Workout;