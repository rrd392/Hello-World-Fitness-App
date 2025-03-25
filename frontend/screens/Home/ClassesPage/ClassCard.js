import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../../env";
import { getUserId } from "../../getUserId";

function ClassCard({ classData, refreshClasses }) {
  const navigation = useNavigation();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failModalVisible, setFailModalVisible] = useState(false);
  const [classFull, setClassFull] = useState(false); 
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (classData.participants === classData.max_participants) {
      setClassFull(true);
    } else {
      setClassFull(false);
    }
  }, [classData.participants, classData.max_participants]); 

  useEffect(() => {
    async function fetchUserId() {
      const token = await getUserId();
      setUserId(token.id);
    }
    fetchUserId();
  }, []);

  const addClass = async (class_id, user_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/classes/addUserClass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class_id, user_id })
      });
  
      const data = await response.json();
  
      if (data.success) {
        setSuccessModalVisible(true); 
        refreshClasses();
      }else{
        Alert.alert(data.message);
      }
    } catch (error) {
      console.error("Error adding class data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.cardContainer}>
        {/* Class Info & Image */}
        <View style={styles.topSection}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{classData.class_name}</Text>

            <View style={styles.detailRow}>
              <Ionicons name="time" size={20} color="white" />
              <Text style={styles.detailText}> {classData.start_time.slice(0, -3)} - {classData.end_time.slice(0, -3)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="people" size={18} color="white" />
              <Text style={classFull? styles.redText : styles.yellowText}>  {classData.participants?? 0}/{classData.max_participants}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="person-circle-outline" size={18} color="white" />
              <Text style={styles.detailText} numberOfLines={1} ellipsizeMode="tail"> {classData.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={18} color="white" />
              <Text style={styles.detailText}> {new Date(classData.schedule_date).toLocaleDateString("en-GB")}</Text>
            </View>
          </View>

          <Image
            source={{
              uri: `${API_BASE_URL}/uploads/${classData.class_image}`,
            }}
            style={styles.cardImage}
          />
        </View>
      </View>

      {/* Button Section*/}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (classFull) {
              setFailModalVisible(true);
            } else {
              addClass(classData.class_id, userId);
            }
          }}
        >
          <Text style={styles.buttonText}>Attend</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("SelectedClass", { classData })
          }
        >
          <Text style={styles.buttonText}>More</Text>
        </TouchableOpacity>
      </View>

      {/* Class sign up status */}
      <Modal visible={successModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Ionicons name="close" size={26} color="black" />
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
      <Modal visible={failModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setFailModalVisible(false)}
            >
              <Ionicons name="close" size={26} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>Sorry, Class is Full.</Text>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => {
                setFailModalVisible(false);
                navigation.navigate("Classes");
              }}
            >
              <Text style={styles.viewMoreText}>View More Classes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignSelf: "center",
    marginBottom: 40, 
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
    width:"50%"
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
  redText: {
    color: "red",
    fontSize: 16,
  },
  yellowText:{
    color: "#E2F163",
    fontSize: 16,
  },
  cardImage: {
    width: "45%",
    height: "100%",
    borderRadius: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15, 
  },
  button: {
    backgroundColor: "#212020",
    paddingVertical: 10,
    width:150,
    borderRadius: 25,
    marginHorizontal: 20,
  },
  buttonText: {
    color: "#E2F163",
    fontSize: 16,
    fontWeight: "bold",
    textAlign:'center'
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
    marginBottom:20,
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

export default ClassCard;
