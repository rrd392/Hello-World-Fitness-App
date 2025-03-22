import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../../env";

function UpcomingClassCard({ classData }) {
  const navigation = useNavigation();

  return (
    <View>
    {classData.length > 0 ? (classData.map((classItem, index) => (
      <View key={index} style={styles.wrapper}>
        <View style={styles.cardContainer}>
          {/* Class Info & Image */}
          <View style={styles.topSection}>
            <View style={styles.infoContainer}>
              <Text style={styles.title}>{classItem.class_name}</Text>

              <View style={styles.detailRow}>
                <MaterialIcons name="schedule" size={20} color="white" />
                <Text style={styles.detailText}> {classItem.start_time.slice(0,-3)} - {classItem.end_time.slice(0,-3)}</Text>
              </View>

              <View style={styles.detailRow}>
                <FontAwesome name="user" size={18} color="white" />
                <Text style={styles.slotText}>
                  {" "}
                  <Text style={classItem.participants==classItem.max_participants? styles.redText: styles.yellowText}>{classItem.participants}/{classItem.max_participants}</Text>
                </Text>
              </View>

              <View style={styles.detailRow}>
                <FontAwesome name="headphones" size={18} color="white" />
                <Text style={styles.detailText}> {classItem.name}</Text>
              </View>

              <View style={styles.detailRow}>
                <FontAwesome name="calendar" size={18} color="white" />
                <Text style={styles.detailText}> {new Date(classItem.schedule_date).toLocaleDateString('en-GB')}</Text>
              </View>
            </View>
            <Image source={{ uri: `${API_BASE_URL}/uploads/${classItem.class_image}`}} style={styles.cardImage} />
          </View>
        </View>

        {/* Button Section*/}
        <View>
          {new Date(classItem.schedule_date) > new Date() || 
          (new Date(classItem.schedule_date).toDateString() === new Date().toDateString() &&
            classItem.start_time > new Date().toLocaleTimeString('en-GB', { hour12: false })) ? (
            <View style={styles.buttonRow}>
                <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("MarkAttendance", {classData: classItem})}
              >
                <Text style={styles.buttonText}>Mark Attendance</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("ClassAttendance", { classData: classItem })
                }
              >
                <Text style={styles.buttonText}>More</Text>
              </TouchableOpacity>
            </View>
          ):(
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ClassReport", {classData: classItem})}
              >
                <Text style={styles.buttonText}>View Feedback</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("ClassPastAttendance", { classData: classItem })
                }
              >
                <Text style={styles.buttonText}>More</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    ))):(
      <View style={styles.wrapper}>
        <Text style={styles.noClassText}>No class available.</Text>
      </View>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    padding:20,
    alignSelf: "center",
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
  yellowText: {
    color: "#E2F163",
    fontWeight: "bold",
  },
  cardImage: {
    width: 200,
    height: 165,
    borderRadius: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15, 
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 10,
    borderRadius: 25,
    width:"45%"
  },
  buttonText: {
    color: "#E2F163",
    fontSize: 16,
    fontWeight: "bold",
    textAlign:'center'
  },
  noClassText:{
    color:"black",
    textAlign:'center',
    fontSize:18,
    fontWeight:500
  }
});

export default UpcomingClassCard;
