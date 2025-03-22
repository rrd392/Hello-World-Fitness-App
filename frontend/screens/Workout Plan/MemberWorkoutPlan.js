import React, { useState, useEffect, useCallback } from 'react';
import { View, Image, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';
import ModalDropdown from "react-native-modal-dropdown";

const MemberWorkoutPlan = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState("General");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedDay, setSelectedDay] = useState("All");
  const [userPlan, setUserPlan] = useState("");

  //Profile icon button
  const handleGoToProfile = () =>navigation.navigate('ProfileStack');

  //Notification icon pop up page
  const toggleNotification = () => navigation.navigate('Notification');

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [generalPlans, setGeneralPlans] = useState([]);
  const [coachPlans, setCoachPlans] = useState([]);
  const [customPlans, setCustomPlans] = useState([]);

  useEffect(() => {
    async function fetchUserId() {
      const token = await getUserId();
      setUserId(token.id);
      setUserName(token.name);
    }
    fetchUserId();
  }, []);

  const fetchData = async () => {
    fetchGeneralPlan();
    if (userId) {
      fetchUserPlan();
      fetchCoachPlan();
      fetchCustomPlan();
    }
  };

  // Reload data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [userId, selectedLevel, selectedDay])
  );

  const fetchGeneralPlan = async () => {
    try {
      const endpoint = selectedLevel
        ? `${API_BASE_URL}/api/workout-plan/displayGeneral/${selectedLevel}`
        : `${API_BASE_URL}/api/workout-plan/displayGeneral/all`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
      }

      const data = await response.json();

      if (data) {
        if (Array.isArray(data.results)) {
          setGeneralPlans(data.results);
        } else if (data.results) {
          setGeneralPlans([data.results]); 
        } else {
          setGeneralPlans([]); 
        }
      }
    } catch (error) {
      console.error("Error fetching general workout plan data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    }
  };

  const fetchUserPlan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workout-plan/displayUserPlan/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
      }

      const data = await response.json();

      if (data) {
        setUserPlan(data.plan_name);
      }
    } catch (error) {
      console.error("Error fetching general workout plan data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    }
  };

  const fetchCoachPlan = async () => {
    try {
      const endpoint = selectedLevel
        ? `${API_BASE_URL}/api/workout-plan/displayCoach/${userId}/${selectedLevel}`
        : `${API_BASE_URL}/api/workout-plan/displayCoach/${userId}/all`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
      }

      const data = await response.json();

      if (data) {
        if (Array.isArray(data.results)) {
          setCoachPlans(data.results);
        } else if (data.results) {
          setCoachPlans([data.results]); 
        } else {
          setCoachPlans([]); 
        }
      }
    } catch (error) {
      console.error("Error fetching coach workout plan data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    }
  };

  const fetchCustomPlan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/workout-plan/displayCustom/${userId}/${selectedDay}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
      }

      const data = await response.json();

      if (data) {
        if (Array.isArray(data.results)) {
          setCustomPlans(data.results);
        } else if (data.results) {
          setCustomPlans([data.results]); 
        } else {
          setCustomPlans([]); 
        }
      }
    } catch (error) {
      console.error("Error fetching custom workout plan data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    }
  };

  function toggleWorkOutDetails(workout_plan, selected){
    navigation.navigate('DetailWorkoutPlan', { workout_plan, selected });
  }

  function toggleCustomWorkOutDetails(workout_plan, selectedDay, type){
    navigation.navigate('CustomDetailWorkoutPlan', { workout_plan, selectedDay, type });
  }

  function toggleAddWorkoutPlan(){
    navigation.navigate('AddWorkoutPlan');
  }
  
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Hi, {userName}</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={toggleNotification}><Ionicons name="notifications" size={24} color="#896CFE" /></TouchableOpacity>
            <TouchableOpacity onPress={handleGoToProfile}><Ionicons name="person" size={24} color="#896CFE" /></TouchableOpacity>
          </View>
        </View>
        <Text style={styles.subtitle}>It’s time to challenge your limits.</Text>
        {/* Navigation Icons */}
        <View style={styles.navButtons}>
        {["General", "Coach", "My Plan"].map((item) => {
          if (userPlan.split(" ")[0] === "Standard" && item === "Coach") {
            return (
              <TouchableOpacity
                key={item}
                style={[styles.navItem, selected === item && styles.selectedNavItem]} 
                onPress={() => Alert.alert("Upgrade to premium to unlock this feature!")}
              >
                <Text style={[styles.navText , {color:"grey"}]}>{item}</Text>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={item}
                style={[styles.navItem, selected === item && styles.selectedNavItem]} 
                onPress={() => setSelected(item)}
              >
                <Text style={styles.navText}>{item}</Text>
              </TouchableOpacity>
            );
          }
        })}
        </View>
        
        {selected === "General" && (
          generalPlans.length > 0 ? (
            <View style={{ flex: 1 }}>
              <View style={styles.levelButtons}>
                {["Beginner", "Intermediate", "Advanced"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.levelItem, selectedLevel === item && styles.selectedLevelItem]} 
                    onPress={() => setSelectedLevel(item)}
                  >
                    <Text style={styles.levelText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.contentTitle}>Let's Go {userName}</Text>
              <Text style={styles.contentSubTitle}>Explore Different Workout Styles</Text>
              <FlatList
                data={generalPlans}  
                keyExtractor={(item) => item.workout_plan_id.toString()} 
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => toggleWorkOutDetails(item, selected)} style={styles.generalCard}>
                    <View style={styles.generalItem}>
                        <Text style={styles.generalTitle}>{item.plan_name}</Text>
                        <Text style={styles.generalText} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
                        <Text><Ionicons name="accessibility" size={13}></Ionicons>  {item.count} Exercises</Text>
                    </View>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: `${API_BASE_URL}/uploads/${item.workout_image}` }} style={styles.workoutImage} />
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.difficulty}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.listSection}
              />
            </View>
          ):(
            <View style={{ flex: 1 }}>
              <View style={styles.levelButtons}>
                {["Beginner", "Intermediate", "Advanced"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.levelItem, selectedLevel === item && styles.selectedLevelItem]} 
                    onPress={() => setSelectedLevel(item)}
                  >
                    <Text style={styles.levelText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.contentText}>No Workout Plans Available.</Text>
            </View>
          )
          )
        }
        {selected === "Coach" && (
            coachPlans.length > 0 ? (
              <View style={{ flex: 1 }}>
                <View style={styles.levelButtons}>
                  {["Beginner", "Intermediate", "Advanced"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.levelItem, selectedLevel === item && styles.selectedLevelItem]} 
                      onPress={() => setSelectedLevel(item)}
                    >
                      <Text style={styles.levelText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.contentTitle}>Let's Go {userName}</Text>
                <Text style={styles.contentSubTitle}>Explore Different Workout Styles</Text>
                <FlatList
                  data={coachPlans}  
                  keyExtractor={(item) => item.workout_plan_id.toString()} 
                  renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => toggleWorkOutDetails(item, selected)} style={styles.generalCard}>
                    <View style={styles.generalItem}>
                        <Text style={styles.generalTitle}>{item.plan_name}</Text>
                        <Text style={styles.generalText} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
                        <Text><Ionicons name="accessibility" size={13}></Ionicons>  {item.count} Exercises</Text>
                    </View>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: `${API_BASE_URL}/uploads/${item.workout_image}` }} style={styles.workoutImage} />
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.difficulty}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.listSection}
                />
              </View>
            ):(
              <View style={{ flex: 1 }}>
                <View style={styles.levelButtons}>
                  {["Beginner", "Intermediate", "Advanced"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[styles.levelItem, selectedLevel === item && styles.selectedLevelItem]} 
                      onPress={() => setSelectedLevel(item)}
                    >
                      <Text style={styles.levelText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.contentText}>No Workout Plans Available.</Text>
              </View>
            )
        )}
        {selected === "My Plan" && (
          customPlans.length > 0 ? (
            <View style={{ flex: 1 }}>
              <ModalDropdown
                key="dayDropdown"
                options={["All","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
                defaultValue="All"
                initialScrollIndex={0}
                style={{marginTop:30}}
                textStyle={{ fontSize: 16, color: "#000", backgroundColor: "#E2F163", paddingVertical:5,  borderRadius:10, marginLeft:'auto', fontWeight:400, width:"100%", textAlign:'center', marginTop:-10, marginBottom:30}}
                dropdownStyle={{ width: "90%", height: 180,right:0, marginTop:-20, borderRadius:10}}
                dropdownTextStyle={{
                  fontSize: 16, 
                  color: "#000", 
                  textAlign: "center", 
                  paddingVertical: 10, 
                  borderRadius:10
                }}
                onSelect={(index, value) => setSelectedDay(value)}
              />

              <Text style={styles.contentTitle}>Let's Go {userName}</Text>
              <Text style={styles.contentSubTitle}>Explore Different Workout Styles</Text>
              <FlatList
              data={customPlans}  
              keyExtractor={(item) => item.workout_plan_id.toString()} 
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleCustomWorkOutDetails(item, selectedDay, item.type)} style={styles.generalCard} key={item.workout_plan_id}>
                  <View style={styles.generalItem}>
                      <Text style={styles.generalTitle}>{item.plan_name}</Text>
                      <Text style={styles.generalText} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
                      <Text><Ionicons name="accessibility" size={13}></Ionicons>  {item.count} Exercises</Text>
                  </View>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: `${API_BASE_URL}/uploads/${item.workout_image}` }} style={styles.workoutImage} />
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.difficulty}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listSection}
              />
              <TouchableOpacity style={styles.addButton} onPress={() => toggleAddWorkoutPlan()}>
                <Ionicons name="add" size={35} marginTop={7}></Ionicons>
              </TouchableOpacity>
            </View>
          ):(
            <View style={{ flex: 1 }}>
              <ModalDropdown
                key="dayDropdown"
                options={["All","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}
                defaultValue="All"
                initialScrollIndex="0"
                style={{marginTop:30}}
                textStyle={{ fontSize: 16, color: "#000", backgroundColor: "#E2F163", paddingVertical:5,  borderRadius:10, marginLeft:'auto', fontWeight:400, width:"100%", textAlign:'center', marginTop:-10, marginBottom:30}}
                dropdownStyle={{ width: "90%", height: 180,right:0, marginTop:-20, borderRadius:10}}
                dropdownTextStyle={{
                  fontSize: 16, 
                  color: "#000", 
                  textAlign: "center", 
                  paddingVertical: 10, 
                  borderRadius:10
                }}
                onSelect={(index, value) => setSelectedDay(value)}
              />
              <Text style={styles.contentText}>No Workout Plans Available.</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => toggleAddWorkoutPlan()}>
                <Ionicons name="add" size={35} marginTop={7}></Ionicons>
              </TouchableOpacity>
            </View>
          )
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#212020', padding: 20, paddingBottom:0, marginBottom:-30},
  greeting: { fontSize: 24, color: '#896CFE', fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#fff', marginBottom: 10 },
  header:{flex:1},
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  iconRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 20 },
  navButtons:{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20},
  navItem:{alignItems: 'center', paddingVertical:10, width:'33%'},
  navText:{color:'white', fontSize:16, fontWeight:'bold'},
  selectedNavItem: {backgroundColor: "rgba(255, 255, 255, 0.5)", paddingVertical:10, width:'33%'},
  
  levelButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom:30, marginTop:20},
  levelItem: { alignItems: 'center', backgroundColor:'rgba(226, 241, 99, 0.5)', borderRadius:15, padding:8, width:'30%'},
  levelText: { color: '#000', fontSize:14 },
  selectedLevelItem:{backgroundColor: "rgba(226, 241, 99, 1)", width:'30%'},

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
    zIndex:99,
  },

  contentTitle:{color:'#E2F163', fontSize:20, textAlign:'left', marginBottom: 10, fontWeight:'bold'},
  contentSubTitle:{fontSize: 14, color: '#fff', marginBottom: 30, textAlign:'left'},
  contentText: {color: "white", fontSize: 16,},
  generalCard:{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', marginBottom: 30, alignItems:'center', borderRadius: 20, overflow: "hidden", height:150, gap:'5%'},
  generalItem: { width:'50%', marginLeft:15 },
  generalTitle: { fontWeight: 'bold', color: 'black', fontSize:18, marginBottom:10 },
  generalText: { color: 'black', marginBottom:15 },
  workoutImage:{ width:'100%', height: '100%', borderRadius: 10 },
  imageContainer: { width: '45%', height:'100%'},
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#E2F163", 
    paddingHorizontal: 20,
    paddingRight:28,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: "#000",
    fontSize: 12,
  },
  addButton:{
    borderRadius:"50%",
    backgroundColor:"#E2F163",
    width:50,
    height:50,
    alignItems:"center",
    position:'absolute',
    bottom:20,
    right:0
  },
  
});

export default MemberWorkoutPlan;