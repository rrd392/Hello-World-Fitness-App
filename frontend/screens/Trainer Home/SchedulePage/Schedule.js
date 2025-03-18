import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import UpcomingClassCard from "./UpcomingClassCards";
import HeaderVer2 from "../../HeaderVer2";
import API_BASE_URL from "../../../env";

const getMondayDates = () => {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  return Array.from({ length: 3 }, (_, i) => {
    const newMonday = new Date(monday);
    newMonday.setDate(monday.getDate() + i * 7);
    return newMonday.toLocaleDateString("en-GB");
  });
};

function Classes() {
  const navigation = useNavigation();
  const [dateDropdownVisible, setDateDropdownVisible] = useState(false);
  const [classStatusDropdown, setClassStatusDropdown] = useState(false);
  const [selectedClassStatus, setSelectedClassStatus] = useState("Upcoming");
  const mondayDates = getMondayDates();
  const [selectedDate, setSelectedDate] = useState(mondayDates[0]);
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI"];
  const [selectedDay, setSelectedDay] = useState(0);
  const [classData, setClassData] = useState([]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDateDropdownVisible(false);
  };

  const handleClassStatusSelect = (status) => {
    setSelectedClassStatus(status);
    setClassStatusDropdown(false);
  };

  const fetchClassData = useCallback(async () => {
    try {
      const [day, month, year] = selectedDate.split("/");
      const formattedDate = `${year}-${month}-${day}`;
      const classDate = new Date(formattedDate);
      classDate.setDate(classDate.getDate() + Number(selectedDay));
      const schedule_date = classDate.toISOString().split("T")[0];

      const response = await fetch(
        `${API_BASE_URL}/api/classes/displayClassData/${schedule_date}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setClassData(data.results || []);
    } catch (error) {
      console.error("Error fetching class data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    }
  }, [selectedDate, selectedDay, selectedClassStatus]);

  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <HeaderVer2 title="Home" onPress={() => navigation.goBack()} />
      </SafeAreaView>
      <View style={styles.classesSection}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Classes</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDateDropdownVisible(!dateDropdownVisible)}
          >
            <Text style={styles.buttonText}>{selectedDate}</Text>
            <Ionicons name="chevron-down" size={20} color="#E2F163" />
          </TouchableOpacity>
        </View>
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
        <TouchableOpacity
          style={styles.dropdownButton2}
          onPress={() => setClassStatusDropdown(!classStatusDropdown)}
        >
          <Text style={styles.buttonText}>{selectedClassStatus}</Text>
          <Ionicons name="chevron-down" size={20} color="#E2F163" />
        </TouchableOpacity>
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
        <ScrollView style={styles.classCards}>
          {classData.length > 0 ? (
            classData.map((classItem) => (
              <UpcomingClassCard
                key={classItem.class_id}
                classData={classItem}
                refreshClasses={fetchClassData}
              />
            ))
          ) : (
            <Text style={styles.noClassesText}>No classes available</Text>
          )}
        </ScrollView>
      </View>
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
  sectionTitle: { fontSize: 24, color: "white", fontWeight: "bold" },

  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#E2F163",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    width: 150,
    backgroundColor: "black",
    marginTop: 10,
  },
  dropdownButton2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#E2F163",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    width: 150,
    backgroundColor: "black",
    marginTop: 10,
    alignSelf: "flex-end", // Moves button to the right
    marginRight: 20,
  },

  buttonText: { fontSize: 16, color: "#E2F163", fontWeight: "bold" },
  dropdown: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 5,
    width: 150,
    padding: 5,
    top: 50,
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
    top: 180,
    right: 20,
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
    marginBottom: 10,
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

  classesSection: {
    marginBottom: 270,
  },
  classCards: {
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: "#B3A0FF",
    width: "100%",
    flexGrow: 1,
  },
});

export default Classes;
