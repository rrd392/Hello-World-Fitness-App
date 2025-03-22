import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';

const TransactionHistory = () => {

    const navigation = useNavigation();
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [contact, setContact] = useState("");
    
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
            getTransactions();
        }
    }, [userId]);

    const getTransactions = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/displayTransactions/${userId}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
      
            const data = await response.json();
      
            if (data) {
                setTransactions(data.transactions);
                setContact(data.contact);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            Alert.alert("Error", error.message || "Network request failed");
        }
    };

    const getMembershipContainerStyle = (plan) => {
        const beforeDash = plan.split(" - ")[0];
        switch (beforeDash) {
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
                        <Text style={styles.infoText}>{userName}</Text>
                    </View>
                    <View style={styles.infoPhone}>
                        <Ionicons name="call-outline" size={20} color="black"/>
                        <Text style={styles.infoText}>+{contact}</Text>
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
                    <Text style={styles.planHText}>Item</Text>
                    <Text style={styles.dateHText}>Date</Text>
                    <Text style={styles.amountHText}>Amount</Text>
                </View>

                <ScrollView style={{ maxHeight: 400 }}>
                    {transactions.length > 0? (
                        transactions.map((item) => (
                            <View key={item.transaction_id} style={styles.transactionCard}>
                                <View style={[styles.membershipContainer, getMembershipContainerStyle(item.description)]}>
                                    <Text style={styles.membershipBadge}>{item.description.split('-')[0]}</Text>
                                </View>
                                <Text style={styles.dateText}>{new Date(item.payment_date).toLocaleDateString('en-GB')}</Text>
                                <Text style={styles.amountText}>{item.amount}</Text>
                            </View>
                        ))
                    ):(
                        <View style={styles.transactionCard}>
                            <Text style={{color:'white', textAlign:'center', fontWeight:600, fontSize:16, marginVertical:10, width:"100%"}}>
                                No transaction record available.
                            </Text>
                        </View>
                    )}
                    
                </ScrollView>
                    
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000'},
    header: { padding: 20, marginBottom:-30},
    ProfileButton: { flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: -10},
    ProfileText: { fontSize: 24, color: '#896CFE', fontWeight: 'bold' },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between'},

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