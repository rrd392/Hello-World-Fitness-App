import React, { useState, useEffect, useCallback } from "react";
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
import API_BASE_URL from "../../../env";
import { getUserId } from "../../getUserId";

function Schedule1() {
  const navigation = useNavigation();
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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDateDropdownVisible(false);
  };

  const handleClassStatusSelect = (status) => {
    setSelectedClassStatus(status);
    setClassStatusDropdown(false);
  };

  const [userId, setUserId] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    async function fetchUserId() {
        const token = await getUserId();
        setUserId(token.id);
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    if(userId){
      fetchUpcomingClasses();
    }
  }, [userId, selectedDate, selectedDay]);

  const fetchUpcomingClasses = useCallback(async () => {
    const [day, month, year] = selectedDate.split("/"); 
    const formattedDate = `${year}-${month}-${day}`;

    const classDate = new Date(formattedDate);
    classDate.setDate(classDate.getDate() + Number(selectedDay)); 

    const schedule_date = classDate.toISOString().split("T")[0];
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/trainer-class/displayClasses/${userId}/${schedule_date}`,
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
        setClasses(data.results)
      }
    } catch (error) {
      console.error("Error fetching upcoming class data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
    }
  }, [userId, selectedDate, selectedDay]);

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
            style={[styles.historyButton]}
            onPress={() => navigation.navigate("ClassHistory")}
          >
            <Text style={[styles.buttonText, {color:"#000", textAlign:'center'}]}>View History</Text>
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
        <UpcomingClassCards classData={classes} />
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

  historyButton:{
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    width: 150,
    backgroundColor: "#E2F163",
    marginTop: 10,
  },

  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    width: 150,
    backgroundColor: "#212020",
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
    backgroundColor: "#212020",
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

  classesSection: { marginBottom: 20},
  classCards: { marginBottom: 10, backgroundColor: "#B3A0FF", width: "100%" },
});

export default Schedule1;
