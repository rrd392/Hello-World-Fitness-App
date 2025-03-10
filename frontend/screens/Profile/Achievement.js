import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, Image, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import loyalMember from "../../assets/badges/loyal_member.png";
import firstStep from "../../assets/badges/first_step.png";
import feedback from "../../assets/badges/feedback.png";
import unknownBadge from "../../assets/badges/unknown_badge.png";
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';

const Achievement = () => {
    const navigation = useNavigation();
    const [userId, setUserId] = useState("");
    const [userData, setUserData] = useState([]);
    const [points, setUserPoints] = useState("");
    
    useEffect(() => {
        async function fetchUserId() {
            const token = await getUserId();
            setUserId(token.id);
        }
        fetchUserId();
    }, []);

    useEffect(() => {
        if(userId){
            fetchUserData();
            fetchPoints();
        }
    }, [userId]);

    const fetchUserData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/profile/displayUserData/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
    
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
          }
    
          const data = await response.json();
    
          if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", error.message || "Network request failed");
        }
    };

    const fetchPoints = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/profile/displayPoints/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
    
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
          }
    
          const data = await response.json();
    
          if (data) {
            setUserPoints(data.points);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", error.message || "Network request failed");
        }
    };
    const [achievedBadges, setAchievedBadges] = useState([]);

    const unlockBadge = () => {
        setAchievedBadges([...achievedBadges, "A Journey Begins"]);
    };
    
    const badgesBeforeList = [
        { id: '1', badgeImage: unknownBadge, badgeName: "A Journey Begins...", description: "Every commitment starts with a single step. Will you take it?", points: "? Points" },
        { id: "2", badgeImage: unknownBadge, badgeName: "The Key to Loyalty", description: "Consistency is the secret to unlocking this achievement.", points: "? Points" },
        { id: "3", badgeImage: unknownBadge, badgeName: "Your Voice Matters...", description: "Sharing your thoughts might lead to an unexpected surprise.", points: "? Points" },
        { id: "4", badgeImage: unknownBadge, badgeName: "Hidden Champion", description: "There’s more to achieve than meets the eye!", points: "? Points" },
        { id: "5", badgeImage: unknownBadge, badgeName: "Identity Unlocked", description: "There’s more to discover about yourself...", points: "? Points" },
    ];

    const badgesAfterList = [
        { id: '1', badgeImage: loyalMember, badgeName: "Loyal Member", date: "1/1/2025" ,description: "Thanks for your continued support! Keep up your fitness journey!", points: "150 Points" },
        { id: "2", badgeImage: firstStep, badgeName: "First Step Taken", date: "1/1/2025" , description: "You’ve booked your first class! Let’s get moving", points: "125 Points" },
        { id: "3", badgeImage: feedback, badgeName: "Reviewer", date: "1/1/2025" , description: "Your feedback helps us improve. Thanks for sharing!", points: "50 Points" },
        { id: "4", badgeImage: loyalMember, badgeName: "Hidden Champion", description: "There’s more to achieve than meets the eye!", points: "50 Points" },
        { id: "5", badgeImage: feedback, badgeName: "Identity Unlocked", description: "There’s more to discover about yourself...", points: "35 Points" },
    ];

    const hasAchievedJourneyBegins = achievedBadges.includes("A Journey Begins");
    const displayBadges = hasAchievedJourneyBegins ? badgesAfterList : badgesBeforeList;

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <View style={styles.headerRow}>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('ProfileDashboard')}>
                        <Ionicons name="caret-back" size={20} color="#E2F163"/>
                        <Text style={styles.homeText}>Profile</Text>
                    </TouchableOpacity>                    
                    <View style={styles.iconRow}>
                        <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
                            <Ionicons name="trophy" size={24} color="#896CFE" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={{marginBottom: 40}}>
                <View style={styles.profileSection}>
                    <Image source={userData.profile_picture? { uri: `${API_BASE_URL}/uploads/${userData.profile_picture}`}
                        : require("../../assets/icon.png")} style={styles.profileImage} />
                    <Text style={styles.nameText}>{userData.name}</Text>
                    <View style={styles.pointsContainer}>
                        <Ionicons name="flame" size={20} color="#F24814" paddingLeft={5} />
                        <Text style={styles.pointsText}>{points} Points</Text>
                    </View>
                </View>

                
                <Text style={styles.badgeText}>Your Badges</Text>
                {displayBadges.map((badge) => (
                    <View key={badge.id} style={styles.badgeCard}>
                        <Image source={badge.badgeImage} style={styles.badgeImage} />
                        <View style={styles.badgeContent}>
                            <View style={styles.badgeHeader}>
                                <Text style={styles.badgeName}>{badge.badgeName}</Text>
                                <Text style={styles.badgeDate}>{badge.date}</Text>
                            </View>
                            <Text style={styles.badgeDescription}>{badge.description}</Text>
                        </View>
                        <Text style={styles.badgePoints}>{badge.points}</Text>
                    </View>
                ))}

                <View style={styles.comingsoonBadge}>
                    <Text style={styles.comingsoonText}>ComingSoon</Text>
                </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { padding: 20, marginBottom:-30},
    headerRow: { flexDirection: 'row', justifyContent: 'space-between'},
    homeButton: { flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: -10 },
    homeText: { fontSize: 24, color: 'white', fontWeight: 'bold' },
    iconRow: { flexDirection: 'row', alignItems: 'center', },

    profileSection: { alignItems: "center", padding: 20, backgroundColor: "black" },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginVertical: 10},
    nameText: { color: 'white', fontSize: 16, fontWeight: 'bold'},
    pointsContainer: { backgroundColor: 'white', borderRadius: 15, flexDirection: 'row', width: 120, gap: 10, padding: 3, marginTop: 5},
    pointsText: { fontSize: 14, fontWeight: 'bold'},

    badgeText: { color: "white", fontSize: 24, fontWeight: "bold", textAlign: "center", textShadowColor: "#896CFE", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 5, marginBottom: 10, },
    badgeCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 15, padding: 15, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, },
    badgeImage: { width: 55, height: 55, marginRight: 10, },
    badgeContent: { flex: 1, },
    badgeHeader: { flexDirection: "row", alignItems: "center", gap: 8},
    badgeName: { fontWeight: 'bold', fontSize: 16, color: "black", },
    badgeDate: { fontSize: 14, color: "#999", },
    badgeDescription: { fontSize: 13, color: "#666", marginTop: 3, width: 210 },
    badgePoints: { fontWeight: "bold", fontSize: 14, color: "black" },
    lockedBadge: { opacity: 0.5 },
    comingsoonBadge: { alignItems: "center", backgroundColor: "#fff", borderRadius: 15, padding: 18, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3,},
    comingsoonText: { fontSize: 24, fontWeight: 'bold', flexDirection: "column", color: 'gray'},
});

export default Achievement;