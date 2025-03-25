import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import API_BASE_URL from "../../env";
import { getUserId } from "../getUserId";

const TrainerDashboard = () => {
  const navigation = useNavigation();

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [upcomingClassData, setUpcomingClassData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchUserId() {
      const token = await getUserId();
      setUserId(token.id);
      setUserName(token.name);
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    };
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchUserData();
      }
    }, [userId])
  );

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dashboard/displayTrainer/${userId}`,
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

      if (data.success) {
        if (Array.isArray(data.classes)) {
          setUpcomingClassData(data.classes);
        } else if (data.classes) {
          setUpcomingClassData([data.classes]);
        } else {
          setUpcomingClassData([]);
        }
        setClassData(data.disClass);
        setWorkoutPlans(data.workoutPlans);
        setMembers(data.member);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { timeZone: "Asia/Kuala_Lumpur" });
  }

  const toggleNotification = () => navigation.navigate("Notification");
  const handleGoToProfile = () => navigation.navigate("TrainerProfileStack");

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Hi, {userName}</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={toggleNotification}>
              <Ionicons name="notifications" size={24} color="#896CFE" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGoToProfile}>
              <Ionicons name="person" size={24} color="#896CFE" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subtitle}>It’s time to challenge your limits.</Text>
        <Text style={styles.membership}>Fitness Trainer</Text>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Upcoming Class Section */}
        <View style={styles.upcomingClass}>
          <Text style={styles.sectionTitle}>Your Upcoming Event</Text>
          {Array.isArray(upcomingClassData) && upcomingClassData.length > 0 ? (
            <View style={styles.classCard}>
              <View style={styles.leftClassCard}>
                <Text style={styles.classTitle}>
                  {upcomingClassData[0].class_name}
                </Text>
                <Text style={styles.classDetails}>
                  <Ionicons name="time-outline" size={15} color="white" />{" "}
                  {upcomingClassData[0].start_time} - {upcomingClassData[0].end_time}
                </Text>
                <Text style={styles.classDetails}>
                  <Ionicons name="person-outline" size={15} color="white" />{" "}
                  {upcomingClassData[0].name}
                </Text>
                <Text style={styles.classDetails}>
                  <Ionicons name="calendar-outline" size={15} color="white" />{" "}
                  {formatDate(upcomingClassData[0].schedule_date)}
                </Text>
              </View>
              <View style={styles.rightClassCard}>
                <Image
                  source={{
                    uri: `${API_BASE_URL}/uploads/${upcomingClassData[0].class_image}`,
                  }}
                  style={styles.classImage}
                />
              </View>
            </View>
          ) : (
            <View style={styles.classCard}>
              <Text style={styles.noClassTitle}>No upcoming classes</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => navigation.navigate("Schedule1")}
          >
            <Text style={styles.moreButtonText}>Your Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Classes */}
        <View style={styles.announcementSection}>
          <Text style={styles.announcementTitle}>View Classes</Text>
          <FlatList
            data={[
              ...(Array.isArray(classData) ? classData : []),
              { isMoreCard: true },
            ]}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) =>
              item.class_id?.toString() || `more-${index}`
            }
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) =>
              item.isMoreCard ? (
                // "More >" Card
                <TouchableOpacity
                  style={styles.moreCard}
                  onPress={() => navigation.navigate("Schedule1")}
                >
                  <Text style={styles.moreText}>More &gt;</Text>
                </TouchableOpacity>
              ) : (
                // Regular Class Card
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Schedule1")}>
                  <Image
                    source={{
                      uri: `${API_BASE_URL}/uploads/${item.class_image}`,
                    }}
                    style={styles.announcementImage}
                  />
                  <View style={styles.textOverlay}>
                    <Text style={styles.announcementText}>
                      {item.class_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            }
          />
        </View>

        {/* Workout Plans */}
        <View style={styles.announcementSection}>
          <Text style={styles.announcementTitle}>Manage Workout Plans</Text>
          <FlatList
            data={[
              ...(Array.isArray(workoutPlans) ? workoutPlans : []),
              { isMoreCard: true },
            ]}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) =>
              item.workout_plan_id?.toString() || `more-${index}`
            }
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) =>
              item.isMoreCard ? (
                // "More >" Card
                <TouchableOpacity
                  style={styles.moreCard}
                  onPress={() => navigation.navigate("TrainerWorkoutStack")}
                >
                  <Text style={styles.moreText}>More &gt;</Text>
                </TouchableOpacity>
              ) : (
                // Regular Class Card
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("TrainerWorkoutStack")}>
                  <Image
                    source={{
                      uri: `${API_BASE_URL}/uploads/${item.workout_image}`,
                    }}
                    style={styles.announcementImage}
                  />
                  <View style={styles.textOverlay}>
                    <Text style={styles.announcementText}>
                      {item.plan_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
            }
          />
        </View>

        {/* Diet Plans */}
        <View style={styles.announcementSection} marginBottom="40">
          <Text style={styles.announcementTitle}>Manage Members</Text>
          <FlatList
            data={[
              ...(Array.isArray(members) ? members : []),
              { isMoreCard: true },
            ]}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) =>
              item.meal_id?.toString() || `more-${index}`
            }
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) =>
              item.isMoreCard ? (
                <TouchableOpacity
                  style={styles.moreCard}
                  onPress={() => navigation.navigate("Member")}
                >
                  <Text style={styles.moreText}>More &gt;</Text>
                </TouchableOpacity>
              ) : (
                // Regular Class Card
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Member")}>
                  <Image
                    source={{
                      uri: `${API_BASE_URL}/uploads/${item.profile_picture}`,
                    }}
                    style={styles.announcementImage}
                  />
                  <View style={styles.textOverlay}>
                    <Text style={styles.announcementText}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#212020" },
  header: { padding: 20, marginBottom: -30 },
  greeting: {
    fontSize: 24,
    color: "#896CFE",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: { fontSize: 14, color: "#fff", marginBottom: 10 },
  membership: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
    fontWeight: "bold",
    color: "#896CFE",
    marginBottom: 30,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  iconRow: { flexDirection: "row", justifyContent: "space-between", gap: 20 },

  upcomingClass: { backgroundColor: "#B3A0FF", padding: 20 },
  sectionTitle: {
    fontSize: 24,
    color: "black",
    marginBottom: 10,
    textAlign: "center",
  },
  classCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#212020",
    borderRadius: 10,
    height: 180,
  },
  leftClassCard: {
    paddingLeft: 30,
    // paddingTop: 30,
    flex: 6,
    gap: 10,
  },
  rightClassCard: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  classTitle: {
    fontSize: 24,
    color: "#E2F163",
  },
  classDetails: { color: "#fff" },
  classImage: { width: "100%", height: "100%", borderRadius: 10, flex: 1, resizeMode: "cover" },
  noClassTitle: {
    fontSize: 24,
    color: "yellow",
    marginTop: 30,
    marginHorizontal: "auto",
    marginBottom: 30,
  },
  moreButton: {
    marginTop: 10,
    alignSelf: "center",
    backgroundColor: "#212020",
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
  },
  moreButtonText: { color: "white" },

  announcementTitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 20,
    fontWeight: "bold",
  },
  announcementSection: {
    backgroundColor: "#252525",
    padding: 15,
    marginTop: 20,
  },
  announcementImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    marginRight: 10,
    position: "absolute",
  },
  announcementText: { color: "white", fontSize: 14, textAlign: "center" },
  listContainer: { paddingHorizontal: 10 },
  card: {
    width: Dimensions.get("window").width * 0.4,
    height: 120,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  textOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
  },

  moreCard: {
    width: 80,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  moreText: {
    fontSize: 16,
    color: "#fff",
    fontStyle: "italic",
  },
});

export default TrainerDashboard;
