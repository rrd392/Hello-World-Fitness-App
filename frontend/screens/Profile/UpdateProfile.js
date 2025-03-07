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
                        <Text style={styles.title}>Profile</Text>
                    </View>
                </TouchableOpacity>

                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Image
                        source={require("../../assets/icon.png")} //put profile image here
                        style={styles.profileImage}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>Madison Smith</Text>
                        <Text style={styles.userSubtitle}>Hello World Fitness</Text>
                        <Text style={styles.userSubtitle}>Member Since Jan 2025</Text>
                        <Text style={styles.membershipBadge}>Standard Monthly</Text>
                    </View>

                </View>
            </SafeAreaView>
        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#212020",

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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },

    profileInfo: {
        marginLeft: 20,
    },

    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },

    userName: { fontSize: 24, fontWeight: "bold", color: "#fff" },
    userSubtitle: { color: "#fff", marginBottom: 5 },
    membershipBadge: {
        backgroundColor: "#FFF",
        color: "#896CFE",
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        fontWeight: "bold",
        textAlign: "center",
    },


});
export default UpdateProfile;