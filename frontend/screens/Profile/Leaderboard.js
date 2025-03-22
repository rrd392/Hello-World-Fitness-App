import { ScrollView, StyleSheet, View, Text, Image, SafeAreaView } from "react-native";
import HeaderVer1 from "../HeaderVer1"
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';
import React, { useState, useEffect } from "react";

const Leaderboard = () => {
    const navigation = useNavigation();
    const [userId, setUserId] = useState("");
    const [userPoints, setUserPoints] = useState([]);
    
    useEffect(() => {
        async function fetchUserId() {
            const token = await getUserId();
            setUserId(token.id);
        }
        fetchUserId();
    }, []);

    useEffect(() => {
        if(userId){
            fetchUserPoints();
        }
    }, [userId]);

    const fetchUserPoints = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/profile/displayUserPoints`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
    
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
          }
    
          const data = await response.json();
    
          if (data) {
            setUserPoints(assignColors(data.results));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", error.message || "Network request failed");
        }
    };
    
    const assignColors = (users) => {
        return users.map((user, index) => ({
            ...user,
            rank: index + 1, 
            color: getColorByRank(index + 1),
            badgeColor: getBadgeColorByRank(index + 1),
            height: getHeightByRank(index + 1),
        }));
    };

    const getColorByRank = (rank) => {
        if (rank === 1) return "#4A7BFF";  
        if (rank === 2) return "#6C6EC6";  
        if (rank === 3) return "#6C6EC6";  
    };
    
    const getBadgeColorByRank = (rank) => {
        if (rank === 1) return "#9FFFA4";
        if (rank === 2) return "#5CE1E6";
        if (rank === 3) return "#FFD700";
    };
    
    const getHeightByRank = (rank) => {
        if (rank === 1) return 180;
        if (rank === 2) return 160;
        if (rank === 3) return 140;
    };

    const reorderedPodium = (users) => {
        if (!users || users.length < 3) return []; 
    
        return [users[1], users[0], users[2],...users.slice(3)];
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <HeaderVer1
                    title="Achievement"
                    onPress={() => navigation.navigate("Achievement")}
                />

                <Text style={styles.title}>Leaderboard</Text>

                <View style={styles.podium}>
                    {reorderedPodium(userPoints).slice(0,3).map((user, index) => (
                        <View
                            key={user.user_id} style={[ styles.podiumBlock, {backgroundColor: user.color, height: user.height }]}
                        >
                            <View style={styles.profileContainer}>
                                <Image source={user.profile_picture? { uri: `${API_BASE_URL}/uploads/${user.profile_picture}`}
                        : require("../../assets/icon.png")} style={styles.profileImage(user.rank)} />
                                <View style={[styles.rankBadge, { backgroundColor: user.badgeColor }]}>
                                    <Text style={styles.rankText}>{user.rank}</Text>
                                </View>
                            </View>
                            <View style={[styles.textContainer, { marginTop: user.height * 0.2}]}>
                                <Text style={styles.username}>{user.name}</Text>
                                <View style={styles.pointsContainer}>
                                    <Ionicons name="flame" size={24} color="#F24814" />
                                    <Text style={[styles.score, { color: user.badgeColor }]}>{user.totalPoints}</Text>
                                </View>
                                <Text style={styles.usernameTag}>@{user.username}</Text>
                            </View> 
                        </View>
                    ))}
                </View>

                <View style={styles.rank4NbelowContainer}>
                    <ScrollView style={{ maxHeight: 400 }}>
                        {userPoints.slice(3).map((user, index) => (
                            <View key={user.user_id}>
                                <View style={styles.rankCard}>
                                    <Image source={user.profile_picture? { uri: `${API_BASE_URL}/uploads/${user.profile_picture}`}
                        : require("../../assets/icon.png")} style={styles.rank4NbelowprofileImage} />
                                    <View style={styles.userInfo}>
                                        <Text style={styles.username2}>{user.name}</Text>
                                        <Text style={styles.usernameTag}>@{user.username}</Text>
                                    </View>
                                    <View style={styles.pointsContainer}>
                                        <Ionicons name="flame" size={18} color="#F24814" />
                                        <Text style={styles.rank4Nbelowscore}>{user.totalPoints}</Text>
                                    </View>
                                </View>
                                {index !== userPoints.slice(3).length - 1 && <View style={styles.divider} />}
                            </View>
                        ))}
                        
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212020' },
    header: { paddingTop: 40, marginBottom:-30, padding: 10},
    title: { color: "white", fontSize: 24, fontWeight: "bold", textAlign: "center", textShadowColor: "#896CFE", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 5, marginBottom: 10, },

    podium: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 10, marginTop: 60 },
    podiumBlock: {
        width: 110,
        borderRadius: 20,
        alignItems: "center",
        padding: 10,
        justifyContent: "flex-end"
    },
    profileContainer: { alignItems: "center", position: "absolute", top: -40, },
    rankBadge: {
        position: "absolute",
        bottom: -10,
        width: 25,
        height: 25,
        borderRadius: 8,
        transform: [{ rotate: "45deg" }],
        justifyContent: "center",
        alignItems: "center",
    },
    
    rankText: { fontWeight: "bold", color: "#000", transform: [{ rotate: "-45deg" }] },

    textContainer: {
        alignItems: "center", 
    },
    profileImage: (rank) => ({
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 4, 
        borderColor: rank === 1 ? "#6FCF97" : rank === 2 ? "#56CCF2" : "#F2C94C", 
    }),

    username: { color: "white", fontSize: 16, fontWeight: "bold",marginBottom: 2, textAlign:'center' },
    username2:{color: "white", fontSize: 16, fontWeight: "bold",marginBottom: 2,},
    pointsContainer: { flexDirection: 'row', gap: 3},
    score: { fontSize: 19, fontWeight: "bold", marginTop: 2 },
    usernameTag: { color: "#DFDADA", fontSize: 12, },

    rank4NbelowContainer: { backgroundColor: "#323653", marginTop: 20, borderRadius: 15, padding: 15},
    rankCard: { flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 10},
    rank4NbelowprofileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10},
    userInfo: { flex: 1},
    rank4Nbelowscore: { fontSize: 15, color: 'white', fontWeight: 'bold'},
    divider: {
        height: 1,  
        backgroundColor: "#FFFFFF30",  
        marginHorizontal: 10,  
        marginBottom: 5,  
    },
});

export default Leaderboard;