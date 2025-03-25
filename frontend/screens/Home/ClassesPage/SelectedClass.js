import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import MemberFeedback from "./MemberFeedback";
import { KeyboardAvoidingView, Platform } from "react-native";
import HeaderVer2 from "../../HeaderVer2";
import API_BASE_URL from "../../../env";
import { getUserId } from "../../getUserId";

function SelectedClass() {
  const navigation = useNavigation();
  const route = useRoute();
  const { classData } = route.params || {};

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
      }else{
        Alert.alert(data.message);
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#212020" }}>
      <HeaderVer2 title="Classes" onPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          data={classData ? [classData] : []}
          keyExtractor={(item) => item.class_id}
          renderItem={({ item }) => (
            <View style={styles.container}>
              <View style={styles.pageContent}>
                <Image source={{uri: `${API_BASE_URL}/uploads/${item.class_image}`}} style={styles.classImage}/>
                <View style={styles.classCard}>
                  <View style={styles.headerRow}>
                    <Text style={styles.classTitle}>{item.class_name}</Text>
                    <View style={styles.iconRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="white"
                      />
                      <Text style={styles.classDate}>{new Date(item.schedule_date).toLocaleDateString("en-GB")}</Text>
                    </View>
                  </View>
                  <Text style={styles.classDescription}>
                    {item.description}
                  </Text>
                  <View style={styles.classInfo}>
                    <View style={{ flex: 1, maxWidth: "65%", gap: 5 }}>
                      <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={18} color="white" />
                        <Text style={styles.classTime}>{item.start_time.slice(0,-3)} - {item.end_time.slice(0,-3)}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons
                          name="person-outline"
                          size={18}
                          color="white"
                        />
                        <Text style={classFull? styles.fullSlots: styles.nonFullSlots}>{item.participants}/{item.max_participants}</Text>
                      </View>
                    </View>

                    <View style={styles.coachCard}>
                      <View style={styles.coachProfile}>
                        <Image source={{uri: `${API_BASE_URL}/uploads/${item.profile_picture}`}} style={styles.coachImage}/>
                        <View style={{width:"70%"}}>
                          <Text style={styles.coachName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                          <Text style={styles.coachEmail} numberOfLines={1} ellipsizeMode="tail">
                            {item.email}
                          </Text>
                          <Text style={styles.coachNumber} numberOfLines={1} ellipsizeMode="tail">
                            {item.contact_number}
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
                      setFailModalVisible(true); 
                    } else {
                      addClass(classData.class_id, userId); 
                    }
                  }}
                >
                  <Text style={styles.signUpText}>Sign Up For Class</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: "100%" }}>
                <MemberFeedback {...item}/>
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
                      onPress={() => {setSuccessModalVisible(false); navigation.navigate("Classes");}}
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
    marginBottom:10
  },
  iconRow: { flexDirection: "row", gap: 5 },
  
  pageContent: {
    alignItems: "center",
    gap: 10,
    padding: 20,
    backgroundColor: "#B3A0FF",
  },
  classInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", 
    gap: 10, 
  },

  classImage: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    marginBottom: 10,
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
  fullSlots: { fontSize: 16, color: "red", fontWeight: "bold" },
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
  coachName: { fontSize: 18, fontWeight: "500", maxWidth:"100%"},
  coachEmail: { fontSize: 12, color: "#444" },
  coachNumber: { fontSize: 12, color: "#444" },

  signUpButton: {
    backgroundColor: "#000",
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
    backgroundColor: "#212020",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  viewMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default SelectedClass;
