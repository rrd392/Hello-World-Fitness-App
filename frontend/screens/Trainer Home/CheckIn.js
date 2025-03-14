import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import HeaderVer2 from '../HeaderVer2';

const CheckIn = () => {

    const navigation = useNavigation();

    // OTP State
    const [otp, setOtp] = useState(["", "", ""]);
    const inputs = useRef([]);

    const handleChange = (text, index) => {
        if (/^\d?$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            if (text && index < inputs.current.length - 1) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyPress = ({ nativeEvent }, index) => {
        if (nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const attendanceHistory = [
        { id: '1', date: '2024-03-06', time: '08:30 AM', status: 'Checked In' },
        { id: '2', date: '2024-03-05', time: '08:35 AM', status: 'Checked In' },
        { id: '3', date: '2024-03-04', time: '08:20 AM', status: 'Absent' },
        { id: '4', date: '2024-03-03', time: '08:20 AM', status: 'Checked In' },
        { id: '5', date: '2024-03-02', time: '08:30 AM', status: 'Absent' },
        { id: '6', date: '2024-03-01', time: '08:10 AM', status: 'Checked In' },
        { id: '7', date: '2024-02-30', time: '08:25 AM', status: 'Checked In' },
        { id: '8', date: '2024-02-29', time: '08:15 AM', status: 'Checked In' },
        { id: '9', date: '2024-02-28', time: '08:20 AM', status: 'Absent' },
        { id: '10', date: '2024-02-27', time: '08:45 AM', status: 'Checked In' },
    ];

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <SafeAreaView>
                <HeaderVer2
                    title="Home" style={styles.header}
                    onPress={() => navigation.navigate("MemberDashboard")}
                />
            </SafeAreaView>

            {/* OTP Section */}
            <View style={styles.otpSection}>
                <Text style={styles.sectionTitle}>Enter OTP</Text>
                <View style={styles.otpCard}>
                    {otp.map((digit, index) => (
                        <TextInput 
                            key={index} 
                            ref={(ref) => (inputs.current[index] = ref)} 
                            style={styles.otpInput}
                            value={digit} 
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="numeric" 
                            maxLength={1} 
                        />
                    ))}
                </View>
                <TouchableOpacity style={styles.checkInButton}>
                  <Text style={styles.checkInButtonText}>Check In</Text>
                </TouchableOpacity>
            </View>
            
            {/* Attendance History */}
            <View style={styles.attendanceHSection}>
                <Text style={styles.attendanceHTitle}>Attendance History</Text>
                <View style={styles.divider} />

                <ScrollView style={{ maxHeight: 400 }}>
                    {attendanceHistory.map((item, index) => (
                        <View   
                            key={index}
                            style={[
                                styles.attendanceCard,
                                { backgroundColor: item.status === 'Checked In' ? "#5fc95b" : "#bf5252" }
                            ]}
                        >
                            <Text style={styles.attendanceText}>{item.date}</Text>
                            <Text style={styles.attendanceText}>{item.time}</Text>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                    ))}
                </ScrollView>
                    
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212020'},
    

    otpSection: { backgroundColor: '#B3A0FF', padding: 15, height: 225},
    sectionTitle: { fontSize: 24, color: 'black', marginBottom: 10, textAlign: 'center' },
    otpCard: { flexDirection: 'row', gap: 10, alignSelf: 'center'},
    otpInput: { width: 50, height: 60, marginTop: 10, alignSelf: 'center', backgroundColor: '#282828', borderRadius: 10, fontSize: 30, color: '#fff', textAlign: 'center'},
    checkInButton: { marginTop: 35, alignSelf: 'center', backgroundColor: '#282828', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 20 },
    checkInButtonText: { color: '#E2F163', fontWeight: 'bold', fontSize: 17 },

    attendanceHSection: { padding: 15, marginTop: 10, },
    attendanceHTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 5},
    divider: { height: 1, backgroundColor: "#666", marginBottom: 10},
    attendanceCard: { backgroundColor: '#4d4d4d', padding: 12, marginVertical: 5, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    attendanceText: { fontSize: 16, color: '#ddd', fontWeight: 'bold'},
    statusText: { width: 100, color: '#fff', fontSize: 14, fontWeight: 'bold'},
});

export default CheckIn;