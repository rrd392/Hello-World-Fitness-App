import React, {useEffect, useState} from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../../env";

const FeedbackCard = ({ feedback, classData }) => {

  return (
    <View style={styles.card}>
      {/* User Info & Date */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={{ uri: `${API_BASE_URL}/uploads/${feedback.profile_picture}?t=${Date.now()}`}} style={styles.userImage}/>
          <View>
            <Text style={styles.userName}>{feedback.username}</Text>
            <Text style={styles.email}>{feedback.email}</Text>
          </View>
        </View>

        <Text style={styles.date}>{new Date(feedback.feedback_date).toLocaleDateString('en-GB')}</Text>
      </View>

      {/* Class & Coach Ratings */}
      <View style={styles.ratingContainer}>
        <View style={styles.ratingRow}>
          <Ionicons name="barbell-outline" size={18} color="white" />
          <Text style={styles.className}>{classData.class_name}</Text>
          <Rating
            type="star"
            imageSize={15}
            readonly
            startingValue={feedback.class_rating}
            tintColor="#4A4A4A"
          />
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="person-circle-outline" size={18} color="white" />
          <Text style={styles.coachName}>Coach {classData.name}</Text>
          <Rating
            type="star"
            imageSize={15}
            readonly
            startingValue={feedback.trainer_rating}
            tintColor="#4A4A4A"
          />
        </View>
      </View>

      {/* Feedback Text */}
      <Text style={styles.feedback}>{feedback.comments}</Text>
    </View>
  );
};

function MemberFeedback(classData) {

  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    if(classData.class_id){
      fetchFeedback();
    }
  }, [classData.class_id]);
  
  const fetchFeedback = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/classes/displayFeedback/${classData.class_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
      }
  
      const data = await response.json();
  
      if (data) {
        setFeedbackData(data.results);
      }
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Member Feedback</Text>
      {feedbackData && feedbackData.length>0 ? (
        <FlatList
        data={feedbackData}
        keyExtractor={(item) => item.feedback_id}
        renderItem={({ item }) => <FeedbackCard feedback={item} classData = {classData}/>}
      />
      ):(
        <View>
          <Text style={{color:'#fff', fontSize:16, fontWeight:500, marginTop:20, textAlign:'center'}}>No feedback yet.</Text>
        </View>
      )}
    </View>
  );
};

export default MemberFeedback;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#4A4A4A",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  email: {
    fontSize: 12,
    color: "#CCCCCC",
  },
  date: {
    fontSize: 12,
    color: "#CCCCCC",
  },
  ratingContainer: {
    marginVertical: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "transparent",
  },
  className: {
    color: "white",
    fontWeight: "bold",
  },
  coachName: {
    color: "white",
    fontWeight: "bold",
  },
  feedback: {
    color: "white",
    marginTop: 8,
  },
});