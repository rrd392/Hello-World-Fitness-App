import { View, SafeAreaView, Text, TouchableOpacity, FlatList, Image, Animated, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import DeleteModal from "./DeleteModal";
import EditExistingWorkoutModal from "./EditExistingWorkoutModal";
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';
    
const Workout = () => {

    const [showDeleteModel, setShowDeleteModal] = useState(false);
    const [showEditExistingWorkoutModal, setShowEditExistingWorkoutModal] = useState(false);
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [memberDetails, setMemberDetails] = useState([]);
    const [generalWorkout, setGeneralWorkout] = useState([]);

    useEffect(() => {
    async function fetchUserId() {
        const token = await getUserId();
        setUserId(token.id);
        setUserName(token.name);
    }
    fetchUserId();
    }, []);

    useEffect(() => {
        if(userId){
            fetchMemberDetails();
        }
    }, [userId]);

    useEffect(() => {
        fetchGeneralWorkout();
    }, []);

    const fetchMemberDetails = async () => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/trainer-member/display/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    
        const data = await response.json();
    
        if (data.success) {
            setMemberDetails(data.progress);
        }
        } catch (error) {
        console.error("Error fetching member data:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    };

    const fetchGeneralWorkout = async () => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/trainer-workout/displayGeneralWorkout`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    
        const data = await response.json();
    
        if (data.success) {
            setGeneralWorkout(data.progress);
        }
        } catch (error) {
        console.error("Error fetching general workout:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    };
    
    const navigation = useNavigation();
    const toggleNotification = () => navigation.navigate('Notification');
    const handleGoToProfile = () => navigation.navigate('TrainerProfileStack');

    const [selectedTab, setSelectedTab] = useState("general");
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={styles.headerRow}>
                    <Text style={styles.greeting}>Hi, {userName}</Text>
                    <View style={styles.iconRow}>
                        <TouchableOpacity onPress={toggleNotification}>
                            <Ionicons name="notifications" size={24} color="#896CFE" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleGoToProfile}>
                            <Ionicons name="person" size={24} color="#896CFE" />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.subtitle}>It’s time to challenge your limits.</Text>
                <Text style={styles.titleStyle}>Workout Plan</Text>
                <View style={styles.workoutplanSelection}>
                    <TouchableOpacity
                        style={[
                            styles.selectionBg,
                            selectedTab === "general" ? styles.selectedBg : styles.defaultBg
                        ]}
                        onPress={() => setSelectedTab("general")}
                    >
                        <Text
                            style={styles.selectedText}
                        >
                            General
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.selectionBg,
                            selectedTab === "member" ? styles.selectedBg : styles.defaultBg
                        ]}
                        onPress={() => setSelectedTab("member")}
                    >
                        <Text
                            style={styles.selectedText }
                        >
                            Member
                        </Text>
                    </TouchableOpacity>
                </View>
                {selectedTab === "general"? (
                    <FlatList style={styles.addPadding}
                    data={generalWorkout}  
                    keyExtractor={(item) => item.workout_plan_id.toString()} 
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.generalCard}>
                            <View style={styles.generalItem}>
                                <Text style={styles.generalTitle}>{item.plan_name}</Text>
                                <Text style={styles.generalText} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
                                <Text><Ionicons name="accessibility" size={13}></Ionicons>{item.count} Exercises</Text>
                            </View>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: `${API_BASE_URL}/uploads/${item.workout_image}` }} style={styles.workoutImage} />
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{item.difficulty}</Text>
                                </View>
                            </View>
                            {selectedTab === "general" && (
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity style={styles.iconButton} onPress={() => {setSelectedWorkoutId(item.workout_plan_id); setShowEditExistingWorkoutModal(true);}}>
                                        <Feather name="edit" size={22} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconButton}>
                                        <Feather name="trash" size={22} color="black" onPress={() => {setSelectedWorkoutId(item.workout_plan_id); setShowDeleteModal(true);}}/>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.listSection}
                    ListFooterComponent={<View style={{ height: 180 }} />}
                    />
                ):(
                    <ScrollView style={styles.membersSection}>
                        {memberDetails.map((member) => (
                            <View key={member.user_id} style={styles.memberCardSection}>
                            {/* Member Profile */}
                            <View style={styles.memberProfile}>
                                <Image source={{ uri: `${API_BASE_URL}/uploads/${member.profile_picture}` }} style={styles.profileImage} />
                                <View style={styles.nameNemailContainer}>
                                    <View style={styles.nameNgender}>
                                        <Text style={styles.nameText}>{member.name}</Text>
                                        <Text style={member.gender === "Male" ? styles.maleGenderText:styles.femaleGenderText}>
                                            {member.gender === "Male" ? "♂️" : "♀️"}
                                        </Text>
                                    </View>
                                    <Text>{member.email}</Text>
                                </View>
                                
                            </View>
                            <View style={styles.divider} />
                            {/* Member Information */}
                            <View style={styles.memberInfoRow1}>
                                <View style={styles.infoStyle}>
                                    <Text style={styles.infoTitle}>Age:</Text>
                                    <Text style={styles.infoData}>{new Date().getFullYear() - new Date(member.date_of_birth).getFullYear()}</Text>
                                </View>
                                <View style={styles.infoStyle}>
                                    <Text style={styles.infoTitle}>Height:</Text>
                                    <Text style={styles.infoData}>{member.height}</Text>
                                </View>
                                <View style={styles.infoStyle}>
                                    <Text style={styles.infoTitle}>Weight:</Text>
                                    <Text style={styles.infoData}>{member.weight}</Text>
                                </View>
                            </View>
                            <View style={styles.memberInfoRow2}>
                                <View style={styles.infoStyle}>
                                    <Text style={styles.infoTitle}>Fitness Goal:</Text>
                                    <Text style={styles.infoData}>{member.fitness_goals}</Text>
                                </View>
                            </View>

                            {/* Buttons Section */}
                            <View style={styles.btnSelection}>
                                <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate("MemberWorkoutPlan", {member})}>
                                    <Text style={styles.buttonText}>View Workout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        ))}
                    </ScrollView>
                )}
            </SafeAreaView>
            {selectedTab === "general"? (
                <TouchableOpacity style={styles.createBg} onPress={() => navigation.navigate("CreateWorkout", {memberId: "", member: [], category: "General"})}>
                    <View style={styles.createButton}>
                        <Text style={styles.createText}>Create</Text>
                        <Ionicons name="add" size={22} color='black' />
                    </View>
                </TouchableOpacity>
            ):null}
            <DeleteModal
                visible={showDeleteModel}
                onCancel={() => setShowDeleteModal(false)}
                workoutId={selectedWorkoutId}
                member = {[]}
                category = {"General"}   
                refreshPage = {fetchGeneralWorkout}             
            />
            <EditExistingWorkoutModal
                visible={showEditExistingWorkoutModal}
                onCancel={() => setShowEditExistingWorkoutModal(false)}
                workoutId = {selectedWorkoutId}
                refreshPage = {fetchGeneralWorkout}             
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212020', padding:20 },
    greeting: { fontSize: 24, color: '#896CFE', fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#fff', marginBottom: 30 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13, backgroundColor: "#212020", gap: 20 },
    iconRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 20, },
    titleStyle: { fontSize: 24, color: '#E2F163', fontWeight: 'bold',},
    workoutplanSelection: { flexDirection: 'row', justifyContent:'space-between'},
    selectionBg: { borderRadius: 20, width:"48%", paddingVertical: 10, marginTop: 20, marginBottom: 15},
    selectedBg: { backgroundColor: "#E2F163"},
    defaultBg: { backgroundColor: "white" },
    selectedText: { fontWeight: 'bold', textAlign:'center'},

    addPadding: { paddingVertical: 15},
    generalCard:{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', marginBottom: 30, alignItems:'center', borderRadius: 20, overflow: "hidden", height:150, gap:'5%'},
    generalItem: { width:'50%', marginLeft:15 },
    generalTitle: { fontWeight: 'bold', color: 'black', fontSize:18, marginBottom:10 },
    generalText: { color: 'black', marginBottom:15 },
    workoutImage:{ width:'100%', height: '100%', borderRadius: 10 },
    imageContainer: { width: '45%', height:'100%'},
    badge: { position: "absolute", top: 0, right: 0, backgroundColor: "#E2F163", paddingHorizontal: 20, paddingRight:28, paddingVertical: 4, borderRadius: 10 },
    badgeText: { color: "#000", fontSize: 12 },
    iconContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: -30, position: "absolute", bottom: 0, left: "50%", transform: [{ translateX: 80 }], backgroundColor: "rgba(255, 255, 255, 0.8)", padding: 5, borderRadius: 10, gap: 5 },
    iconButton: { padding: 8 },
    createBg: { position: 'absolute', bottom: 20, left: 0, right: 0, backgroundColor: '#E2F163', borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', padding: 10, marginHorizontal: 150, borderWidth: 1},
    createButton: { alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
    createText: { fontWeight: 'bold', fontSize: 16},

    membersSection: { paddingVertical: 15, flexGrow:1, marginBottom:190},
    memberCardSection: { backgroundColor: '#E9E9E9', padding: 15, borderRadius: 15, marginBottom: 20},
    memberProfile: { flexDirection: 'row', gap: 10},
    profileImage: { width: 80, height: 80, borderRadius: 50 },
    nameNemailContainer: { flexDirection: 'column', justifyContent: 'center'},
    nameText: { fontSize: 16, fontWeight: 'bold'},
    nameNgender: { flexDirection: 'row', gap: 5},
    femaleGenderText:{color:"#E370AC", fontSize:16},
    maleGenderText:{color:"#0066FF", fontSize:16},

    divider: { height: 1, backgroundColor: "#666", marginBottom: 10, marginTop: 10},
    memberInfoRow1: { flexDirection: 'row', justifyContent: 'space-between'},
    infoStyle: { flexDirection: 'row', gap: 5},
    infoTitle: { fontSize: 16},
    infoData: { fontSize: 16, fontWeight: 'bold'},
    memberInfoRow2: { marginTop: 10},

    btnSelection: { marginLeft:'auto', marginTop: 10},
    viewBtn: { backgroundColor: 'black', width: 140, borderRadius: 20 },
    buttonText: { color: '#E2F163', fontWeight: 'bold', alignSelf: 'center', fontSize: 16, padding: 8},
});

export default Workout;