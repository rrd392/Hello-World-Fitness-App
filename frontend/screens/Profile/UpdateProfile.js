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

const UpdateProfile = () => {

    const navigation = useNavigation();


    return (
        <ScrollView style={styles.container}>
            <SafeAreaView>
                <TouchableOpacity style={styles.headerRow} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back-outline" size={24} color="#E2F163" style={styles.backIcon} />
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Home</Text>
                    </View>
                </TouchableOpacity>

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

                </View>



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

    headerRow: {
        flexDirection: 'row',
        padding: 10,

    },
    backIcon: {
        marginTop: 4,

    },
    title: {
        color: "#896CFE",
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
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


});
export default UpdateProfile;