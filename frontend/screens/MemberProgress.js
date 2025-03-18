import React, { useState, useEffect, useContext, useRef } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import API_BASE_URL from "../env";
import { getUserId } from './getUserId';

const MemberProgress = () => {

  const navigation = useNavigation();

  const handleGoToProfile = () => navigation.navigate('ProfileDashboard');
  const toggleNotification = () => navigation.navigate('Notification');

  const [expandedSessions, setExpandedSessions] = useState({});
  const toggleSession = (categoryTitle, sessionId) => {
    const uniqueKey = `${categoryTitle}-${sessionId}`;

    setExpandedSessions((prev) => ({
      ...prev,
      [uniqueKey]: !prev[uniqueKey],
    }));
  };

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [progressDetails, setProgressDetails] = useState([]);

  useEffect(() => {
    async function fetchUserId() {
      const token = await getUserId();
      setUserId(token.id);
      setUserName(token.name);
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    if(userId && selectedFilter){
      fetchProgressDetails();
    }
  }, [userId, selectedFilter]);

  const fetchProgressDetails = async () => {
    try {
    const response = await fetch(`${API_BASE_URL}/api/progress/display/${userId}/${selectedFilter}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
    }

    const data = await response.json();

    if (data.success) {
        setProgressDetails(data.progress);
    }
    } catch (error) {
    console.error("Error fetching user progress data:", error);
    Alert.alert("Error", error.message || "Network request failed");
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Hi, {userName}</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={toggleNotification}><Ionicons name="notifications" size={24} color="#896CFE" /></TouchableOpacity>
            <TouchableOpacity onPress={handleGoToProfile}><Ionicons name="person" size={24} color="#896CFE" /></TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subtitle}>It’s time to challenge your limits.</Text>
      </SafeAreaView>
      <Text style={styles.headerText}>Your Workout Progress</Text>

      <View style={styles.filterContainer}>
        {["All", "Coach", "Custom"].map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.filterButton, selectedFilter === category && styles.selectedButton]}
            onPress={() => setSelectedFilter(category)}
          >
            <Text style={[styles.filterText, selectedFilter === category && styles.selectedText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={progressDetails}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.category}>
            {/* Static Category Title */}
            <View style={styles.categoryHeader}>
              <Ionicons name="play" size={18} color="#E2F163" />
              <Text style={styles.categoryTitle}>{item.title}</Text>
            </View>

            {/* Expandable Workout Sessions */}
            {item.sessions.map((session) => (
              <View key={session.id} style={styles.session}>
                {/* Session Header (Expandable) */}
                <TouchableOpacity onPress={() => toggleSession(item.title, session.id)} style={styles.sessionHeader}>
                  <Text style={styles.sessionNumber}>{session.id}</Text>

                  <Ionicons name="stopwatch-outline" size={16} color="#896CFE" />
                  <Text style={styles.sessionInfo}> {session.time} Time Taken </Text>
                  <Text style={styles.sessionDate}>{session.date}</Text>

                  <Ionicons
                    name={expandedSessions[`${item.title}-${session.id}`] ? "chevron-up-outline" : "chevron-down-outline"}
                    size={18}
                    color="#896CFE"
                  />
                </TouchableOpacity>


                {/* Expandable Exercise List */}
                {expandedSessions[`${item.title}-${session.id}`] && (
                  <View style={styles.exerciseList}>
                    {session.exercises.length > 0 ? (
                      session.exercises.map((exercise, index) => (
                        <View key={index} style={styles.exerciseBox}>
                          <Text style={styles.exercise}>{exercise.name}</Text>
                          <View style={{ position: 'relative', width: 26, height: 26 }}>
                            {exercise.completed ? (
                              <>
                                <Ionicons name="checkmark-circle" size={26} color="#B7CD00" />
                                <Ionicons
                                  name="checkmark"
                                  size={16}
                                  color="white"
                                  style={{ position: 'absolute', top: 5, left: 5 }}
                                />
                              </>
                            ) : (
                              <Ionicons name="ellipse" size={26} color="#BCBCBC" />
                            )}
                          </View>

                        </View>
                      ))
                    ) : (
                      <Text style={styles.noExercise}>No Exercises</Text>
                    )}
                  </View>
                )}

              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
  greeting: { fontSize: 24, color: '#896CFE', fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#fff', marginBottom: 10 },
  header: { padding: 20, paddingBottom:0},
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  iconRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 20, },
  headerText: { color: "#E2F163", textAlign: 'center', fontSize: 24, fontWeight: 600 },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 30,
    marginVertical:20,
    gap:10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#E2F163",
    width:"33%",
    borderRadius:5,
  },
  selectedButton: {
    backgroundColor: "#fff",
  },
  filterText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign:"center",
  },
  selectedText: {
    color: "#896CFE",
  },

  category: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#A5A5A5",
    marginHorizontal: 20,
    marginBottom:20,
    paddingVertical:10,

  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  categoryTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#E2F163",
  },
  session: {
    paddingBottom: 10,
    marginHorizontal: 10,

  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "white",
    borderRadius:10,
  },
  sessionNumber: {
    fontWeight: "bold",
    color: "#232323",
    marginLeft:10,
    marginRight:30,
  },
  sessionInfo: {
    flex: 1,
    color: "#896CFE",
    fontWeight:600,
  },
  sessionDate: {
    color: "#896CFE",
    marginRight:10,
    fontWeight: 600,

  },
  exerciseList: {
    padding: 10,
    backgroundColor: "#E9E9E9",
    marginTop:-5,
    zIndex:-1,
    marginHorizontal:2,
  },
  exerciseBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    marginHorizontal:10,
  },
  exercise: {
    color: "#4D4D4D",
    fontWeight: 600,
  },
  noExercise: {
    textAlign: "center",
    color: "#aaa",
  },
});

export default MemberProgress;
