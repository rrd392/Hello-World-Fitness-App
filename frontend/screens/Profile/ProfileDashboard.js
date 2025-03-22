import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from "../../context/AuthContext";
import LogoutModal from './LogoutModal';
import HeaderVer1 from '../HeaderVer1';
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';

const ProfileDashboard = () => {
    const navigation = useNavigation();
    const { logoutContext } = useContext(AuthContext);
    const [showLogoutModel, setShowLogoutModal] = useState(false);
    const [userId, setUserId] = useState("");
    const [userData, setUserData] = useState(null);


    async function logout() {
        await SecureStore.deleteItemAsync("userToken");
        logoutContext();
    }

    useEffect(() => {
        async function fetchUserId() {
            const token = await getUserId();
            setUserId(token.id);
        }
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    useFocusEffect(
        useCallback(() => {
            if (userId) {
                fetchUserData();
            }
        }, [userId])
    );

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
            setUserData(data);


        } catch (error) {
            console.error("Error fetching user data:", error);
            Alert.alert("Error", error.message || "Network request failed");
        }
    };


    const menuItems = [
        { title: "Profile", icon: "person", onPress: () => navigation.navigate("UpdateProfile") },
        {
            title: "Membership",
            icon: "star",
            onPress: () => navigation.navigate("MembershipStatus"),
        },
        {
            title: "Transaction History",
            icon: "receipt",
            onPress: () => navigation.navigate("TransactionHistory"),
        },
        {
            title: "Achievement",
            icon: "trophy",
            onPress: () => navigation.navigate("Achievement"),
        },
        { title: "Logout", icon: "exit", onPress: () => setShowLogoutModal(true) },
    ];

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { timeZone: "Asia/Kuala_Lumpur" });
    }

    function calculateAge(dobString) {
        const dob = new Date(dobString);
        const diffMs = Date.now() - dob.getTime();
        const ageDate = new Date(diffMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    // Check if userData is null before accessing properties
    if (!userData) {
        return <Text>Loading user data...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <SafeAreaView>

                <HeaderVer1
                    title="Home"
                    onPress={() => navigation.navigate("Home", { screen: "MemberDashboard" })}
                />

                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.uidText}>ID: {userData.user_id}</Text>
                    <Image
                        source={userData.profile_picture? { uri: `${API_BASE_URL}/uploads/${userData.profile_picture}?t=${Date.now()}`}
                        : require("../../assets/icon.png")} 
                        style={styles.profileImage}
                    />
                    <Text style={styles.userName}>{userData.name}</Text>
                    <Text style={styles.userEmail}>{userData.email}</Text>
                    <Text style={styles.userBirthday}>Birthday: {formatDate(userData.date_of_birth)} </Text>
                    <Text style={styles.membershipBadge}>{userData.plan_name}</Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>{userData.weight} Kg</Text>
                            <Text style={styles.statLabel}>Weight</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>{calculateAge(userData.date_of_birth)}</Text>
                            <Text style={styles.statLabel}>Years Old</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>{userData.height} CM</Text>
                            <Text style={styles.statLabel}>Height</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Section */}
                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.menuItem}
                            onPress={item.onPress}
                        >
                            <View style={styles.menuIconContainer}>
                                <Ionicons name={item.icon} size={24} color="#fff" />
                            </View>
                            <Text style={styles.menuText}>{item.title}</Text>
                            <Ionicons name="caret-forward" size={16} color="#E2F163" />
                        </TouchableOpacity>
                    ))}
                </View>

                <LogoutModal
                    visible={showLogoutModel}
                    onCancel={() => setShowLogoutModal(false)}
                    onConfirm={() => {
                        setShowLogoutModal(false);
                        logout();
                    }}

                ></LogoutModal>
            </SafeAreaView>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#212020",
        position: "relative",

    },

    headerSection: {
        alignItems: "center",
        backgroundColor: "#B3A0FF",
        paddingTop: 15,
        paddingBottom: 50,
    },

    uidText: { color: "#fff", marginBottom: 10, fontWeight: "bold", fontSize: 18 },

    profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    userName: { fontSize: 24, fontWeight: "bold", color: "#fff" },
    userEmail: { color: "#fff", marginBottom: 5 },
    userBirthday: { color: "#fff", marginBottom: 10 },
    membershipBadge: {
        backgroundColor: "#FFF",
        color: "#896CFE",
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        fontWeight: "bold",
    },

    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "90%",
        backgroundColor: "#896CFE",
        borderRadius: 10,
        position: 'absolute',
        top: 285,  
        alignSelf: "center",
        zIndex: 10,
        elevation: 5,
        paddingHorizontal: 10,
    },
    statBox: {
        alignItems: "center",
        padding: 15,
        borderColor: "white",

    },
    divider: {
        width: 1,
        backgroundColor: "#ccc",
        height: "80%",
        marginVertical: "auto",
    },
    statNumber: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    },
    statLabel: {
        color: "#fff",
        fontSize: 14
    },
    menuSection: {
        paddingTop: 40,
        flex: 1,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderBottomColor: "#333",
        borderBottomWidth: 1,
        width: "90%",
        alignSelf: "center"
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#896CFE",
        borderRadius: 50,
    },

    menuText: {
        flex: 1,
        color: "#fff",
        fontSize: 20,
        marginLeft: 15,
    },
});

export default ProfileDashboard;