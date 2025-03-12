import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import DateDropdown from "./DateDropdown";
import ClassCard from "./ClassCard";
import HeaderVer2 from "../../HeaderVer2";

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
        <HeaderVer2 title="Home"
          onPress={() => navigation.goBack()} />
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
  container: { flex: 1, backgroundColor: "#212020" },

  classesSection: {
    marginTop: 20,
  },
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
