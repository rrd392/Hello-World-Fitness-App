import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

import { KeyboardAvoidingView, Platform } from "react-native";
import HeaderVer2 from "../../HeaderVer2";

function SelectedClass() {
  const navigation = useNavigation();
  const route = useRoute();
  const { className } = route.params || {};

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  // Class Data
  const classData = [
    {
      title: "Yoga Flow",
      description:
        "A Relaxing Yoga Session Focused on Flexibility and Mindfulness.",
      time: "08:00 - 09:00",
      coach: "Coach Aaron",
      coachEmail: "aaron122@gmail.com",
      coachNumber: "+0123456789",
      date: "2025-01-02",
      slots: "20/20",
      image: require("./yoga.jpg"),
    },
    {
      title: "Zumba Dance",
      description: "A Fun Dance Workout to Get Your Heart Pumping.",
      time: "10:00 - 11:00",
      coach: "Coach Aaron",
      coachEmail: "aaron122@gmail.com",
      coachNumber: "+0123456789",
      date: "2025-01-02",
      slots: "15/20",
      image: require("./yoga.jpg"),
    },
  ];

  const selectedClass = classData.find((cls) => cls.title === className);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Header Section */}
      <HeaderVer2 title="Schedule" onPress={() => navigation.goBack()} />

      {/* Wrap ScrollView with KeyboardAvoidingView */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
          <View style={styles.container}>
            {/* Page Content */}
            <View style={styles.pageContent}>
              {selectedClass ? (
                <>
                  <Image
                    source={selectedClass.image}
                    style={styles.classImage}
                  />
                  <View style={styles.classCard}>
                    <View style={styles.headerRow}>
                      <Text style={styles.classTitle}>
                        {selectedClass.title}
                      </Text>
                      <View style={styles.iconRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={20}
                          color="white"
                        />
                        <Text style={styles.classDate}>
                          {selectedClass.date}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.classInfo}>
                      <View style={{ flex: 1, maxWidth: "65%", gap: 5 }}>
                        <Text style={styles.classDescription}>
                          {selectedClass.description}
                        </Text>
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color="white"
                          />
                          <Text style={styles.classTime}>
                            {selectedClass.time}
                          </Text>
                        </View>
                        <View style={styles.infoRow}>
                          <Ionicons
                            name="person-outline"
                            size={18}
                            color="white"
                          />
                          <Text style={styles.classSlots}>
                            {selectedClass.slots}
                          </Text>
                        </View>
                      </View>

                      {/* Right side - Coach Info */}
                      <View style={styles.coachCard}>
                        <View style={styles.coachProfile}>
                          <Image
                            source={require("./coach.jpg")}
                            style={styles.coachImage}
                          />
                          <View>
                            <Text style={styles.coachName}>
                              {selectedClass.coach}
                            </Text>
                            <Text style={styles.coachEmail}>
                              {selectedClass.coachEmail}
                            </Text>
                            <Text style={styles.coachNumber}>
                              {selectedClass.coachNumber}
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
            <Text
              style={{
                color: "white",
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center",
                paddingTop: 30,
                paddingBottom: 10,
              }}
            >
              Attending Members
            </Text>
            <View style={styles.card}>
              <View style={styles.cardContainer}>
                <Text style={styles.listNum}>1</Text>
                <Image
                  source={require("./coach.jpg")}
                  style={styles.userImage}
                />
                <View>
                  <Text style={styles.userName}>john</Text>
                  <Text style={styles.email}>john@email.com</Text>
                </View>
                <Text style={styles.Present}>Present</Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.cardContainer}>
                <Text style={styles.listNum}>2</Text>
                <Image
                  source={require("./coach.jpg")}
                  style={styles.userImage}
                />
                <View>
                  <Text style={styles.userName}>john2</Text>
                  <Text style={styles.email}>john2@email.com</Text>
                </View>
                <Text style={styles.Absent}>Absent</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  homeButton: { flexDirection: "row", alignItems: "center", gap: 3 },
  homeText: { fontSize: 24, color: "#896CFE", fontWeight: "bold" },

  iconRow: { flexDirection: "row", gap: 20 },
  dropdown: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    padding: 10,
    width: 100,
    zIndex: 10,
  },
  menuItem: { padding: 10 },

  pageContent: {
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "#B3A0FF",
    paddingVertical: 20,
  },
  classInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Ensures items don't stretch
    gap: 10, // Adds spacing between description and coach card
    padding: 5,
  },

  classImage: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: 10,
    padding: 10,
  },
  classCard: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 15,
    width: "95%",
  },
  classTitle: { fontSize: 34, color: "#E2F163", fontWeight: "bold" },
  classDescription: { fontSize: 16, color: "white", marginTop: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 },
  classTime: { fontSize: 16, color: "white" },
  classSlots: { fontSize: 16, color: "red", fontWeight: "bold" },
  classDate: { fontSize: 16, color: "white" },
  coachCard: {
    backgroundColor: "#C4E538",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
  },
  coachProfile: { flexDirection: "row", alignItems: "center", gap: 10 },
  coachImage: { width: 40, height: 40, borderRadius: 20 },
  coachName: { fontSize: 16, fontWeight: "bold" },
  coachEmail: { fontSize: 10, color: "#444" },
  coachNumber: { fontSize: 10, color: "#444" },

  signUpButton: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 20,
    marginBottom: 20,
  },
  signUpText: { fontSize: 18, color: "#E2F163", fontWeight: "bold" },

  errorText: { fontSize: 18, color: "red", textAlign: "center", marginTop: 20 },
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
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  listNum: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
    marginRight: 20,
  },
  Present: {
    fontSize: 25,
    fontWeight: "500",
    color: "#5ce681",
    marginLeft: "auto",
    marginRight: 10,
  },
  Absent: {
    fontSize: 25,
    fontWeight: "500",
    color: "#ed5858",
    marginLeft: "auto",
    marginRight: 10,
  },
  email: {
    fontSize: 16,
    color: "#CCCCCC",
  },
});

export default SelectedClass;
