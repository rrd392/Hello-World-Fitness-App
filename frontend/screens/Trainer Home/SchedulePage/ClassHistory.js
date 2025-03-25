import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../../env";
import { getUserId } from "../../getUserId";
import HeaderVer4 from "../../HeaderVer4";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

function ClassHistory() {
  const navigation = useNavigation();
  const [userId, setUserId] = useState("");
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
      fetchClassHistory();
    }
  }, [userId]);

  const fetchClassHistory = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/trainer-class/displayClassHistory/${userId}`,
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

  return (
    <SafeAreaView style={styles.container}>
      <HeaderVer4 title="Back" onPress={() => navigation.goBack()} />
      <Text style={styles.sectionTitle}>Class History</Text>
      <ScrollView style={styles.classCards}>
          {classHistory.length > 0? (
            classHistory.map((history, index)=>
            <View key={index} style={styles.wrapper}>
            <View style={styles.cardContainer}>
              {/* Class Info & Image */}
              <View style={styles.topSection}>
                <View style={styles.infoContainer}>
                  <Text style={styles.title}>{history.class_name}</Text>

                  <View style={styles.detailRow}>
                    <MaterialIcons name="schedule" size={20} color="white" />
                    <Text style={styles.detailText}> {history.start_time.slice(0,-3)} - {history.end_time.slice(0,-3)}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <FontAwesome name="user" size={18} color="white" />
                    <Text style={styles.slotText}>
                      {" "}
                      <Text style={history.participants==history.max_participants? styles.redText: styles.yellowText}>  {history.participants}/{history.max_participants}</Text>
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <FontAwesome name="headphones" size={18} color="white" />
                    <Text style={styles.detailText}>  {history.name}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <FontAwesome name="calendar" size={18} color="white" />
                    <Text style={styles.detailText}>  {new Date(history.schedule_date).toLocaleDateString('en-GB')}</Text>
                  </View>
                </View>
                <Image source={{ uri: `${API_BASE_URL}/uploads/${history.class_image}`}} style={styles.cardImage} />
              </View>
            </View>

            {/* Button Section*/}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("ClassReport", { classData: history })
                }
              >
                <Text style={styles.buttonText}>View Feedback</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("ClassPastAttendance", { classData: history })
                }
              >
                <Text style={styles.buttonText}>More</Text>
              </TouchableOpacity>
            </View>
          </View>
        )):(
          <View style={styles.wrapper}>
            <Text style={styles.noClassText}>No class history available.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor:"#212020" },
  sectionTitle: {
    paddingHorizontal: 20,
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginBottom:20,
    marginTop:20
  },
  classCards: {  backgroundColor: "#B3A0FF", width: "100%", padding:20 },
  wrapper: {
    width: "100%",
    alignSelf: "center",
    marginBottom: 20, 
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

export default ClassHistory;
