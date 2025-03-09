import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const classDates = [
  "2025-03-07",
  "2025-03-06",
  "2025-03-05",
  "2025-03-04",
  "2025-03-03",
  "2025-03-02",
  "2025-03-01",
  "2025-02-29",
  "2025-02-28",
  "2025-02-27",
];

const DateDropdown = ({ onSelectDate }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Select Date");

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onSelectDate(date);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.buttonText}>{selectedDate}</Text>
        <Ionicons name="chevron-down" size={20} color="black" />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          {classDates.map((date) => (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: "relative", zIndex: 10, marginRight: 10 },

  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E2F163",
    padding: 10,
    borderRadius: 5,
    width: 140,
  },

  buttonText: { fontSize: 16, color: "black", fontWeight: "bold" },

  dropdown: {
    position: "absolute",
    top: 45,
    backgroundColor: "white",
    borderRadius: 5,
    width: 140,
    elevation: 5,
    padding: 5,
  },

  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  dropdownText: {
    fontSize: 14,
    color: "black",
  },
});

export default DateDropdown;
