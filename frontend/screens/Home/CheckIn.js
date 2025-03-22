import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import HeaderVer2 from '../HeaderVer2';
import API_BASE_URL from "../../env";
import { getUserId } from "../getUserId";

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

    const [userId, setUserId] = useState("");
    const [classHistory, setClassAttendance] = useState([]); 
    const [gymHistory, setGymAttendance] = useState([]); 

    useEffect(() => {
    async function fetchUserId() {
        const token = await getUserId();
        setUserId(token.id);
    }
    fetchUserId();
    }, []);

    useEffect(() => {
        if(userId){
            updateAttendance(userId);
            fetchAttendanceHistory();
        } 
    }, [userId]);

    const insertAttendance = async (userId) => {
        const code = otp.join("");
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/attendance/insertAttendance`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({userId, code}),
            }
          );
    
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
          }
    
          const data = await response.json();
    
          if (data.success) {
            Alert.alert("Attendance successfully updated!");
            setOtp(["","",""]);
            fetchAttendanceHistory();
          }else{
            Alert.alert(data.message);
            setOtp(["","",""]);
          }
        } catch (error) {
          console.error("Error inserting attendance:", error);
          Alert.alert("Error", error.message || "Network request failed");
        } finally {
        }
    };

    const updateAttendance = async (userId) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/attendance/updateAttendance`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({userId}),
            }
          );
    
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
          }
    
          const data = await response.json();
    
          if (data.success) {
            fetchAttendanceHistory();
          }
        } catch (error) {
          console.error("Error updating attendance:", error);
          Alert.alert("Error", error.message || "Network request failed");
        } finally {
        }
    };

    const fetchAttendanceHistory = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/attendance/displayAttendanceHistory/${userId}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
    
          if (!response.ok) {
            const text = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
          }
    
          const data = await response.json();
    
          if (data) {
            setClassAttendance(data.classResults);
            setGymAttendance(data.gymResults);
          }
        } catch (error) {
          console.error("Error fetching attendance history:", error);
          Alert.alert("Error", error.message || "Network request failed");
        } finally {
        }
    };

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
                <TouchableOpacity style={styles.checkInButton} onPress={() => insertAttendance(userId)}>
                  <Text style={styles.checkInButtonText}>Check In</Text>
                </TouchableOpacity>
            </View>
            
            {/* Attendance History */}
            <View style={styles.attendanceHSection}>
                <Text style={styles.attendanceHTitle}>Class Attendance History</Text>
                <View style={styles.divider} />

                <ScrollView style={{ maxHeight: 180 }}>
                    {classHistory.map((item, index) => (
                        <View   
                            key={index}
                            style={[
                                styles.attendanceCard,
                                { backgroundColor: item.status === 'Present' ? "#5fc95b" : "#bf5252" }
                            ]}
                        >
                            <Text style={styles.attendanceText}>{new Date(item.attendance_time).toLocaleDateString('en-GB')}</Text>
                            <Text style={styles.attendanceText}>{new Date(item.attendance_time).toLocaleTimeString('en-GB')}</Text>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                    ))}
                </ScrollView>

                <Text style={styles.attendanceHTitle2}>Gym Attendance History</Text>
                <View style={styles.divider} />

                <ScrollView style={{ maxHeight: 150 }}>
                    {gymHistory.map((item, index) => (
                        <View   
                            key={index}
                            style={[
                                styles.attendanceCard,
                                { backgroundColor: "#5fc95b"}
                            ]}
                        >
                            <Text style={styles.attendanceText}>{new Date(item.check_in_time).toLocaleDateString('en-GB')}</Text>
                            <Text style={styles.attendanceText}>{new Date(item.check_in_time).toLocaleTimeString('en-GB')}</Text>
                            <Text style={styles.statusText}>Checked In</Text>
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

    attendanceHSection: { padding: 20, marginTop: 10 },
    attendanceHTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 5},
    attendanceHTitle2: { fontSize: 20, color: '#fff', fontWeight: 'bold', marginBottom: 5, marginTop:20},
    divider: { height: 1, backgroundColor: "#666", marginBottom: 10},
    attendanceCard: { backgroundColor: '#4d4d4d', padding: 12, marginVertical: 5, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    attendanceText: { fontSize: 16, color: '#fff', fontWeight: 'bold'},
    statusText: { width: 100, color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign:'right'},
});

export default CheckIn;