import { StyleSheet } from "react-native";
import HeaderVer4 from "../HeaderVer4";
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, View, TouchableOpacity, ScrollView, Text , Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect, useCallback } from "react";
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';

const MemberWorkoutPlan = () => {

    const navigation=useNavigation();
    const route = useRoute();
    const { member } = route.params || {};
    const [userId, setUserId] = useState("");
    const [workoutDetails, setWorkoutDetails] = useState([]);

    useEffect(() => {
    async function fetchUserId() {
        const token = await getUserId();
        setUserId(token.id);
    }
    fetchUserId();
    }, []);

    useEffect(() => {
        if(userId){
            fetchMemberWorkout();
        }
    }, [userId]);

    const fetchMemberWorkout = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/trainer-workout/displayMemberWorkout/${userId}/${member.user_id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    
            const data = await response.json();
    
        if (data.success) {
            setWorkoutDetails([
                ...data.progress, 
                { id: "add", plan_name: "Add Workout" } 
            ]);
        }
        } catch (error) {
            console.error("Error fetching workout data:", error);
            Alert.alert("Error", error.message || "Network request failed");
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <HeaderVer4
                title="Back" style={styles.headerRow}
                onPress={() => navigation.goBack()}
            />

            <ScrollView style={styles.content}>
                <Text style={styles.titleText}>{member.name}'s Workout</Text>                
                <View style={styles.bgStyle}>
                {workoutDetails.map((row, index) => (
                    <View key={row.user_workout_id || row.id || index} style={styles.workoutRow}>
                        <TouchableOpacity 
                            style={[styles.workoutBox, row.id === "add" && styles.addWorkoutBox]}
                            onPress={row.id === "add" ? () => navigation.navigate("CreateWorkout", { memberId: member.user_id, member, category: "Coach"}) : 
                                () => navigation.navigate("ViewWorkout", { workoutId: row.workout_plan_id, memberName: member.name, refreshPage:fetchMemberWorkout, member})}
                        >
                            {row.id === "add" ? (
                                <Feather name="plus" size={40} color="#B3A0FF" />
                            ) : (
                                <>
                                    <Text style={styles.workoutNameText}>{row.plan_name}</Text>
                                    <Text style={styles.viewDetailsText}>View Details</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212020' },
    content: { padding: 10},
    bgStyle: { padding: 10},
    titleText: { color: '#E2F163', fontSize: 24, fontWeight: 'bold', alignSelf: 'center', marginBottom:10},

    workoutRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, gap: 10},
    workoutBox: { backgroundColor: '#E2F163', flex: 1, margin: 5, height: 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    addWorkoutBox: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#B3A0FF', borderStyle: 'dashed'},
    workoutNameText: { fontWeight: 'bold', fontSize: 16, marginBottom:5 },
    viewDetailsText: { fontSize: 13},
});
    

export default MemberWorkoutPlan;