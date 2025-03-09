import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import DateDropdown from "./DateDropdown";
import ClassCard from "./ClassCard";

function Classes() {
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("none");

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const classData = [
    {
      title: "Yoga Flow",
      time: "08:00 - 09:00",
      coach: "Coach Aaron",
      date: "2025-01-02",
      slots: "20/20",
      image: require("./yoga.jpg"),
    },
    {
      title: "Zumba Dance",
      time: "10:00 - 11:00",
      coach: "Coach Aaron",
      date: "2025-01-02",
      slots: "15/20",
      image: require("./yoga.jpg"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <SafeAreaView>
        <View style={styles.headerRow}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("MemberDashboard")}
          >
            <Ionicons name="caret-back" size={20} color="#E2F163" />
            <Text style={styles.homeText}>Home</Text>
          </TouchableOpacity>
          <View style={styles.iconRow}>
            <TouchableOpacity>
              <Ionicons name="notifications" size={24} color="#896CFE" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleDropdown}>
              <Ionicons name="person" size={24} color="#896CFE" />
            </TouchableOpacity>
            {dropdownVisible && (
              <View style={styles.dropdown}>
                <TouchableOpacity style={styles.menuItem}>
                  <Text>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                  <Text>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Classes Section */}
      <View style={styles.classesSection}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Classes</Text>
          <DateDropdown onSelectDate={setSelectedDate} />
        </View>

        {/* Class Cards */}
        <View style={styles.classCards}>
          {classData.map((classItem, index) => (
            <ClassCard key={index} {...classItem} />
          ))}
        </View>
      </View>
    </View>
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

  classesSection: {},
  titleContainer: {
    marginLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 24, color: "white", fontWeight: "bold" },

  selectedText: { marginTop: 10, fontSize: 16, color: "#E2F163" },
  classCards: { marginBottom: 20, backgroundColor: "#B3A0FF", width: "100%" },
});

export default Classes;
