import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from "../../context/AuthContext";
import LogoutModal from './LogoutModal';
import HeaderVer1 from '../HeaderVer1';



const ProfileDashboard = () => {
    const navigation = useNavigation();
    const { logoutContext } = useContext(AuthContext);
    const [showLogoutModel,setShowLogoutModal]=useState(false);


    async function logout() {
        await SecureStore.deleteItemAsync("userToken");
        logoutContext();
        console.log("Logged out, token removed.");
    }


    const menuItems = [
        { title: "Profile", icon: "person", onPress: () => navigation.navigate("UpdateProfile") },
        {
            title: "Membership",
            icon: "star",
            onPress: () => navigation.navigate("MembershipStep1"),
        },
        {
            title: "Transaction History",
            icon: "receipt",
            onPress: () => navigation.navigate("TransactionHistory"),
        },
        {
            title: "Achievement",
            icon: "trophy",
            onPress: () => console.log("Achievement"),
        },
        { title: "Logout", icon: "exit", onPress:()=> setShowLogoutModal(true) },
    ];

    

    return (
        <ScrollView style={styles.container}>
            <SafeAreaView>
                
                <HeaderVer1
                    title="Home"
                    onPress={() => navigation.navigate("MemberDashboard")}
                />
                
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.uidText}>ID: 1</Text>
                    <Image
                        source={require("../../assets/icon.png")} //put profile image here
                        style={styles.profileImage}
                    />
                    <Text style={styles.userName}>Madison Smith</Text>
                    <Text style={styles.userEmail}>madison@example.com</Text>
                    <Text style={styles.userBirthday}>Birthday: April 1st</Text>
                    <Text style={styles.membershipBadge}>Standard Monthly</Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>75 Kg</Text>
                            <Text style={styles.statLabel}>Weight</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>28</Text>
                            <Text style={styles.statLabel}>Years Old</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>1.65 CM</Text>
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
                onCancel={()=>setShowLogoutModal(false)}
                onConfirm={()=>{
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
        paddingTop:15,
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
        top: 285,  // Adjust this value to overlap as desired
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
        width:"90%",
        alignSelf:"center"
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