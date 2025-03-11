import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import MemberFeedback from "./MemberFeedback";
import { KeyboardAvoidingView, Platform } from "react-native";
import HeaderVer2 from "../../HeaderVer2";

function SelectedClass() {
  const navigation = useNavigation();
  const route = useRoute();
  const { className } = route.params || {};

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

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
    {
      title: "Zumba Dance",
      description: "A Fun Dance Workout to Get Your Heart Pumping.",
      time: "10:00 - 11:00",
      coach: "Coach Aaron",
      coachEmail: "aaron122@gmail.com",
      coachNumber: "+0123456789",
      date: "2025-01-02",
      slots: "15/20",
      image: require("./yoga.jpg"),
    },
  ];

  const selectedClass = classData.find((cls) => cls.title === className);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failModalVisible, setFailModalVisible] = useState(false);
  const [classFull, setClassFull] = useState(false); // Set to true to show fail modal and alse to show success modal
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#212020" }}>
      <HeaderVer2 title="Classes" onPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          data={selectedClass ? [selectedClass] : []}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <View style={styles.pageContent}>
                <Image source={item.image} style={styles.classImage} />

                <View style={styles.classCard}>
                  <View style={styles.headerRow}>
                    <Text style={styles.classTitle}>{item.title}</Text>
                    <View style={styles.iconRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="white"
                      />
                      <Text style={styles.classDate}>{item.date}</Text>
                    </View>
                  </View>
                  <View style={styles.classInfo}>
                    <View style={{ flex: 1, maxWidth: "65%", gap: 5 }}>
                      <Text style={styles.classDescription}>
                        {item.description}
                      </Text>
                      <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={18} color="white" />
                        <Text style={styles.classTime}>{item.time}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons
                          name="person-outline"
                          size={18}
                          color="white"
                        />
                        <Text style={styles.classSlots}>{item.slots}</Text>
                      </View>
                    </View>

                    <View style={styles.coachCard}>
                      <View style={styles.coachProfile}>
                        <Image
                          source={require("./coach.jpg")}
                          style={styles.coachImage}
                        />
                        <View>
                          <Text style={styles.coachName}>{item.coach}</Text>
                          <Text style={styles.coachEmail}>
                            {item.coachEmail}
                          </Text>
                          <Text style={styles.coachNumber}>
                            {item.coachNumber}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.signUpButton}
                  onPress={() => {
                    if (classFull) {
                      setFailModalVisible(true); // Show fail modal if class is full
                    } else {
                      setSuccessModalVisible(true); // Show success modal if class is not full
                    }
                  }}
                >
                  <Text style={styles.signUpText}>Sign Up For Class</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: "100%" }}>
                <MemberFeedback />
              </View>
              <Modal
                visible={successModalVisible}
                transparent
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setSuccessModalVisible(false)}
                    >
                      <Ionicons name="close" size={20} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.modalText}>
                      Successfully Signed Up For Class
                    </Text>
                    <TouchableOpacity
                      style={styles.viewMoreButton}
                      onPress={() => {
                        setSuccessModalVisible(false);
                        setFailModalVisible(false);
                        navigation.navigate("Classes");
                      }}
                    >
                      <Text style={styles.viewMoreText}>View More Classes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <Modal
                visible={failModalVisible}
                transparent
                animationType="slide"
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setFailModalVisible(false)}
                    >
                      <Ionicons name="close" size={20} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.modalText}>Sorry, Class is Full.</Text>
                    <TouchableOpacity
                      style={styles.viewMoreButton}
                      onPress={() => {
                        setModalVisible(false);
                        navigation.navigate("Classes");
                      }}
                    >
                      <Text style={styles.viewMoreText}>View More Classes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.errorText}>Class not found</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#212020" },

  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  iconRow: { flexDirection: "row", gap: 5 },
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

  pageContent: {
    alignItems: "center",
    gap: 10,
    padding: 20,
    backgroundColor: "#B3A0FF",
  },
  classInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Ensures items don't stretch
    gap: 10, // Adds spacing between description and coach card
    paddingLeft: 15,
    paddingRight: 10,
    paddingBottom: 10,
  },

  classImage: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: 10,
    padding: 10,
  },
  classCard: {
    backgroundColor: "#232323",
    padding: 10,
    borderRadius: 15,
    width: "100%",
  },
  classTitle: { fontSize: 34, color: "#E2F163", fontWeight: "bold" },
  classDescription: { fontSize: 14, color: "white", marginTop: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 },
  classTime: { fontSize: 14, color: "white" },
  classSlots: { fontSize: 14, color: "red", fontWeight: "bold" },
  classDate: { fontSize: 16, color: "white" },
  coachCard: {
    backgroundColor: "#C4E538",
    borderRadius: 10,
    padding: 10,
    marginTop: 60,
  },
  coachProfile: { flexDirection: "row", alignItems: "center", gap: 10 },
  coachImage: { width: 40, height: 40, borderRadius: 20 },
  coachName: { fontSize: 18, fontWeight: "500" },
  coachEmail: { fontSize: 10, color: "#444" },
  coachNumber: { fontSize: 10, color: "#444" },

  signUpButton: {
    backgroundColor: "#212020",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  signUpText: { fontSize: 18, color: "#E2F163", fontWeight: "bold" },

  errorText: { fontSize: 18, color: "red", textAlign: "center", marginTop: 20 },
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
    backgroundColor: "#212020",
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
});

export default SelectedClass;
