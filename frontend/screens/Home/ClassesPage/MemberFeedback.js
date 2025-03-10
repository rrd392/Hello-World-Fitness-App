import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";
import { Ionicons } from "@expo/vector-icons";

// Dummy data for feedback
const feedbackData = [
  {
    id: "1",
    userName: "EmilyLai",
    email: "emily.lai@example.com",
    userImage: require("./coach.jpg"), // Replace with actual image
    className: "Yoga Flow",
    classRating: 5,
    coachName: "Coach Aaron",
    coachRating: 3,
    feedback:
      "The trainer was very motivating and gave clear instructions. The class was a bit crowded, though.",
    daysAgo: "3 days ago",
  },
  {
    id: "2",
    userName: "JohnDoe",
    email: "john.doe@example.com",
    userImage: require("./coach.jpg"),
    className: "Pilates Core",
    classRating: 4,
    coachName: "Coach Sarah",
    coachRating: 5,
    feedback:
      "The session was well-structured, and I learned a lot. Great experience overall!",
    daysAgo: "5 days ago",
  },
];

const FeedbackCard = ({ item }) => {
  return (
    <View style={styles.card}>
      {/* User Info & Date */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={item.userImage} style={styles.userImage} />
          <View>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        </View>

        <Text style={styles.date}>{item.daysAgo}</Text>
      </View>

      {/* Class & Coach Ratings */}
      <View style={styles.ratingContainer}>
        <View style={styles.ratingRow}>
          <Ionicons name="barbell-outline" size={18} color="white" />
          <Text style={styles.className}>{item.className}</Text>
          <Rating
            type="star"
            imageSize={15}
            readonly
            startingValue={item.classRating}
            tintColor="#4A4A4A"
          />
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="headset-outline" size={18} color="white" />
          <Text style={styles.coachName}>{item.coachName}</Text>
          <Rating
            type="star"
            imageSize={15}
            readonly
            startingValue={item.coachRating}
            tintColor="#4A4A4A"
          />
        </View>
      </View>

      {/* Feedback Text */}
      <Text style={styles.feedback}>{item.feedback}</Text>
    </View>
  );
};

const MemberFeedback = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Member Feedback</Text>
      <FlatList
        data={feedbackData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedbackCard item={item} />}
      />
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
    marginBottom: 10,
    textAlign: "center",
    textDecorationLine: "underline",
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
