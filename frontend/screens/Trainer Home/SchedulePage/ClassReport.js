import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import MemberFeedback from "./MemberReviews";
import HeaderVer4 from "../../HeaderVer4";

function ClassReport() {
  const navigation = useNavigation();
  const route = useRoute();
  const { className } = route.params || {};

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  // Class Data
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Header */}
      <HeaderVer4 title="Home" onPress={() => navigation.goBack()} />

      {/* Wrap everything in FlatList for optimized scrolling */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          ListHeaderComponent={
            <View style={styles.container}>
              {/* Page Content */}
              <View style={styles.pageContent}>
                {selectedClass ? (
                  <>
                    <View style={styles.imageContainer}>
                      <Image
                        source={selectedClass.image}
                        style={styles.classImage}
                      />
                      <View style={styles.overlay}>
                        <Text style={styles.overlayText}>Session Ended</Text>
                      </View>
                    </View>
                    <View style={styles.classCard}>
                      <View style={styles.headerRow}>
                        <Text style={styles.classTitle}>
                          {selectedClass.title}
                        </Text>
                        <View style={styles.iconRow}>
                          <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="white"
                          />
                          <Text style={styles.classDate}>
                            {selectedClass.date}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.classInfo}>
                        <View style={{ flex: 1, maxWidth: "65%", gap: 5 }}>
                          <Text style={styles.classDescription}>
                            {selectedClass.description}
                          </Text>
                          <View style={styles.infoRow}>
                            <Ionicons
                              name="time-outline"
                              size={18}
                              color="white"
                            />
                            <Text style={styles.classTime}>
                              {selectedClass.time}
                            </Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Ionicons
                              name="person-outline"
                              size={18}
                              color="white"
                            />
                            <Text style={styles.classSlots}>
                              {selectedClass.slots}
                            </Text>
                          </View>
                        </View>

                        {/* Right side - Coach Info */}
                        <View style={styles.coachCard}>
                          <View style={styles.coachProfile}>
                            <Image
                              source={require("./coach.jpg")}
                              style={styles.coachImage}
                            />
                            <View>
                              <Text style={styles.coachName}>
                                {selectedClass.coach}
                              </Text>
                              <Text style={styles.coachEmail}>
                                {selectedClass.coachEmail}
                              </Text>
                              <Text style={styles.coachNumber}>
                                {selectedClass.coachNumber}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </>
                ) : (
                  <Text style={styles.errorText}>Class not found</Text>
                )}
              </View>
            </View>
          }
          data={[]} // Empty data since we only need the header component
          renderItem={null} // No list items, only header and feedback
          ListFooterComponent={<MemberFeedback />}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },

  homeButton: { flexDirection: "row", alignItems: "center", gap: 3 },
  homeText: { fontSize: 24, color: "#896CFE", fontWeight: "bold" },

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
    marginTop: 0,
    backgroundColor: "#B3A0FF",
    paddingVertical: 20,
  },
  classInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Ensures items don't stretch
    gap: 10, // Adds spacing between description and coach card
    padding: 5,
  },

  imageContainer: {
    position: "relative",
    marginBottom: 20,
    width: "95%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#333",
  },
  classImage: {
    width: "100%",
    height: "100%",
    opacity: 0.5, // Reduce opacity of image
  },
  overlay: {
    position: "absolute",
    top: "65%",
    left: "43%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
  },
  overlayText: {
    color: "#E2F163",
    fontSize: 18,
    fontWeight: "bold",
  },
  classCard: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 15,
    width: "95%",
  },
  classTitle: { fontSize: 30, color: "#E2F163", fontWeight: "bold" },
  classDescription: { fontSize: 16, color: "white", marginTop: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 },
  classTime: { fontSize: 16, color: "white" },
  classSlots: { fontSize: 16, color: "red", fontWeight: "bold" },
  classDate: { fontSize: 16, color: "white" },
  coachCard: {
    backgroundColor: "#C4E538",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
  },
  coachProfile: { flexDirection: "row", alignItems: "center", gap: 10 },
  coachImage: { width: 40, height: 40, borderRadius: 20 },
  coachName: { fontSize: 16, fontWeight: "bold" },
  coachEmail: { fontSize: 10, color: "#444" },
  coachNumber: { fontSize: 10, color: "#444" },

  signUpButton: {
    backgroundColor: "#1E1E1E",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 20,
    marginBottom: 20,
  },
  signUpText: { fontSize: 18, color: "#E2F163", fontWeight: "bold" },

  errorText: { fontSize: 18, color: "red", textAlign: "center", marginTop: 20 },
});

export default ClassReport;
