import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";
import { Ionicons } from "@expo/vector-icons";
import API_BASE_URL from "../../../env";

const FeedbackCard = ({ item }) => {
  return (
    <View style={styles.card}>
      {/* User Info & Date */}
      <View style={styles.header}>
        <Image source={{ uri: `${API_BASE_URL}/uploads/${item.profile_picture}`}} style={styles.userImage} />
        <View>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
        <Text style={styles.date}>{new Date(item.feedback_date).toLocaleDateString('en-GB')}</Text>
      </View>

      {/* Class & Coach Ratings */}
      <View style={styles.ratingContainer}>
        <View style={styles.ratingRow}>
          <Ionicons name="barbell-outline" size={18} color="white" />
          <Text style={styles.className}> {item.class_name} </Text>
          <Rating
            type="star"
            imageSize={15}
            readonly
            startingValue={item.class_rating}
            tintColor="#4A4A4A"
          />
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="headset-outline" size={18} color="white" />
          <Text style={styles.coachName}> {item.trainerName} </Text>
          <Rating
            type="star"
            imageSize={15}
            readonly
            startingValue={item.trainer_rating}
            tintColor="#4A4A4A"
          />
        </View>
      </View>

      {/* Feedback Text */}
      <Text style={styles.feedback}>{item.comments}</Text>
    </View>
  );
};

const MemberReviews = ({feedbackData}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Member Feedback</Text>
      <FlatList
        data={feedbackData}
        keyExtractor={(item) => item.feedback_id}
        renderItem={({ item }) => <FeedbackCard item={item} />}
        nestedScrollEnabled={true}
      />
    </View>
  );
};

export default MemberReviews;

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
    marginBottom: 20,
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
