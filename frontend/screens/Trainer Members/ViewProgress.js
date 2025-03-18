import { SafeAreaView, View, TouchableOpacity, ScrollView, Text , Image, Modal, TextInput, Animated} from 'react-native';
import HeaderVer2 from '../HeaderVer2';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from "@react-navigation/native";
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';

const ViewProgress = () => {

    const route = useRoute();
    const { member } = route.params || {};
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [step, setStep] = useState(1);
    const [expandDetails, setExpandDetails] = useState(false);
    const [feedback, setFeedback] = useState({
        overall: "",
        weakAreas: "",
        finalFeedback: "",
    });

    const feedbackTabs = ["Overall Performance", "Weak Areas", "Final Feedback"];
    // const workoutDetails = [
    //     { exercise: "Push-ups 8x3", type: "Bodyweight", time: "1:30" },
    //     { exercise: "Squats 10x4", type: "Strength", time: "2:45" },
    //     { exercise: "Jump Rope 3x2", type: "Cardio", time: "3:20" },
    //     { exercise: "Lunges 10x3", type: "Strength", time: "2:20"},
    // ];

    const navigation = useNavigation();

    useEffect(() => {
        const handleResize = () => {
            console.log(Dimensions.get('window').width);
        };
        const subscription = Dimensions.addEventListener('change', handleResize);
        return () => subscription?.remove();
    }, []);

    const getTabColor = (tabIndex) => {
        if (step >= 3) {
          return { color: "#B3A0FF" }; 
        } else if (step >= 2 && tabIndex <= 2) {
          return { color: "#B3A0FF" }; 
        }
        return tabIndex === step ? styles.activeTabText : styles.inactiveTabText;
    };

    const getUnderlineStyle = (tabIndex) => {
        if (step >= 3) {
            return { backgroundColor: "#B3A0FF" };
        } else if (step >= 2 && tabIndex <= 2) {
            return { backgroundColor: "#B3A0FF" }; 
        }
        return tabIndex === step ? { backgroundColor: "#B3A0FF" } : { backgroundColor: "transparent" };
    };

    const [userId, setUserId] = useState("");
    const [progressDetails, setProgressDetails] = useState([]);
    const memberId = member.user_id;
    
    useEffect(() => {
    async function fetchUserId() {
        const token = await getUserId();
        setUserId(token.id);
    }
    fetchUserId();
    }, []);

    useEffect(() => {
        if(userId){
            fetchProgressDetails();
        }
    }, [userId]);

    const fetchProgressDetails = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/trainer-member/displayProgress/${memberId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
        }
    
            const data = await response.json();
    
        if (data.success) {
            setProgressDetails(data.progress);
        }
        } catch (error) {
            console.error("Error fetching user progress data:", error);
            Alert.alert("Error", error.message || "Network request failed");
        }
    };

    const [expandedSessions, setExpandedSessions] = useState({});
    const toggleSession = (title, sessionId) => {
        setExpandedSessions(prev => ({
            ...prev,
            [`${title}-${sessionId}`]: !prev[`${title}-${sessionId}`]
        }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderVer2
                title="Back" style={styles.headerRow}
                onPress={() => navigation.navigate("Members")}
            />

            {/* Content */}
            <ScrollView style={styles.bgStyle}>
                <View style={styles.progressCard}>
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

                    {/* Workout Section */}
                    {progressDetails.map((item) => (
                        <View key={item.title} style={styles.category}>
                            {/* Static Category Title */}
                            <View style={styles.categoryHeader}>
                            <Ionicons name="play" size={18} color="#E2F163" />
                            <Text style={styles.categoryTitle}>{item.title}</Text>
                            </View>

                            {/* Expandable Workout Sessions */}
                            {item.sessions.map((session) => (
                            <View key={session.id} style={styles.session}>
                                {/* Session Header (Expandable) */}
                                <TouchableOpacity onPress={() => toggleSession(item.title, session.id)} style={styles.sessionHeader}>
                                <Text style={styles.sessionNumber}>{session.id}</Text>

                                <Ionicons name="stopwatch-outline" size={16} color="#896CFE" />
                                <Text style={styles.sessionInfo}> {session.time} Time Taken </Text>
                                <Text style={styles.sessionDate}>{session.date}</Text>

                                <Ionicons
                                    name={expandedSessions[`${item.title}-${session.id}`] ? "chevron-up-outline" : "chevron-down-outline"}
                                    size={18}
                                    color="#896CFE"
                                />
                                </TouchableOpacity>

                                {/* Expandable Exercise List */}
                                {expandedSessions[`${item.title}-${session.id}`] && (
                                <View style={styles.exerciseList}>
                                    {session.exercises.length > 0 ? (
                                    session.exercises.map((exercise, index) => (
                                        <View key={index} style={styles.exerciseBox}>
                                            <Text style={styles.exercise}>{exercise.name}</Text>
                                            <View style={{ position: 'relative', width: 26, height: 26 }}>
                                                {exercise.completed ? (
                                                <>
                                                    <Ionicons name="checkmark-circle" size={26} color="#B7CD00" />
                                                    <Ionicons
                                                    name="checkmark"
                                                    size={16}
                                                    color="white"
                                                    style={{ position: 'absolute', top: 5, left: 5 }}
                                                    />
                                                </>
                                                ) : (
                                                <Ionicons name="ellipse" size={26} color="#BCBCBC" />
                                                )}
                                            </View>
                                        </View>
                                    ))
                                    ) : (
                                        <Text style={styles.noExercise}>No Exercises</Text>
                                    )}
                                    <TouchableOpacity style={styles.feedbackBtn} onPress={() => setFeedbackVisible(true)}>
                                        <Text style={styles.feedbackBtnText}>Feedback</Text>
                                    </TouchableOpacity>
                                </View>
                                )}
                                <TouchableOpacity style={styles.feedbackBtn} onPress={() => setFeedbackVisible(true)}>
                                    <Text style={styles.feedbackBtnText}>Feedback</Text>
                                </TouchableOpacity>
                            </View>
                            ))}
                        </View>
                    ))}
                    {/* {workout_plan_details.reduce((acc, exercise, index) => {
                        if (index % 4 === 0) {
                            acc.push([]);
                        }
                            acc[acc.length - 1].push(exercise);
                            return acc;
                    }, []).map((workoutGroup, idx) => (
                        <View key={idx} style={styles.workoutContainer}>
                        
                                <View style={styles.titleNdate}>
                                    <View style={styles.iconNtitle}>
                                        <Ionicons name="play" style={styles.playIcon} size={18}/>
                                        <Text style={styles.titleName}>Workout 1</Text>
                                    </View>
                                    <Text style={styles.dateStyle}>21 Jan 2025</Text>
                                </View>
                                <View style={styles.workoutList}>
                                {workoutGroup.map((exercise) => ( 
                                    <View key={exercise.id} style={styles.workoutDetails}>
                                    <Text style={styles.exerciseNameText} numberOfLines={3}>{exercise.exercise_name}</Text>
                                    <Text style={styles.exerciseTypeText}>{exercise.exercise_type}</Text>
                                    <View style={styles.timeTakenIconNText}>
                                        <Ionicons name="stopwatch-outline" size={18} color={"#896CFE"} />
                                        <Text style={styles.exerciseTimeText}>{exercise.time_taken}</Text>
                                    </View>                                    
                                </View>
                                ))}
                                <TouchableOpacity style={styles.feedbackBtn} onPress={() => setFeedbackVisible(true)}>
                                    <Text style={styles.feedbackBtnText}>Feedback</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))} */}
                </View>
            </ScrollView>
            {/* Feedback Modal */}
            <Modal visible={feedbackVisible} animationType="slide" transparent>
                <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                    <MaterialIcons name="feedback" size={24} color="black" />
                    <Text style={styles.modalTitle}>Member Feedback</Text>
                    <TouchableOpacity onPress={() => setFeedbackVisible(false)}>
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                    </View>

                    {/* Progress Tabs */}
                    <View style={styles.progressTabs}>
                    {feedbackTabs.map((title, index) => (
                        <TouchableOpacity key={index} onPress={() => setStep(index + 1)} style={styles.tabWrapper}>
                        <Text style={[styles.tabText, getTabColor(index + 1)]}>
                          {title}
                        </Text>
                        <Animated.View style={[styles.underline, getUnderlineStyle(index + 1)]} />
                      </TouchableOpacity>
                    ))}
                    </View>

                    {/* Workout Details Toggle */}
                    <TouchableOpacity onPress={() => setExpandDetails(!expandDetails)} style={styles.expandButton}>
                    <Text style={{ fontWeight: "bold", color: "#B3A0FF" }}>Workout Details</Text>
                    <Ionicons name={expandDetails ? "chevron-up" : "chevron-down"} size={18} color="#B3A0FF" />
                    </TouchableOpacity>

                    {/* Collapsible Workout Details */}
                    {expandDetails && (
                    <ScrollView style={styles.workoutModalContainer}>
                        {workoutDetails.map((workout, index) => (
                        <Text key={index} style={{ fontSize: 14 }}>
                            🔸 {workout.exercise} ({workout.type}) - {workout.time}
                        </Text>
                        ))}
                    </ScrollView>
                    )}

                    {/* Feedback Form */}
                    <ScrollView style={styles.formContainer}>
                    {step === 1 && (
                        <View style={styles.inputContainer}>
                        <Text style={styles.label}>Overall Performance:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Write overall feedback here..."
                            multiline
                            value={feedback.overall}
                            onChangeText={(text) => setFeedback({ ...feedback, overall: text })}
                        />
                        </View>
                    )}

                    {step === 2 && (
                        <View style={styles.inputContainer}>
                        <Text style={styles.label}>Weak Areas:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mention specific weaknesses..."
                            multiline
                            value={feedback.weakAreas}
                            onChangeText={(text) => setFeedback({ ...feedback, weakAreas: text })}
                        />
                        </View>
                    )}

                    {step === 3 && (
                        <View style={styles.inputContainer}>
                        <Text style={styles.label}>Final Trainer Feedback:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Give final improvement suggestions..."
                            multiline
                            value={feedback.finalFeedback}
                            onChangeText={(text) => setFeedback({ ...feedback, finalFeedback: text })}
                        />
                        </View>
                    )}
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View style={styles.footerButtons}>
                    {step > 1 && (
                        <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
                        <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                    )}

                    {step < 3 ? (
                        <TouchableOpacity style={styles.nextButton} onPress={() => setStep(step + 1)}>
                        <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.submitButton} onPress={() => setFeedbackVisible(false)}>
                        <Text style={styles.buttonText}>Submit Feedback</Text>
                        </TouchableOpacity>
                    )}
                    </View>
                </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#212020'},
    bgStyle: { padding: 20},
    progressCard: { backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 30 },

    memberProfile: { flexDirection: 'row', gap: 10},
    profileImage: { width: 80, height: 80, borderRadius: 50 },
    nameNemailContainer: { flexDirection: 'column', justifyContent: 'center'},
    nameText: { fontSize: 16, fontWeight: 'bold'},
    nameNgender: { flexDirection: 'row', gap: 5},
    femaleGenderText:{color:"#E370AC", fontSize:16},
    maleGenderText:{color:"#0066FF", fontSize:16},

    category: {
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: "#A5A5A5",
        marginTop: 20,
        marginBottom:20,
        paddingVertical:10,
    },
    categoryHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    categoryTitle: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: "bold",
        color: "#E2F163",
    },
    session: {
        paddingBottom: 10,
        marginHorizontal: 10,
    
    },
    sessionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "white",
        borderRadius:10,
    },
    sessionNumber: {
        fontWeight: "bold",
        color: "#232323",
        marginLeft:10,
        marginRight:30,
    },
    sessionInfo: {
        flex: 1,
        color: "#896CFE",
        fontWeight:600,
    },
    sessionDate: {
        color: "#896CFE",
        marginRight:10,
        fontWeight: 600,
    
    },
    exerciseList: {
        padding: 10,
        backgroundColor: "#E9E9E9",
        marginTop:-5,
        zIndex:-1,
        marginHorizontal:2,
    },
    exerciseBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        marginHorizontal:10,
    },
    exercise: {
        color: "#4D4D4D",
        fontWeight: 600,
    },
    noExercise: {
        textAlign: "center",
        color: "#aaa",
    },
    
    workoutContainer: { backgroundColor: '#A5A5A5', padding: 10, borderRadius: 10, marginTop: 15 },
    titleNdate: { flexDirection: 'row',  justifyContent: 'space-between', marginBottom: 10},
    titleName: { color: '#E2F163', fontWeight: 'bold', fontSize: 18},
    iconNtitle: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5,},
    playIcon: { color: '#E2F163'},
    dateStyle: { fontSize: 15, alignSelf: 'center', fontWeight: 'bold', fontSize: 16},

    workoutDetails: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', marginBottom: 3, padding: 4, opacity: 0.7, borderRadius: 5 },
    exerciseNameText: { fontWeight: 'bold', paddingLeft: 5, width: 120, fontSize: 13},
    exerciseTypeText: { fontWeight: 'bold', color: '#896CFE', width: 75, fontSize: 13, alignSelf: 'center'},
    timeTakenIconNText: { flexDirection: 'row', alignSelf: 'center'},
    exerciseTimeText: { fontSize: 13, width: 105},

    feedbackBtn: { backgroundColor: '#000', alignSelf: 'center', marginTop: 20, padding: 10, borderRadius: 15, width: 125 },
    feedbackBtnText: { textAlign: 'center', color: '#E2F163', fontSize: 16, fontWeight: 'bold'},

    modalBackground: {flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: 'center', alignItems: 'center'},
    modalContainer: { backgroundColor: '#E2F163', width: '90%', padding: 20, borderRadius: 10},
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10},
    modalTitle: { fontSize: 18, fontWeight: 'bold'},

    progressTabs: { flexDirection: 'row', borderBottomWidth: 3, marginBottom: 5, justifyContent: 'space-between', alignItems: 'center', borderBottomColor: 'gray' },
    tabWrapper: { flex: 1, paddingVertical: 10, alignItems: 'center'},
    tabText: { fontWeight: 'bold', fontSize: 11},
    activeTabText: { color: '#B3A0FF'},
    inactiveTabText: { color: 'gray'},
    underline: { height: 3, marginBottom: -3, width: "100%", backgroundColor: "transparent", position: "absolute", bottom: 0 },

    expandButton: { flexDirection: 'row', alignItems: 'center', marginBottom: '10'},
    workoutModalContainer: { maxHeight: 100, backgroundColor: '#F8F8F8', padding: 10, borderRadius: 5},

    formContainer: {maxHeight: 250},
    inputContainer: { marginBottom: 10},
    label: { fontWeight: 'bold', marginBottom: 5},
    input: { backgroundColor: '#F8F8F8', padding: 10, borderRadius: 5},

    footerButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15},
    backButton: { backgroundColor: 'gray', padding: 10, borderRadius: 5, flex: 1, alignItems: 'center', marginRight: 5},
    nextButton: { backgroundColor: "#896CFE", padding: 10, borderRadius: 5, flex: 1, alignItems: "center", marginLeft: 5 },
    submitButton: { backgroundColor: "#896CFE", padding: 10, borderRadius: 5, flex: 1, alignItems: "center" },
    buttonText: { color: "white", fontWeight: "bold" },
});

export default ViewProgress;