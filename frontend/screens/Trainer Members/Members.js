import { SafeAreaView, View, TouchableOpacity, ScrollView, Text , Image} from 'react-native';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect} from 'react';
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';

const Members = () => {
    const navigation=useNavigation();
    const toggleNotification = () => navigation.navigate('Notification');
    const handleGoToProfile = () => navigation.navigate('TrainerProfileStack');
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [memberDetails, setMemberDetails] = useState([]);

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

    return (
        <View style={styles.container}>
            {/* Header */}
            <SafeAreaView style={styles.header}>
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
            </SafeAreaView>

            {/* Content */}
            <ScrollView>
                <Text style={styles.titleText}>Member Under You</Text>
                <View style={styles.membersSection}>
                    {memberDetails.map((member) => (
                        <View key={member.member_id} style={styles.memberCardSection}>
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
                            <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate("ViewProgress", {member})}>
                                <Text style={styles.buttonText}>View Progress</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#212020', padding:20, paddingBottom:0},
    greeting: { fontSize: 24, color: '#896CFE', fontWeight: 'bold'},
    subtitle: { fontSize: 14, color: '#fff', marginBottom: 30 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 13, backgroundColor: "#212020", gap: 20 },
    iconRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 20, },
    titleText: {color: 'white', fontWeight: 'bold', fontSize: 24, alignSelf: 'center'},
    membersSection: { paddingVertical: 15},
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

export default Members;