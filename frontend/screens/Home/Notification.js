import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';

const Notification = () => {
    const navigation = useNavigation();

    const [userId, setUserId] = useState("");
    const [userRole, setUserRole] = useState("");
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        async function fetchUserId() {
            const token = await getUserId();
            setUserId(token.id);
            setUserRole(token.role);
        }
        fetchUserId();
    }, []);

    useEffect(() => {
        if (!userId || !userRole) return;

        const fetchNotificationData = async () => {

            try {
                const response = await fetch(`${API_BASE_URL}/api/notification/display/${userId}/${userRole}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
                }

                const data = await response.json();

                if (data.success) {
                    setNotifications(data.notifications);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                Alert.alert("Error", error.message || "Network request failed");
            } finally {
            }
        };

        fetchNotificationData();
    }, [userId, userRole]);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-outline" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Notification</Text>
                    </View>

                    <View style={{ width: 24 }} />
                </View>

                {Array.isArray(notifications) && notifications.length > 0 ? (
                    <FlatList
                        data={notifications}  
                        keyExtractor={(item) => item.notification_id.toString()} 
                        renderItem={({ item }) => (
                            <View style={styles.notificationItem}>
                                <Text style={styles.notificationTitle}>{item.title}</Text>
                                <Text style={styles.notificationText}>{item.message}</Text>
                            </View>
                        )}
                        contentContainerStyle={styles.listSection}
                    />
                ) : (
                    <FlatList
                        data={[]} 
                        contentContainerStyle={styles.listSection}
                        ListEmptyComponent={
                            <View style={styles.notificationItem}>
                                <Text style={styles.notificationTitle}>No notifications</Text>
                            </View>
                        }
                        
                    />
                )}
            
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: '#212020' },
    header: { padding: 20, marginBottom: -30 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    titleContainer: { flex: 1, alignItems: 'center' },
    title: { color: 'white', fontSize: 24, fontWeight: 'bold' },

    listSection: { marginTop: 40, paddingBottom:80 },
    notificationItem: { padding: 15, backgroundColor: 'rgba(255, 255, 255, 0.3)', marginBottom: 15, paddingVertical: 30, borderRadius: 5 },
    notificationTitle: { fontWeight: 'bold', color: 'white' },
    notificationText: { color: 'white' },

});

export default Notification;

