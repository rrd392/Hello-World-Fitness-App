import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons"; 
import HeaderVer4 from "../../HeaderVer4";
import API_BASE_URL from "../../../env";
import { getUserId } from "../../getUserId";

const MarkAttendance = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { classData } = route.params || {};
  const [attendanceNumber, setAttendanceNumber] = useState(""); 
  const [userId, setUserId] = useState("");
  const [attendanceHistory, setAttendanceHistory] = useState([]); 

  useEffect(() => {
    async function fetchUserId() {
        const token = await getUserId();
        setUserId(token.id);
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    if(classData.class_id){
      fetchAttendanceCode();
    }
  }, [classData]);

  useEffect(() => {
    if(userId){
      fetchAttendanceHistory();
    }
  }, [userId]);

  const fetchAttendanceCode = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/trainer-class/displayAttendanceCode/${classData.class_id}`,
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
        setAttendanceNumber(data.results)
      }
    } catch (error) {
      console.error("Error fetching attendance code:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
    }
  };

  const generateCode = async (class_id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/trainer-class/generateAttendanceCode`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({class_id}),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
      }

      const data = await response.json();

      if (data.success) {
        fetchAttendanceCode();
      }
    } catch (error) {
      console.error("Error generating attendance code:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
    }
  };

  const fetchAttendanceHistory = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/trainer-class/displayAttendanceHistory/${userId}`,
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
        setAttendanceHistory(data.results);
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
        <HeaderVer4 title="Schedule" onPress={() => navigation.goBack()} />
      </SafeAreaView>

      {/* Large Number Display */}
      <View style={styles.numberBox}>
        {attendanceNumber === "" ? (
          <TouchableOpacity style={styles.generateBtn} onPress={() => generateCode(classData.class_id)}>
            <Text style={styles.generateTxt}>Generate OTP</Text>
          </TouchableOpacity>
        ):(
          <Text style={styles.numberText}>{attendanceNumber}</Text>
        )}
      </View>

      {/* Attendance History */}
      <Text style={styles.historyTitle}>Attendance History</Text>
      <ScrollView style={styles.historyContainer}>
        {attendanceHistory.map((item, index) => (
          <View key={index} style={styles.historyCard}>
            <Text style={styles.dateText}>{new Date(item.schedule_date).toLocaleDateString('en-GB')}</Text>
            <Text style={styles.classText}>{item.class_name}</Text>
            <View style={styles.attendanceInfo}>
              <FontAwesome5 name="user" size={14} color="white" />
              <Text style={styles.attendedText}>{item.attendance}/{item.participants}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  numberBox: {
    backgroundColor: "#9e8df5",
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  generateBtn:{
    backgroundColor:"#000",
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:20
  },
  generateTxt:{
    fontWeight:"bold",
    color:"#fff",
    fontSize:16
  },
  numberText: {
    fontSize: 120,
    fontWeight: "bold",
    color: "black",
    letterSpacing: 15,
  },
  historyTitle: {
    paddingVertical: 10,
    paddingHorizontal:20,
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  historyContainer: {
    marginHorizontal: 10,
    borderTopWidth: 2,
    borderTopColor: "white",
    paddingTop: 10,
  },
  historyCard: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  dateText: { color: "white", fontSize: 14 },
  classText: { color: "#ddd", fontSize: 16, fontWeight: "bold" },
  attendanceInfo: { flexDirection: "row", alignItems: "center" },
  attendedText: { color: "green", marginLeft: 5, fontSize: 14 },
});

export default MarkAttendance;
