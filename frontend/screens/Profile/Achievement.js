import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, Image, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import unknownBadge from "../../assets/badges/loyal_member.png";
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';

const Achievement = () => {
    const navigation = useNavigation();
    const [userId, setUserId] = useState("");
    const [userData, setUserData] = useState([]);
    const [points, setUserPoints] = useState("");
    const [userBadge, setUserBadge] = useState([]);
    const [otherBadge, setOtherBadge] = useState([]);
    
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
            fetchBadges();
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

    const fetchBadges = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/profile/displayUserBadge/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
    
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
          }
    
          const data = await response.json();
    
          if (data) {
            setUserBadge(data.badges);
            setOtherBadge(data.other);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", error.message || "Network request failed");
        }
    };

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

                <ScrollView style={{marginBottom: -20}}>
                    <View style={styles.profileSection}>
              <Image source={userData.profile_picture ? { uri: `${API_BASE_URL}/uploads/${userData.profile_picture}?t=${Date.now()}`}
                            : require("../../assets/icon.png")} style={styles.profileImage} />
                        <Text style={styles.nameText}>{userData.name}</Text>
                        <View style={styles.pointsContainer}>
                            <Ionicons name="flame" size={20} color="#F24814" paddingLeft={5} />
                            <Text style={styles.pointsText}>{points? points: 0} Points</Text>
                        </View>
                    </View>

                    
                    <Text style={styles.badgeText}>Your Badges</Text>
                    <View style={{flex:1, flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
                        {userBadge.length > 0?
                          (userBadge.map((badge) => (
                            <View key={badge.badge_id} style={styles.badgeCard}>
                                <Image source={badge.icon? { uri: `${API_BASE_URL}/uploads/${badge.icon}`}
                                : unknownBadge} style={styles.profileImage} />
                                <View style={styles.badgeContent}>
                                    <Text style={styles.badgeName}>{badge.name}</Text>
                                    <Text style={styles.badgeDate}>{new Date(badge.earned_date).toLocaleDateString('en-GB')}</Text>
                                    <Text style={styles.badgePoints}>{badge.points_needed} points</Text>
                                </View>
                            </View>
                        ))):(
                          <View>
                            <Text style={{color:"#fff", marginBottom:10, fontWeight:500, fontSize:16}}>No badges.</Text>
                          </View>
                        )}
                    </View>

                    <Text style={styles.badgeText}>Other Badges</Text>
                    <View style={{flex:1, flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
                        {otherBadge.map((badge) => (
                            <View key={badge.badge_id} style={styles.badgeCard}>
                                <Image source={badge.icon? { uri: `${API_BASE_URL}/uploads/${badge.icon}`}
                                : unknownBadge} style={styles.profileImage} />
                                <View style={styles.badgeContent}>
                                    <Text style={styles.badgeName}>{badge.name}</Text>
                                    <Text style={styles.badgePoints}>{badge.points_needed} points</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212020',padding: 20, },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between'},
    homeButton: { flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: -10 },
    homeText: { fontSize: 24, color: '#896CFE', fontWeight: 'bold' },
    iconRow: { flexDirection: 'row', alignItems: 'center', },

    profileSection: { alignItems: "center", padding: 20 },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginVertical: 10},
    nameText: { color: 'white', fontSize: 16, fontWeight: 'bold'},
    pointsContainer: { backgroundColor: 'white', borderRadius: 15, flexDirection: 'row', width: 120, gap: 10, padding: 3, marginTop: 5},
    pointsText: { fontSize: 14, fontWeight: 'bold'},

    badgeText: { color: "white", fontSize: 22, fontWeight: "bold", textShadowColor: "#896CFE", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 5, marginBottom: 10, },
    badgeCard: { flexDirection: "column", alignItems: "center", width:"30%", marginBottom: 10, },
    badgeContent: { flex: 1, alignItems:'center'},
    badgeName: { fontWeight: 'bold', fontSize: 16, color: "white",marginBottom:5 },
    badgeDate: { fontSize: 14, color: "#E2F163", marginBottom:5},
    badgePoints: { fontWeight: "bold", fontSize: 14, color: "white",marginBottom:20 },
});

export default Achievement;