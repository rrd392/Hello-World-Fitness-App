import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList, Dimensions,
  Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderVer1 from "../../HeaderVer1";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RatingPopup from "./RatingPopup";
import API_BASE_URL from "../../../env";
import { getUserId } from "../../getUserId";
const { width } = Dimensions.get("window");
const cardWidth = width - 61; 

function YourClasses() {
  const navigation = useNavigation();
  const [showCancelClass, setShowCancelClass] = useState(false);
  const [userId, setUserId] = useState("");
  const [classId, setClassId] = useState("");
  const [upcomingClass, setUpcomingClass] = useState([]);
  const [classHistory, setClassHistory] = useState([]);

  useEffect(() => {
    async function fetchUserId() {
        const token = await getUserId();
        setUserId(token.id);
    }
    fetchUserId();
  }, []);

  useEffect(() => {
      if(userId){
        fetchUpcomingClasses();
        fetchClassHistory();
      }
  }, [userId]);

  function setClose(){
    setModalVisible(false);
    fetchClassHistory();
  }

  const fetchUpcomingClasses = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/classes/displayUpcomingClasses/${userId}`,
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
        setUpcomingClass(data.results)
      }
    } catch (error) {
      console.error("Error fetching upcoming class data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
    }
  };

  const fetchClassHistory = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/classes/displayClassHistory/${userId}`,
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
        setClassHistory(data.results)
      }
    } catch (error) {
      console.error("Error fetching class history data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
    }
  };

  const cancelClass = async (user_id, class_id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/classes/cancelClass`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({user_id, class_id})
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert("Class is successfully canceled.");
      }
    } catch (error) {
      console.error("Error fetching upcoming class data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:"#232323"}}>
      <HeaderVer1
        title="Home"
        onPress={() => navigation.navigate("MemberDashboard")}
      />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.PageTitle}>Your Classes</Text>
        <View style={styles.wrapper}>
          <Text style={styles.CardTitle}>Your Upcoming Classes</Text>

          <FlatList
            data={[...(Array.isArray(upcomingClass) ? upcomingClass : [])]} 
            horizontal={true}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) =>
              item.class_id?.toString() || `more-${index}`
            }
            renderItem={({ item }) =>(
              <View style={[styles.cardContainer, {width:cardWidth}]}>
                <View style={styles.topSection}>
                  <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.class_name}</Text>

                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={20} color="white" />
                      <Text style={styles.detailText}> {item.start_time.slice(0,-3)} - {item.end_time.slice(0,-3)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="people" size={18} color="white" />
                      <Text style={item.participants==item.max_participants? styles.redText: styles.yellowText}>  {item.participants}/{item.max_participants}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="person-circle-outline" size={18} color="white" />
                      <Text style={styles.detailText}> {item.name}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={18} color="white" />
                      <Text style={styles.detailText}> {new Date(item.schedule_date).toLocaleDateString('en-GB')}</Text>
                    </View>
                  </View>
                  <Image source={{ uri: `${API_BASE_URL}/uploads/${item.class_image}`}} style={styles.cardImage} />
                </View>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {setClassId(item.class_id); setShowCancelClass(true);}}
                  >
                    <Text style={styles.buttonText}>Cancel Class</Text>
                  </TouchableOpacity>
                </View>
              </View>
              )}
          />
          
        </View>
        {/* History Section */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>History</Text>
          {classHistory && classHistory.length >0 ? (
            classHistory.map((item, index) => (
              <View key={item.class_id} style={styles.historyCard}>
                <Image source={{ uri: `${API_BASE_URL}/uploads/${item.class_image}`}} style={styles.historyImage} />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitleText}>{item.class_name}</Text>
                  <View style={styles.detailRow}>
                    <FontAwesome name="calendar" size={18} color="white" />
                    <Text style={styles.detailText}> {new Date(item.schedule_date).toLocaleDateString('en-GB')}</Text>
                  </View>
                  <View style={styles.coachInfo}>
                    <Image source={{ uri: `${API_BASE_URL}/uploads/${item.profile_picture}`}} style={styles.coachImage} />
                    <View>
                      <Text style={styles.coachName}>{item.name}</Text>
                      <Text style={styles.coachContact}>{item.email}</Text>
                      <Text style={styles.coachContact}>{item.contact_number}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={item.rated == 1 ? styles.ratedButton : styles.rateButton}
                  disabled={item.rated == 1? true: false}
                  onPress={() => {
                    setSelectedClass(item);
                    setModalVisible(true);
                  }}
                >
                  <Text
                    style={
                      item.rated == 1 ? styles.ratedButtonText : styles.rateButtonText
                    }
                  >
                    {item.rated == 1 ? "Rated" : "Rate"}
                  </Text>
                </TouchableOpacity>
                {selectedClass && (
                  <RatingPopup
                    visible={modalVisible}
                    onClose={() => setClose()}
                    classData={selectedClass}
                  />
                )}
              </View>
            ))
          ) : (
            <View>
              <Text style={styles.noneText}>No Class History</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Cancel Class popup */}
      <Modal visible={showCancelClass} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCancelClass(false)}
            >
              <Ionicons name="close" size={26} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>
              Are you sure you want to cancel this class?
            </Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', width:"90%"}}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowCancelClass(false);
                }}
              >
                <Text style={styles.viewMoreText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => {
                  setShowCancelClass(false);
                  cancelClass(userId, classId);
                  navigation.navigate("MemberDashboard");
                }}
              >
                <Text style={styles.viewMoreText}>Confirm</Text>
              </TouchableOpacity>
            </View>
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
    marginBottom: 30, 
    backgroundColor: "#B3A0FF",
    padding: 20,
  },
  CardTitle: {
    fontSize: 25,
    color: "black",
    fontWeight: "400",
    marginBottom:20,    
    textAlign: "center",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#232323",
    borderRadius: 20,
    overflow:'hidden',
  },
  infoContainer: {
    backgroundColor: "#232323",
    padding: 15,
    flex: 1,
    width:"60%"
  },
  title: {
    fontSize: 24,
    color: "#E2F163",
    fontWeight: "500",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#FFF",
  },
  redText: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
  yellowText:{
    fontSize: 14,
    color: "#E2F163",
    fontWeight: "bold",
  },
  cardImage: {
    width: "40%",
    height: "100%",
    borderRadius: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15, 
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
    paddingHorizontal: 20,
    paddingVertical:40,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom:20
  },
  viewMoreButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    width:100,
  },
  cancelButton:{
    backgroundColor: "red",
    paddingVertical: 10,
    width:100,
    borderRadius: 10,
    marginTop: 10,
  },
  viewMoreText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign:'center'
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  historyContainer: {
    paddingHorizontal: 20,
  },
  historyTitle: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
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
    marginBottom:10
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
  noneText:{
    color:'white',
    fontSize:16,
  }
};
