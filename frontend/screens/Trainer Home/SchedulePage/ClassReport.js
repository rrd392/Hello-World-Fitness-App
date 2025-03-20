import React, { useState, useEffect } from "react";
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
import API_BASE_URL from "../../../env";

function ClassReport() {
  const navigation = useNavigation();
  const route = useRoute();
  const { classData } = route.params || {};

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [memberFeedback, setMemberFeedback] = useState([]);
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  useEffect(() => {
    if(classData.class_id){
      fetchMemberFeedback();
    }
  }, [classData]);

  const fetchMemberFeedback = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/trainer-class/displayMemberFeedback/${classData.class_id}`,
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
        setMemberFeedback(data.results)
      }
    } catch (error) {
      console.error("Error fetching class participants data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
    }
  };

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
                {classData ? (
                  <>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: `${API_BASE_URL}/uploads/${classData.class_image}`}} style={styles.classImage} />
                      <View style={styles.overlay}>
                        <Text style={styles.overlayText}>Session Ended</Text>
                      </View>
                    </View>
                    <View style={styles.classCard}>
                      <View style={styles.headerRow}>
                        <Text style={styles.classTitle}>
                          {classData.class_name}
                        </Text>
                        <View style={styles.iconRow}>
                          <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="white"
                          />
                          <Text style={styles.classDate}>
                            {new Date(classData.schedule_date).toLocaleDateString('en-GB')}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.classDescription}>
                        {classData.description}
                      </Text>
                      <View style={styles.classInfo}>
                        <View style={{ flex: 1, maxWidth: "65%", gap: 5 }}>  
                          <View style={styles.infoRow}>
                            <Ionicons
                              name="time-outline"
                              size={18}
                              color="white"
                            />
                            <Text style={styles.classTime}>
                              {classData.start_time.slice(0,-3)} - {classData.end_time.slice(0,-3)}
                            </Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Ionicons
                              name="person-outline"
                              size={18}
                              color="white"
                            />
                            <Text style={classData.participants == classData.max_participants? styles.classSlots:styles.nonFullSlots}>
                              {classData.participants}/{classData.max_participants}
                            </Text>
                          </View>
                        </View>

                        {/* Right side - Coach Info */}
                        <View style={styles.coachCard}>
                          <View style={styles.coachProfile}>
                            <Image source={{ uri: `${API_BASE_URL}/uploads/${classData.profile_picture}`}} style={styles.coachImage} />
                            <View>
                              <Text style={styles.coachName} numberOfLines={1} ellipsizeMode="tail">
                                {classData.name}
                              </Text>
                              <Text style={styles.coachEmail} numberOfLines={1} ellipsizeMode="tail">
                                {classData.email}
                              </Text>
                              <Text style={styles.coachNumber} numberOfLines={1} ellipsizeMode="tail">
                                {classData.contact_number}
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
          data={[]} 
          renderItem={null} 
          ListFooterComponent={<MemberFeedback feedbackData={memberFeedback}/>}
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
    marginBottom: 20,
  },

  homeButton: { flexDirection: "row", alignItems: "center", gap: 3 },
  homeText: { fontSize: 24, color: "#896CFE", fontWeight: "bold" },

  iconRow: { flexDirection: "row", gap: 20 },
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
  pageContent: {
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "#B3A0FF",
    padding: 20,
  },
  classInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", 
    gap: 10, 
    padding: 5,
  },

  imageContainer: {
    position: "relative",
    marginBottom: 20,
    width: "100%",
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#333",
  },
  classImage: {
    width: "100%",
    height: "100%",
    opacity: 0.5, 
  },
  overlay: {
    position: "absolute",
    top: "70%",
    left: "40%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },
  overlayText: {
    color: "#E2F163",
    fontSize: 18,
    fontWeight: "bold",
  },
  classCard: {
    backgroundColor: "#232323",
    padding: 20,
    borderRadius: 15,
    width: "100%",
  },
  classTitle: { fontSize: 26, color: "#E2F163", fontWeight: "bold" },
  classDescription: { fontSize: 14, color: "white",  marginBottom:10},
  infoRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 },
  classTime: { fontSize: 16, color: "white" },
  classSlots: { fontSize: 16, color: "red", fontWeight: "bold" },
  nonFullSlots:{fontSize: 16, color: "#E2F163", fontWeight: "bold"},
  classDate: { fontSize: 16, color: "white" },
  coachCard: {
    backgroundColor: "#E2F163",
    borderRadius: 10,
    padding: 10,
    marginTop: 'auto',
    width:"60%"
  },
  coachProfile: { flexDirection: "row", alignItems: "center", gap: 10 },
  coachImage: { width: 40, height: 40, borderRadius: 20 },
  coachName: { fontSize: 18, fontWeight: 500, maxWidth:"100%" },
  coachEmail: { fontSize: 12, color: "#444" },
  coachNumber: { fontSize: 12, color: "#444" },

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
