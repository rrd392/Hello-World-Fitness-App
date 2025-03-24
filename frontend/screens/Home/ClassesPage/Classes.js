import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ClassCard from "./ClassCard";
import HeaderVer2 from "../../HeaderVer2";
import API_BASE_URL from "../../../env";

const getMondayDates = () => {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay(); 

  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const mondays = [];
  for (let i = 0; i < 3; i++) {
    const newMonday = new Date(monday);
    newMonday.setDate(monday.getDate() + i * 7); 
    const formattedDate = newMonday.toLocaleDateString("en-GB"); 
    mondays.push(formattedDate);
  }
  return mondays;
};

function Classes() {
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const mondayDates = getMondayDates(); 
  const [selectedDate, setSelectedDate] = useState(mondayDates[0]);
  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI"];
  const [selectedDay, setSelectedDay] = useState(0);
  const [classData, setClassData] = useState([]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDropdownVisible(false);
  };

  useEffect(() => {
    fetchClassData();
  }, [selectedDate, selectedDay]);
  
  const fetchClassData = useCallback(async () => {
    try {
      const [day, month, year] = selectedDate.split("/"); 
      const formattedDate = `${year}-${month}-${day}`;

      const classDate = new Date(formattedDate);
      classDate.setDate(classDate.getDate() + Number(selectedDay)); 

      const schedule_date = classDate.toISOString().split("T")[0];

      const response = await fetch(`${API_BASE_URL}/api/classes/displayClassData/${schedule_date}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
      }
  
      const data = await response.json();
  
      if (data) {
        setClassData(data.results);
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    }
  }, [selectedDate, selectedDay]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <SafeAreaView>
        <HeaderVer2 title="Home"
          onPress={() => navigation.goBack()} />
      </SafeAreaView>

      {/* Classes Section */}
      <View style={styles.classesSection}>
        <Text style={styles.sectionTitle}>Classes</Text>
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.yourClassBtn} onPress={() => navigation.navigate("YourClasses")}>
            <Text style={styles.yourClassText}>Your Classes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={styles.buttonText}>{selectedDate}</Text>
            <Ionicons name="chevron-down" size={20} color="#E2F163" />
          </TouchableOpacity>
        </View>
        {/* Dropdown Items */}
        {dropdownVisible && (
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
              <Text style={selectedDay === index ? styles.selectedDate : styles.daySelection}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Class Cards */}
        <ScrollView style={styles.classCards}>
          {classData && classData.length > 0 ?(
            classData.map((classItem) => (
              <ClassCard key={classItem.class_id} classData={classItem} refreshClasses={fetchClassData}/>
            ))
          ):(
            <View>
              <Text style={{color:'#000', fontSize:16, fontWeight:500, marginBottom:20}}>No class available</Text>
            </View>
          )}
        </ScrollView>

        
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#212020"},

  titleContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 24, color: "white", fontWeight: "bold", paddingHorizontal:20, marginBottom:20 },

  classCards: { paddingHorizontal: 20, paddingTop:30, backgroundColor: "#B3A0FF", width: "100%", flexGrow:1},
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#E2F163",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    width: 160,
    backgroundColor: "#212020",
  },
  buttonText: { fontSize: 16, color: "#E2F163", fontWeight: "bold" },
  dropdown: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 5,
    width: 160,
    padding: 5,
    top:50,
    right:20,
    zIndex:10,
    marginLeft:'auto'
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "black",
  },

  daySelectionSection:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:20,
    paddingVertical:10,
    backgroundColor:'#B3A0FF',
    marginBottom:20
  },
  daySelection:{
    color:"#E2F163",
    fontSize:14,
    backgroundColor:'#212020',
    paddingVertical:5,
    borderRadius:5,
    width:70,
    textAlign:'center'
  },
  selectedDate:{
    color:"black",
    fontSize:14,
    backgroundColor:'#E2F163',
    paddingVertical:5,
    borderRadius:5,
    width:70,
    textAlign:'center'
  },

  classesSection:{
    marginBottom:290,
    marginTop:-20
  },

  yourClassBtn:{
    backgroundColor:'#E2F163',
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:5
  },
  yourClassText:{
    fontWeight:500,
    fontSize:16
  },
});

export default Classes;
