import React, { useState } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MembershipStep1 = () => {
    const navigation = useNavigation();
    const [selectedMembership, setSelectedMembership] = useState("Standard Monthly");

    const memberships = [
        {
            name: "Standard Monthly",
            price: "RM 30.00",
            features: [
                "Basic Access To Gym Facilities",
                "Group Classes",
                "Locker Rooms",
                "30 Day",
            ],
        },
        {
            name: "Premium Monthly",
            price: "RM 50.00",
            features: [
                "Basic Access To Gym Facilities",
                "Group Classes",
                "Locker Rooms",
                "Dedicated Personal Trainer For Personalized Guidance",
                "12 Months",
            ],
        },
        {
            name: "Standard Yearly",
            price: "RM 300.00",
            features: [
                "Basic Access to Gym Facilities",
                "Access to Group Classes",
                "Locker Room Access",
                "2 Free Guest Passes Per Year",
                "Exclusive Access to Seasonal Events",
                "Valid for 12 Months",
            ],
        },
        {
            name: "Premium Yearly",
            price: "RM 500.00",
            features: [
                "Basic Access to Gym Facilities",
                "Access to Group Classes",
                "Locker Room Access",
                "Dedicated Personal Trainer for Personalized Guidance",
                "Priority Booking for Classes and Events",
                "4 Free Guest Passes Per Year",
                "Exclusive Discounts on Merchandise",
                "Valid for 12 Months",
            ],
        },
    ];

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ScrollView style={styles.container}>
                {/* Header */}
                <TouchableOpacity style={styles.headerRow} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-outline" size={24} color="#E2F163" style={styles.backIcon} />
                    <Text style={styles.title}>Profile</Text>
                </TouchableOpacity>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Text style={styles.uidText}>UID:001</Text>
                    <Image source={require("../../assets/icon.png")} style={styles.profileImage} />
                    <Text style={styles.userName}>Madison Smith</Text>
                    <View style={styles.membershipContainer}>
                        <Text style={styles.membershipBadge}>{selectedMembership}</Text>
                        <Text style={styles.activeText}>Active</Text>
                    </View>
                    <Text style={styles.expiryText}>Your Gym Subscription Will Expire on 02/02/2025.</Text>
                    <TouchableOpacity style={styles.renewButton}>
                        <Text style={styles.renewText}>Renew</Text>
                    </TouchableOpacity>
                </View>

                {/* Available Memberships */}
                <View style={styles.membershipSection}>
                    <Text style={styles.sectionTitle}>Available Membership</Text>
                    {memberships.map((membership, index) => (
                        <TouchableOpacity key={index} style={styles.membershipCard}>
                            <View style={styles.membershipHeader}>
                                <Text style={[
                                    styles.membershipTitle,
                                    membership.name.includes("Premium") && styles.premiumTitle,
                                ]}>{membership.name}</Text>
                                <Text style={styles.price}>{membership.price}</Text>
                            </View>
                            {membership.features.map((feature, i) => (
                                <Text key={i} style={styles.featureText}>• {feature}</Text>
                            ))}
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
    renewButton: { backgroundColor: "#E2F163", paddingVertical: 10, paddingHorizontal: 40, borderRadius: 10, marginVertical: 10 },
    renewText: { fontWeight: "bold" },
    membershipSection: { padding: 20 },
    sectionTitle: { fontSize: 18, color: "#fff", fontWeight: "bold", marginBottom: 10 },
    membershipCard: { backgroundColor: "#333", padding: 15, borderRadius: 10, marginBottom: 15 },
    membershipHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
    membershipTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
    premiumTitle: { color: "#FFD700" },
    price: { fontSize: 18, fontWeight: "bold", color: "#E2F163" },
    featureText: { color: "#bbb", fontSize: 14, marginLeft: 10 },
});

export default MembershipStep1;
