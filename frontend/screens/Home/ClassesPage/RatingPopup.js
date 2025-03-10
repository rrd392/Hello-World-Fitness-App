import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import { AirbnbRating } from "react-native-ratings";

const RatingPopup = ({ visible, onClose, classData, onSubmit }) => {
  const [classRating, setClassRating] = useState(0);
  const [coachRating, setCoachRating] = useState(0);
  const [review, setReview] = useState("");
  const handleSubmit = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Rate The Class</Text>
          <View style={styles.card}>
            <Image source={classData.image} style={styles.classImage} />
            <Text style={styles.classTitle}>{classData.title}</Text>
            <AirbnbRating
              count={5}
              defaultRating={classRating}
              size={25}
              showRating={false}
              onFinishRating={(rating) => setClassRating(rating)}
            />
          </View>

          <Text style={styles.title}>Rate The Coach</Text>
          <View style={styles.card}>
            <Image source={require("./coach.jpg")} style={styles.coachImage} />
            <Text style={styles.classTitle}>{classData.coach}</Text>
            <Text style={styles.contact}>{classData.coachEmail}</Text>
            <Text style={styles.contact}>{classData.coachNumber}</Text>
            <AirbnbRating
              count={5}
              defaultRating={coachRating}
              size={25}
              showRating={false}
              onFinishRating={(rating) => setCoachRating(rating)}
            />
          </View>

          <TextInput
            placeholder="Share Your Review Here..."
            style={styles.input}
            placeholderTextColor="#ccc"
            value={review}
            onChangeText={setReview}
            multiline={true}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#9B89FF",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "black",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  classImage: {
    width: 100,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  coachImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  classTitle: {
    fontSize: 25,
    fontWeight: "500",
    color: "#E2F163",
  },
  contact: {
    fontSize: 12,
    color: "#ccc",
  },
  input: {
    height: 100,
    backgroundColor: "#222",
    color: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,

    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default RatingPopup;
