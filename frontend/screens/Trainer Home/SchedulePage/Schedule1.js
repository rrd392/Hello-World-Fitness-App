import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import HeaderVer4 from "../../HeaderVer4";
import UpcomingClassCards from "./UpcomingClassCards";
import PastClassCards from "./PastClassCards";

function Schedule1() {
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const getMondayDates = () => {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    const monday = new Date(currentDate);
    monday.setDate(
      currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
    );

    return Array.from({ length: 3 }, (_, i) => {
      const newMonday = new Date(monday);
      newMonday.setDate(monday.getDate() + i * 7);
      return newMonday.toLocaleDateString("en-GB");
    });
  };
  const [dateDropdownVisible, setDateDropdownVisible] = useState(false);
  const [classStatusDropdown, setClassStatusDropdown] = useState(false);
  const [selectedClassStatus, setSelectedClassStatus] = useState("Upcoming");
  const mondayDates = getMondayDates();
  const [selectedDate, setSelectedDate] = useState(mondayDates[0]);
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI"];
  const [selectedDay, setSelectedDay] = useState(0);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDateDropdownVisible(false);
  };

  const handleClassStatusSelect = (status) => {
    setSelectedClassStatus(status);
    setClassStatusDropdown(false);
  };
  const upcomingClassData = [
    {
      title: "Yoga Flow",
      time: "08:00 - 09:00",
      coach: "Coach Aaron",
      date: "2025-01-02",
      slots: "20/20",
      image: require("./yoga.jpg"),
    },
    {
      title: "Yoga Flow",
      time: "08:00 - 09:00",
      coach: "Coach Aaron",
      date: "2025-01-02",
      slots: "20/20",
      image: require("./yoga.jpg"),
    },
    {
      title: "Yoga Flow",
      time: "08:00 - 09:00",
      coach: "Coach Aaron",
      date: "2025-01-02",
      slots: "20/20",
      image: require("./yoga.jpg"),
    },
  ];
  const pastClassData = [
    {
      title: "Zumba Dance",
      time: "10:00 - 11:00",
      coach: "Coach Aaron",
      date: "2025-01-02",
      slots: "15/20",
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
        <HeaderVer4 title="Home" onPress={() => navigation.goBack()} />
      </SafeAreaView>

      {/* Classes Section */}

      <View style={styles.classesSection}>
        <Text style={styles.sectionTitle}>Classes</Text>
        <View style={styles.titleContainer}>
          <TouchableOpacity
            style={[styles.dropdownButton, {borderColor:"#E2F163"}]}
            onPress={() => setClassStatusDropdown(!classStatusDropdown)}
          >
            <Text style={[styles.buttonText, {color:"#E2F163"}]}>{selectedClassStatus}</Text>
            <Ionicons name="chevron-down" size={20} color="#E2F163" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dropdownButton, 
              selectedClassStatus === "Past" ? { borderColor: "#A5A5A5" } : { borderColor: "#E2F163" }
            ]}
            onPress={() => setDateDropdownVisible(!dateDropdownVisible)}
            disabled = {selectedClassStatus == "Past"}
          >
            <Text style={[
              styles.buttonText, 
              selectedClassStatus === "Past" ? { color: "#A5A5A5" } : { color: "#E2F163" }
            ]}>
              {selectedDate}
            </Text>
            <Ionicons 
              name="chevron-down" 
              size={20} 
              color={selectedClassStatus === "Past" ? "#A5A5A5" : "#E2F163"} 
            />
          </TouchableOpacity>
        </View>
        {classStatusDropdown && (
          <View style={styles.dropdown2}>
            {["Upcoming", "Past"].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.dropdownItem}
                onPress={() => handleClassStatusSelect(option)}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {dateDropdownVisible && (
          <View style={styles.dropdown}>
            {mondayDates.map((date) => (
              <TouchableOpacity
                key={date}
                style={styles.dropdownItem}
                onPress={() => handleDateSelect(date)}
              >
                <Text style={styles.dropdownText}>{date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.daySelectionSection}>
          {daysOfWeek.map((day, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedDay(index)}>
              <Text
                style={
                  selectedDay === index
                    ? styles.selectedDate
                    : styles.daySelection
                }
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* Class Cards*/}
      <ScrollView style={styles.classCards}>
        {selectedClassStatus === "Upcoming"
          ? upcomingClassData.map((classItem, index) => (
              <UpcomingClassCards key={index} {...classItem} />
            ))
          : pastClassData.map((classItem, index) => (
              <PastClassCards key={index} {...classItem} />
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#212020" },
  titleContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom:10
  },

  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    width: 150,
    backgroundColor: "black",
    marginTop: 10,
  },

  buttonText: { fontSize: 16, fontWeight: "bold" },
  dropdown: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 5,
    width: 150,
    padding: 5,
    top: 100,
    right: 20,
    zIndex: 10,
    marginLeft: "auto",
    borderWidth: 1,
    borderColor: "#E2F163",
  },
  dropdown2: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 5,
    width: 150,
    padding: 5,
    top: 100,
    left: 20,
    zIndex: 10,
    marginLeft: "auto",
    borderWidth: 1,
    borderColor: "#E2F163",
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "black",
  },

  daySelectionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#B3A0FF",
  },
  daySelection: {
    color: "#E2F163",
    fontSize: 14,
    backgroundColor: "black",
    paddingVertical: 5,
    borderRadius: 5,
    width: 70,
    textAlign: "center",
  },
  selectedDate: {
    color: "black",
    fontSize: 14,
    backgroundColor: "#E2F163",
    paddingVertical: 5,
    borderRadius: 5,
    width: 70,
    textAlign: "center",
  },

  classesSection: { marginBottom: 20, marginTop:-20 },

  selectedText: { marginTop: 10, fontSize: 16, color: "#E2F163" },
  classCards: { marginBottom: 10, backgroundColor: "#B3A0FF", width: "100%" },
});

export default Schedule1;
