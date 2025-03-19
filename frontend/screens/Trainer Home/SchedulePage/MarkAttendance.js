import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons"; // For user icon

import HeaderVer4 from "../../HeaderVer4";

const MarkAttendance = () => {
  const navigation = useNavigation();
  const [attendanceNumber, setAttendanceNumber] = useState(513); // Example number
  const attendanceHistory = [
    { date: "10/1/2025", className: "Yoga Flow", attended: "20/20" },
    { date: "10/1/2025", className: "Yoga Flow", attended: "20/20" },
    { date: "10/1/2025", className: "Yoga Flow", attended: "20/20" },
    { date: "10/1/2025", className: "Yoga Flow", attended: "20/20" },
  ];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <SafeAreaView>
        <HeaderVer4 title="Schedule" onPress={() => navigation.goBack()} />
      </SafeAreaView>

      {/* Large Number Display */}
      <View style={styles.numberBox}>
        <Text style={styles.numberText}>{attendanceNumber}</Text>
      </View>

      {/* Attendance History */}
      <Text style={styles.historyTitle}>Attendance History</Text>
      <ScrollView style={styles.historyContainer}>
        {attendanceHistory.map((item, index) => (
          <View key={index} style={styles.historyCard}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.classText}>{item.className}</Text>
            <View style={styles.attendanceInfo}>
              <FontAwesome5 name="user" size={14} color="white" />
              <Text style={styles.attendedText}>{item.attended}</Text>
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
    margin: 5,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  numberText: {
    fontSize: 120,
    fontWeight: "bold",
    color: "black",
    letterSpacing: 15,
  },
  historyTitle: {
    paddingVertical: 10,
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
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
