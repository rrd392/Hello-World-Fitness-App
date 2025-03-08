import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import DateDropdown from "./DateDropdown";

function Classes() {
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

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

        {selectedDate && (
          <Text style={styles.selectedText}>Selected: {selectedDate}</Text>
        )}

        <View style={styles.classesCard}>
          <Text style={styles.cardText}>Classes will be displayed here</Text>
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

  /* Title & Date Picker Styling */
  classesSection: { padding: 20 },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Aligns "Classes" left and DateDropdown right
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 24, color: "white", fontWeight: "bold" },

  /* Classes Card Styling */
  classesCard: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  cardText: { color: "#fff", fontSize: 16 },

  selectedText: { marginTop: 10, fontSize: 16, color: "#E2F163" },
});

export default Classes;
