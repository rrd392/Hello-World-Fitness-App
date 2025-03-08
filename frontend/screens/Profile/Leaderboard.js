import { ScrollView, StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView } from "react-native";
import HeaderVer1 from "../HeaderVer1"
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

const Leaderboard = () => {
    const navigation = useNavigation();
    
    const users = [
        { id: 2, name: "Eiden", score: 2349, rank: 2, color: "#6C6EC6", badgeColor: "#5CE1E6", height: 140 },
        { id: 1, name: "Eiden", score: 2430, rank: 1, color: "#4A7BFF", badgeColor: "#9FFFA4", height: 160 },
        { id: 3, name: "Eiden", score: 2268, rank: 3, color: "#6C6EC6", badgeColor: "#FFD700", height: 120 },
        { id: 4, name: "Sebastian", score: 2187, rank: 4 },
        { id: 5, name: "Sebastian", score: 1879, rank: 5 },
        { id: 6, name: "Sebastian", score: 1526, rank: 6 },
        { id: 7, name: "Sebastian", score: 918, rank: 7 },
        { id: 8, name: "Sebastian", score: 832, rank: 8 },
        { id: 9, name: "Sebastian", score: 725, rank: 9 },
        { id: 10, name: "Sebastian", score: 600, rank: 10 },
    ];

    const top3 = users.filter(user => user.rank <= 3);
    const rank4Nbelow = users.filter(user => user.rank >= 4);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <HeaderVer1
                    title="Achievement"
                    onPress={() => navigation.navigate("Achievement")}
                />

                <Text style={styles.title}>Leaderboard</Text>

                <View style={styles.podium}>
                    {top3.map((user) => (
                        <View
                            key={user.id} style={[ styles.podiumBlock, {backgroundColor: user.color, height: user.height }]}
                        >
                            <View style={styles.profileContainer}>
                                <Image source={require("../../assets/icon.png")} style={styles.profileImage(user.rank)} />
                                <View style={[styles.rankBadge, { backgroundColor: user.badgeColor }]}>
                                    <Text style={styles.rankText}>{user.rank}</Text>
                                </View>
                            </View>
                            <View style={[styles.textContainer, { marginTop: user.height * 0.2}]}>
                                <Text style={styles.username}>{user.name}</Text>
                                <View style={styles.pointsContainer}>
                                    <Ionicons name="flame" size={24} color="#F24814" />
                                    <Text style={[styles.score, { color: user.badgeColor }]}>{user.score}</Text>
                                </View>
                                <Text style={styles.usernameTag}>@username</Text>
                            </View> 
                        </View>
                    ))}
                </View>

                <View style={styles.rank4NbelowContainer}>
                    <ScrollView style={{ maxHeight: 400 }}>
                        {rank4Nbelow.map((user, index) => (
                            <View key={user.id}>
                                <View style={styles.rankCard}>
                                    <Image source={require("../../assets/icon.png")} style={styles.rank4NbelowprofileImage} />
                                    <View style={styles.userInfo}>
                                        <Text style={styles.username}>{user.name}</Text>
                                        <Text style={styles.usernameTag}>@username</Text>
                                    </View>
                                    <View style={styles.pointsContainer}>
                                        <Ionicons name="flame" size={18} color="#F24814" />
                                        <Text style={styles.rank4Nbelowscore}>{user.score}</Text>
                                    </View>
                                </View>
                                {index !== rank4Nbelow.length - 1 && <View style={styles.divider} />}
                            </View>
                        ))}
                        
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
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
    avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, },
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

    username: { color: "white", fontSize: 16, fontWeight: "bold",marginBottom: 2 },
    pointsContainer: { flexDirection: 'row', gap: 3},
    score: { fontSize: 19, fontWeight: "bold", marginTop: 2 },
    usernameTag: { color: "#DFDADA", fontSize: 12, },

    rank4NbelowContainer: { backgroundColor: "#323653", marginTop: 20, borderRadius: 15, padding: 15},
    rankCard: { flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 10},
    rank4NbelowprofileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10},
    userInfo: { flex: 1},
    rank4Nbelowscore: { fontSize: 15, color: 'white', fontWeight: 'bold'},
    divider: {
        height: 1,  // Thickness of the line
        backgroundColor: "#FFFFFF30",  // White with transparency
        marginHorizontal: 10,  // Space from left & right edges
        marginBottom: 5,  // Space between items
    },
});

export default Leaderboard;