import { SafeAreaView, View, TouchableOpacity, ScrollView, Text , Image, Modal, TextInput, Animated} from 'react-native';
import HeaderVer2 from '../HeaderVer2';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from "@react-navigation/native";

const ViewProgress = () => {

    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [step, setStep] = useState(1);
    const [expandDetails, setExpandDetails] = useState(false);
    const [feedback, setFeedback] = useState({
        overall: "",
        weakAreas: "",
        finalFeedback: "",
    });

    const feedbackTabs = ["Overall Performance", "Weak Areas", "Final Feedback"];
    const workoutDetails = [
        { exercise: "Push-ups 8x3", type: "Bodyweight", time: "1:30" },
        { exercise: "Squats 10x4", type: "Strength", time: "2:45" },
        { exercise: "Jump Rope 3x2", type: "Cardio", time: "3:20" },
        { exercise: "Lunges 10x3", type: "Strength", time: "2:20"},
    ];

    const navigation = useNavigation();

    useEffect(() => {
        const handleResize = () => {
            console.log(Dimensions.get('window').width);
        };
        const subscription = Dimensions.addEventListener('change', handleResize);
        return () => subscription?.remove();
    }, []);

    const member = {
        name: "Emily Lai",
        gender: "female",
        email: "emily.lai@example.com",
    };

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

    const workout_plan_details = [
        { id: '1', exercise_name: 'Push-ups 8x3', exercise_type: 'Bodyweight', time_taken: '1:30 Time Taken' },
        { id: '2', exercise_name: 'Squats 10x4', exercise_type: 'Strength', time_taken: '2:45 Time Taken' },
        { id: '3', exercise_name: 'Jump Rope 3x2', exercise_type: 'Cardio', time_taken: '3:20 Time Taken' },
        { id: '4', exercise_name: 'Box Jumps 5x3', exercise_type: 'Plyometric', time_taken: '1:50 Time Taken' },
        { id: '5', exercise_name: 'Plank 1x1', exercise_type: 'Core', time_taken: '5:00 Time Taken' },
        { id: '6', exercise_name: 'Deadlifts 5x3', exercise_type: 'Strength', time_taken: '4:15 Time Taken' },
        { id: '7', exercise_name: 'Pull-ups 6x4', exercise_type: 'Bodyweight', time_taken: '3:30 Time Taken' },
        { id: '8', exercise_name: 'Lunges 10x3', exercise_type: 'Strength', time_taken: '2:20 Time Taken' },
        { id: '9', exercise_name: 'Burpees 8x2', exercise_type: 'HIIT', time_taken: '2:00 Time Taken' },
        { id: '10', exercise_name: 'Mountain Climbers 4x30s', exercise_type: 'Cardio', time_taken: '2:45 Time Taken' },
        { id: '11', exercise_name: 'Russian Twists 15x3', exercise_type: 'Core', time_taken: '2:30 Time Taken' },
        { id: '12', exercise_name: 'Kettlebell Swings 12x3', exercise_type: 'Strength', time_taken: '3:10 Time Taken' },
        { id: '13', exercise_name: 'Bicycle Crunches 20x2', exercise_type: 'Core', time_taken: '2:00 Time Taken' },
        { id: '14', exercise_name: 'Jump Squats 6x4', exercise_type: 'Plyometric', time_taken: '2:15 Time Taken' },
        { id: '15', exercise_name: 'Dumbbell Shoulder Press 8x3', exercise_type: 'Strength', time_taken: '3:00 Time Taken' },
        { id: '16', exercise_name: 'Deadlifts 5x3', exercise_type: 'Strength', time_taken: '4:15 Time Taken' },
    ];
    

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
                        <Image
                            source={require("../../assets/icon.png")}
                            style={styles.profileImage}
                        />
                        <View style={styles.nameNemailContainer}>
                            <View style={styles.nameNgender}>
                                <Text style={styles.nameText}>{member.name}</Text>
                                <Text style={styles.genderText}>
                                    {member.gender === "male" ? "♂️" : "♀️"}
                                </Text>
                            </View>
                            <Text>{member.email}</Text>
                        </View>
                    </View>

                    {/* Workout Section */}
                    {workout_plan_details.reduce((acc, exercise, index) => {
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
                    ))}
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
    bgStyle: { padding: 15, marginTop: -10},
    progressCard: { backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 30 },

    memberProfile: { flexDirection: 'row', gap: 10},
    profileImage: { width: 80, height: 80, borderRadius: 50 },
    nameNemailContainer: { flexDirection: 'column', justifyContent: 'center'},
    nameText: { fontSize: 16, fontWeight: 'bold'},
    nameNgender: { flexDirection: 'row', gap: 5},
    
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

    feedbackBtn: { backgroundColor: '#000', alignSelf: 'center', marginTop: 8, padding: 10, borderRadius: 15, width: 125 },
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