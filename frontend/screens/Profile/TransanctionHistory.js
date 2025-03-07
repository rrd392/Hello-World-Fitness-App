import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const TransactionHistory = () => {

    const navigation = useNavigation();

    const getMembershipContainerStyle = (plan) => {
        switch (plan) {
            case 'Standard Monthly':
                return { backgroundColor: '#aaa', color: "#000" , borderRadius: 10};
            case 'Premium Monthly':
                return { backgroundColor: '#FFA500', color: "#000" , borderRadius: 10 };
            case 'Standard Yearly':
                return { backgroundColor: '#aaa', color: "#000" , borderRadius: 10 };
            case 'Premium Yearly':
                return { backgroundColor: '#FFA500', color: "#000" , borderRadius: 10 };
        }
    };

    const transactionHistory = [
        { id: '1', plan: 'Standard Monthly', date: '2024-03-06', amount: '30.00' },
        { id: '2', plan: 'Premium Monthly', date: '2024-03-06', amount: '50.00' },
        { id: '3', plan: 'Standard Yearly', date: '2024-03-06', amount: '300.00' },
        { id: '4', plan: 'Premium Yearly', date: '2024-03-06', amount: '500.00' },
        { id: '5', plan: 'Standard Monthly', date: '2024-03-06', amount: '30.00' },
        { id: '6', plan: 'Standard Yearly', date: '2024-03-06', amount: '50.00' },
        { id: '7', plan: 'Premium Yearly', date: '2024-03-06', amount: '300.00' },
        { id: '8', plan: 'Premium Monthly', date: '2024-03-06', amount: '50.00' },
        { id: '9', plan: 'Standard Monthly', date: '2024-03-06', amount: '500.00' },
        { id: '10', plan: 'Standard Monthly', date: '2024-03-06', amount: '30.00' },
    ];

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <SafeAreaView style={styles.header}>
                <View style={styles.headerRow}>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.ProfileButton} onPress={() => navigation.navigate('ProfileDashboard')}>
                        <Ionicons name="caret-back" size={20} color="#E2F163"/>
                        <Text style={styles.ProfileText}>Profile</Text>
                    </TouchableOpacity>                    
                </View>
            </SafeAreaView>

            {/* Info Section */}
            <View style={styles.transactionSection}>
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Transaction Info</Text>
                    <View style={styles.infoName}>
                        <Ionicons name="person" size={20} color="black" />
                        <Text style={styles.infoText}>Madison</Text>
                    </View>
                    <View style={styles.infoPhone}>
                        <Ionicons name="call-outline" size={20} color="black"/>
                        <Text style={styles.infoText}>+0123456789</Text>
                    </View>
                    <View style={styles.infoMethod}>
                        <Ionicons name="card-outline" size={20} color="black"/>
                        <Text style={styles.infoText}>E-Wallet</Text>
                    </View>
                </View>
            </View>
            
            {/* Transaction History */}
            <View style={styles.transactionHSection}>
                <Text style={styles.transactionHTitle}>Transaction History</Text>
                <View style={styles.thead}>
                    <Text style={styles.planHText}>Plan</Text>
                    <Text style={styles.dateHText}>Date</Text>
                    <Text style={styles.amountHText}>Amount</Text>
                </View>

                <ScrollView style={{ maxHeight: 400 }}>
                    {transactionHistory.map((item) => (
                        <View style={styles.transactionCard}>
                            <View style={[styles.membershipContainer, getMembershipContainerStyle(item.plan)]}>
                                <Text style={styles.membershipBadge}>{item.plan}</Text>
                            </View>
                            <Text style={styles.dateText}>{item.date}</Text>
                            <Text style={styles.amountText}>{item.amount}</Text>
                        </View>
                    ))}
                </ScrollView>
                    
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000'},
    header: { padding: 20, marginBottom:-30},
    ProfileButton: { flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: -10},
    ProfileText: { fontSize: 24, color: 'white', fontWeight: 'bold' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between'},
    iconRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 20 },

    transactionSection: { backgroundColor: '#B3A0FF', padding: 15, marginTop: 30, height: 170, borderRadius: 20, margin: 25},
    sectionTitle: { fontSize: 24, color: 'white', marginBottom: 5, textAlign: 'center', fontWeight: 'bold' },
    infoCard: { gap: 10, alignSelf: 'center'},
    infoName: { flexDirection: 'row', gap: 8},
    infoPhone: { flexDirection: 'row', gap: 8 },
    infoMethod: { flexDirection: 'row', gap: 8 },
    infoText: { fontSize: 16, fontWeight: 'bold'},

    transactionHSection: { padding: 15, marginTop: -20 },
    transactionHTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 5},
    thead: { backgroundColor: '#B3A0FF', padding: 12, marginVertical: 4, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 40, marginBottom: 10,},
    planHText: { borderRadius: 10, fontWeight: "bold", fontSize: 14},
    dateHText: { fontSize: 14, fontWeight: 'bold'},
    amountHText: { width: 100, fontSize: 14, fontWeight: 'bold' },
    transactionCard: { backgroundColor: '#4d4d4d', padding: 12, marginVertical: 5, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    membershipContainer: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
    membershipBadge: { minWidth: 100, padding: 5, fontWeight: "bold", fontSize: 11 },
    dateText: { width: 100, color: '#ddd', fontSize: 14, fontWeight: 'bold'},
    amountText: { width: 100, color: '#fff', fontSize: 12, fontWeight: 'bold'},
});

export default TransactionHistory;