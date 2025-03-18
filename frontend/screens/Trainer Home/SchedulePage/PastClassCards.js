import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function PastClassCard({ title, time, coach, date, slots, image }) {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.cardContainer}>
        {/* Class Info & Image */}
        <View style={styles.topSection}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={20} color="white" />
              <Text style={styles.detailText}> {time}</Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome name="user" size={18} color="white" />
              <Text style={styles.slotText}>
                {" "}
                <Text style={styles.redText}>{slots}</Text>
              </Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome name="headphones" size={18} color="white" />
              <Text style={styles.detailText}> {coach}</Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome name="calendar" size={18} color="white" />
              <Text style={styles.detailText}> {date}</Text>
            </View>
          </View>

          <Image source={image} style={styles.cardImage} />
        </View>
      </View>

      {/* Button Section*/}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Mark Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    width: "95%",
    alignSelf: "center",
    marginBottom: 10, // Space below card and buttons
  },
  cardContainer: {
    backgroundColor: "#212020",
    borderRadius: 20,
    width: "100%",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    padding: 15,
    flex: 1,
  },
  title: {
    fontSize: 22,
    color: "#E2F163",
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: "#FFF",
  },
  slotText: {
    fontSize: 16,
    color: "#FFF",
  },
  redText: {
    color: "red",
    fontWeight: "bold",
  },
  cardImage: {
    width: 200,
    height: 165,
    borderRadius: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15, // Adds spacing between card and buttons
  },
  button: {
    backgroundColor: "#111",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#E2F163",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PastClassCard;
