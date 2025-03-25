import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform } from "react-native";
import HeaderVer4 from "../../HeaderVer4";
import API_BASE_URL from "../../../env";

function ClassPastAttendance() {
  const navigation = useNavigation();
  const route = useRoute();
  const { classData } = route.params || {};
  const [classParticipants, setClassParticipants] = useState([]);

  useEffect(() => {
    if (classData.class_id) {
      fetchClassParticipants();
    }
  }, [classData]);

  const fetchClassParticipants = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/trainer-class/displayPastParticipants/${classData.class_id}`,
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
        setClassParticipants(data.results)

      }
    } catch (error) {
      console.error("Error fetching class participants data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#212020" }}>
      {/* Header Section */}
      <HeaderVer4 title="Back" onPress={() => navigation.goBack()} />

      {/* Wrap ScrollView with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Page Content */}
            <View style={styles.pageContent}>
              {classData ? (
                <>
                  <Image source={{ uri: `${API_BASE_URL}/uploads/${classData.class_image}` }} style={styles.classImage} />
                  <View style={styles.classCard}>
                    <View style={styles.headerRow}>
                      <View style={styles.headerClassRow}>
                        <Text style={styles.classTitle}>
                          {classData.class_name}
                        </Text>
                      </View>
                      <View style={styles.iconRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="white"
                        />
                        <Text style={styles.classDate}>
                          {new Date(classData.schedule_date).toLocaleDateString('en-GB')}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.classDescription}>
                      {classData.description}
                    </Text>
                    <View style={styles.classInfo}>
                      <View style={{ flex: 1, maxWidth: "65%", gap: 5 }}>
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color="white"
                          />
                          <Text style={styles.classTime}>
                            {classData.start_time.slice(0, -3)} - {classData.end_time.slice(0, -3)}
                          </Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="person-outline"
                            size={18}
                            color="white"
                          />
                          <Text style={classData.participants == classData.max_participants ? styles.classSlots : styles.nonFullSlots}>
                            {classData.participants}/{classData.max_participants}
                          </Text>
                        </View>
                      </View>

                      {/* Right side - Coach Info */}
                      <View style={styles.coachCard}>
                        <View style={styles.coachProfile}>
                          <Image source={{ uri: `${API_BASE_URL}/uploads/${classData.profile_picture}` }} style={styles.coachImage} />
                          <View>
                            <Text style={styles.coachName} numberOfLines={1} ellipsizeMode="tail">
                              {classData.name}
                            </Text>
                            <Text style={styles.coachEmail} numberOfLines={1} ellipsizeMode="tail">
                              {classData.email}
                            </Text>
                            <Text style={styles.coachNumber} numberOfLines={1} ellipsizeMode="tail">
                              {classData.contact_number}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
              ) : (
                <Text style={styles.errorText}>Class not found</Text>
              )}
            </View>

            {/* Attending Members */}
            <View style={styles.attendance}>
              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Attending Members
              </Text>
              {classParticipants.map((member, index) =>
                <View key={member.user_id} style={styles.card}>
                  <View style={styles.cardContainer}>
                    <Text style={styles.listNum}>{index + 1}</Text>
                    <Image source={{ uri: `${API_BASE_URL}/uploads/${member.profile_picture}?t=${Date.now()}` }} style={styles.userImage} />
                    <View style={{ maxWidth: "45%" }}>
                      <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{member.name}</Text>
                      <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">{member.email}</Text>
                    </View>
                    <Text style={member.status == "Present" ? styles.Present : styles.Absent}>{member.status == "Present" ? member.status : `Absent`}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#212020" },

  headerRow: {
    flexDirection: "row",
    alignItems:"center",
    gap:8,
    marginTop: 10,
    marginBottom: 20
  },

  iconRow: { flexDirection: "row", gap: 5 },
  pageContent: {
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "#B3A0FF",
    padding: 20,
  },
  classInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: 5,
  },

  classImage: {
    width: "100%",
    height: 180,
    borderRadius: 20,
    marginBottom: 20,
  },
  classCard: {
    backgroundColor: "#212020",
    padding: 20,
    borderRadius: 15,
    width: "100%",
  },
  classTitle: { fontSize: 26, color: "#E2F163", fontWeight: "bold" },
  classDescription: { fontSize: 14, color: "white", marginBottom: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 },
  classTime: { fontSize: 16, color: "white" },
  classSlots: { fontSize: 16, color: "red", fontWeight: "bold" },
  nonFullSlots: { fontSize: 16, color: "#E2F163", fontWeight: "bold" },
  classDate: { fontSize: 16, color: "white" },
  coachCard: {
    backgroundColor: "#E2F163",
    borderRadius: 10,
    padding: 10,
    marginTop: 'auto',
    width: "60%"
  },
  coachProfile: { flexDirection: "row", alignItems: "center", gap: 10 },
  coachImage: { width: 40, height: 40, borderRadius: 20 },
  coachName: { fontSize: 18, fontWeight: 500, maxWidth: "100%" },
  coachEmail: { fontSize: 12, color: "#444" },
  coachNumber: { fontSize: 12, color: "#444" },

  errorText: { fontSize: 18, color: "red", textAlign: "center", marginTop: 20 },
  attendance: {
    padding: 20
  },
  card: {
    backgroundColor: "#4A4A4A",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  listNum: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
    marginRight: 20,
  },
  Present: {
    fontSize: 18,
    fontWeight: "500",
    color: "#5ce681",
    marginLeft: "auto",
    marginRight: 10,
  },
  Absent: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ed5858",
    marginLeft: "auto",
    marginRight: 10,
  },
  email: {
    fontSize: 14,
    color: "#CCCCCC",
  },
});

export default ClassPastAttendance;
