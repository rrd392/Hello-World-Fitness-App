import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderVer1 from "../../HeaderVer1";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

function YourClasses() {
  const navigation = useNavigation();
  const [showCancelClass, setShowCancelClass] = useState(false);
  const classData = [
    {
      title: "Yoga Flow",
      description:
        "A Relaxing Yoga Session Focused on Flexibility and Mindfulness.",
      time: "08:00 - 09:00",
      coach: "Coach Aaron",
      coachEmail: "aaron122@gmail.com",
      coachNumber: "+0123456789",
      date: "2025-01-02",
      slots: "20/20",
      image: require("./yoga.jpg"),
    },
  ];

  const historyData = [
    {
      title: "Cardio Blast",
      coach: "Coach Aaron",
      coachEmail: "Aaron122@gmail.com",
      coachNumber: "+0123456789",
      date: "2025-02-17",
      image: require("./yoga.jpg"),
      rated: false, // Change to true if already rated
    },
    {
      title: "Cardio Blast",
      coach: "Coach Aaron",
      coachEmail: "Aaron122@gmail.com",
      coachNumber: "+0123456789",
      date: "2025-02-17",
      image: require("./yoga.jpg"),
      rated: true,
    },
    {
      title: "Cardio Blast",
      coach: "Coach Aaron",
      coachEmail: "Aaron122@gmail.com",
      coachNumber: "+0123456789",
      date: "2025-02-17",
      image: require("./yoga.jpg"),
      rated: true,
    },
  ];
  const item = classData[0];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Fixed Header */}
      <HeaderVer1
        title="Home"
        onPress={() => navigation.navigate("MemberDashboard")}
      />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <Text style={styles.PageTitle}>Your Classes</Text>
        <View style={styles.wrapper}>
          <Text style={styles.CardTitle}>Your Upcoming Classes</Text>

          {/* Class Card */}
          <View style={styles.cardContainer}>
            <View style={styles.topSection}>
              <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.title}</Text>

                <View style={styles.detailRow}>
                  <MaterialIcons name="schedule" size={20} color="white" />
                  <Text style={styles.detailText}> {item.time}</Text>
                </View>

                <View style={styles.detailRow}>
                  <FontAwesome name="user" size={18} color="white" />
                  <Text style={styles.slotText}>
                    {" "}
                    <Text style={styles.redText}>{item.slots}</Text>
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <FontAwesome name="headphones" size={18} color="white" />
                  <Text style={styles.detailText}> {item.coach}</Text>
                </View>

                <View style={styles.detailRow}>
                  <FontAwesome name="calendar" size={18} color="white" />
                  <Text style={styles.detailText}> {item.date}</Text>
                </View>
              </View>

              <Image source={item.image} style={styles.cardImage} />
            </View>
          </View>

          {/* Cancel Class Button */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowCancelClass(true)}
            >
              <Text style={styles.buttonText}>Cancel Class</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* History Section */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>History</Text>
          {historyData.map((item, index) => (
            <View key={index} style={styles.historyCard}>
              <Image source={item.image} style={styles.historyImage} />
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitleText}>{item.title}</Text>
                <View style={styles.detailRow}>
                  <FontAwesome name="calendar" size={18} color="white" />
                  <Text style={styles.detailText}> {item.date}</Text>
                </View>
                <View style={styles.coachInfo}>
                  <Image
                    source={require("./coach.jpg")}
                    style={styles.coachImage}
                  />
                  <View>
                    <Text style={styles.coachName}>{item.coach}</Text>
                    <Text style={styles.coachContact}>{item.coachEmail}</Text>
                    <Text style={styles.coachContact}>{item.coachNumber}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={item.rated ? styles.ratedButton : styles.rateButton}
              >
                <Text
                  style={
                    item.rated ? styles.ratedButtonText : styles.rateButtonText
                  }
                >
                  {item.rated ? "Rated" : "Rate"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Cancel Class Modal */}
      <Modal visible={showCancelClass} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCancelClass(false)}
            >
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>
              Are you sure you want to cancel this class?
            </Text>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => {
                setShowCancelClass(false);
                navigation.navigate("MemberDashboard");
              }}
            >
              <Text style={styles.viewMoreText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default YourClasses;

const styles = {
  PageTitle: { fontSize: 28, color: "white", fontWeight: "bold", margin: 20 },
  wrapper: {
    marginTop: 15,
    width: "95%",
    alignSelf: "center",
    marginBottom: 30, // Space below card and buttons
    backgroundColor: "#B3A0FF",
    padding: 10,
  },
  CardTitle: {
    fontSize: 25,
    color: "black",
    fontWeight: "400",
    margin: 20,
    textAlign: "center",
  },
  cardContainer: {
    borderRadius: 20,
    width: "100%",
    backgroundColor: "#B3A0FF",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#212020",
    borderRadius: 20,
  },
  infoContainer: {
    backgroundColor: "#232323",
    borderRadius: 20,
    padding: 15,
    flex: 1,
    gap: 5,
  },
  title: {
    fontSize: 26,
    color: "#E2F163",
    fontWeight: "500",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: "#FFF",
  },
  slotText: {
    fontSize: 13,
    color: "#FFF",
  },
  redText: {
    fontSize: 15,
    color: "red",
    fontWeight: "bold",
  },
  cardImage: {
    width: 200,
    height: 195,
    borderRadius: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#E2F163",
    padding: 20,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  viewMoreButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  viewMoreText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  historyContainer: {
    backgroundColor: "#111",
    padding: 15,
  },
  historyTitle: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 5,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4D4D4D",
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  historyImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  historyInfo: {
    flex: 1,
    marginLeft: 10,
  },
  historyTitleText: {
    fontSize: 18,
    color: "#E2F163",
    fontWeight: "bold",
  },
  coachInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  coachImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  coachName: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  coachContact: {
    fontSize: 12,
    color: "#ccc",
  },
  rateButton: {
    backgroundColor: "#212020",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  ratedButton: {
    backgroundColor: "#848484",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  rateButtonText: {
    fontSize: 14,
    color: "#E2F163",
    fontWeight: "bold",
  },
  ratedButtonText: {
    fontSize: 14,
    color: "#CFCFCF",
    fontWeight: "bold",
  },
};
