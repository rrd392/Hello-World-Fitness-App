import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';

const MembershipRenewal = () => {
    const navigation = useNavigation();
    const [selectedMembership, setSelectedMembership] = useState("");
    const [memberships, setMembershipPlan] = useState([]);
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    
    useEffect(() => {
        async function fetchUserId() {
            const token = await getUserId();
            setUserId(token.id);
            setUserName(token.name);
        }
        fetchUserId();
        getMembershipPlan();
    }, []);

    const getMembershipPlan = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/displayMembershipPlan`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
      
            const data = await response.json();
      
            if (data) {
                setMembershipPlan(data.membershipPlan);
            }
        } catch (error) {
            console.error("Error fetching membership plan:", error);
            Alert.alert("Error", error.message || "Network request failed");
        }
    };

    useEffect(() => {
        if (userId) {  
            fetchUserData();
        }
    }, [userId]);
    
    const [userData, setUserData] = useState([]);

    const fetchUserData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/profile/displayUserMembership/${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
    
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
          }
    
          const data = await response.json();
    
          if (data) {
            setUserData(data.userData);
            setSelectedMembership(data.userData.membership_id)
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", error.message || "Network request failed");
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Header */}
            <TouchableOpacity style={styles.headerRow} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={24} color="#E2F163" style={styles.backIcon} />
                <Text style={styles.title}>Profile</Text>
            </TouchableOpacity>
            <ScrollView style={styles.container}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Text style={styles.uidText}>ID: {userId}</Text>
                    <Image source={userData.profile_picture? { uri: `${API_BASE_URL}/uploads/${userData.profile_picture}`}
                        : require("../../assets/icon.png")} style={styles.profileImage} />
                    <Text style={styles.userName}>{userName}</Text>
                    <View style={styles.membershipContainer}>
                        <Text style={styles.membershipBadge}>
                            {memberships.find(plan => plan.membership_id === userData.membership_id)?.plan_name}
                        </Text>
                        <Text style={styles.activeText}>{userData.status}</Text>
                    </View>
                    <Text style={styles.expiryText}>Your Gym Subscription Will Expire on {new Date(userData.end_date).toLocaleDateString('en-GB')}.</Text>
                    <TouchableOpacity style={styles.renewButton}>
                        <Text style={styles.renewText}>Renew</Text>
                    </TouchableOpacity>
                </View>

                {/* Available Memberships */}
                <View style={styles.membershipSection}>
                    <Text style={styles.sectionTitle}>Available Membership</Text>
                    {memberships.map((membership) => (
                        <TouchableOpacity key={membership.membership_id} style={[
                            styles.membershipCard,
                            selectedMembership === membership.membership_id && styles.selectedMembershipCard
                        ]}>
                            <View style={styles.membershipHeader}>
                                <Text style={[
                                    styles.membershipTitle,
                                    membership.plan_name.includes("Premium") && styles.premiumTitle,
                                ]}>{membership.plan_name}</Text>
                                <Text style={styles.price}>RM {membership.price.toFixed(2)}</Text>
                            </View>
                            <Text style={styles.featureText}>{membership.description}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: { flex: 1, backgroundColor: "#212020" },
    container: { flex: 1 },
    headerRow: { flexDirection: "row", padding: 15 },
    backIcon: { marginRight: 10 },
    title: { color: "#E2F163", fontSize: 24, fontWeight: "bold" },
    profileSection: { alignItems: "center", padding: 20, backgroundColor: "#1a1a1a" },
    uidText: { color: "#E2F163", fontWeight: "bold" },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginVertical: 10 },
    userName: { fontSize: 22, color: "#fff", fontWeight: "bold" },
    membershipContainer: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
    membershipBadge: { backgroundColor: "#aaa", color: "#000", padding: 5, borderRadius: 10, fontWeight: "bold" },
    activeText: { color: "#4CAF50", marginLeft: 10 },
    expiryText: { color: "#bbb", marginVertical: 5, textAlign: "center" },
    renewButton: { backgroundColor: "#E2F163", paddingVertical: 10, paddingHorizontal: 40, borderRadius: 10, marginTop: 10 },
    renewText: { fontWeight: "bold" },
    membershipSection: { padding: 20 },
    sectionTitle: { fontSize: 18, color: "#fff", fontWeight: "bold", marginBottom: 15 },
    membershipCard: { backgroundColor: "#333", padding: 15, borderRadius: 10, marginBottom: 15 },
    selectedMembershipCard:{backgroundColor: "#7C57FF", padding: 15, borderRadius: 10, marginBottom: 15},
    membershipHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    membershipTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
    premiumTitle: { color: "#FFD700" },
    price: { fontSize: 18, fontWeight: "bold", color: "#E2F163" },
    featureText: { color: "#bbb", fontSize: 14, marginTop: 5 },
});

export default MembershipRenewal;
