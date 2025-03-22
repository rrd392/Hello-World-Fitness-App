import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Alert
} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import API_BASE_URL from "../../../env";
import { getUserId } from "../../getUserId";
import { useNavigation } from "@react-navigation/native";

const RatingPopup = ({ visible, onClose, classData }) => {
  const navigation = useNavigation();
  const [classRating, setClassRating] = useState(0);
  const [coachRating, setCoachRating] = useState(0);
  const [review, setReview] = useState("");
  const [userId, setUserId] = useState("");
  
  useEffect(() => {
    async function fetchUserId() {
        const token = await getUserId();
        setUserId(token.id);
    }
    fetchUserId();
  }, []);

  const handleSubmit = async (classData, userId, classRating, coachRating, review) => {
    
    if (!userId || !classData?.user_id || !classData?.class_id || !coachRating || !classRating || !review.trim()) {
      Alert.alert("Error", "Please fill in all fields before submitting.");
      return; 
    }

    const formData = {
      user_id: userId,
      trainer_id: classData.user_id,
      class_id: classData.class_id,
      coach_rating: coachRating,
      class_rating: classRating,
      review: review
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/classes/rateClass`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert("Rating submitted!");
        onClose();
        navigation.navigate("YourClasses");
      }
    } catch (error) {
      console.error("Error fetching upcoming class data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    } finally {
    }
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
            <Image source={{ uri: `${API_BASE_URL}/uploads/${classData.class_image}`}} style={styles.classImage} />
            <Text style={styles.classTitle}>{classData.class_name}</Text>
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
            <Image source={{ uri: `${API_BASE_URL}/uploads/${classData.profile_picture}`}} style={styles.coachImage} />
            <Text style={styles.classTitle}>{classData.name}</Text>
            <Text style={styles.contact}>{classData.email}</Text>
            <Text style={styles.contact}>{classData.contact_number}</Text>
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
          <TouchableOpacity style={styles.submitButton} onPress={() => handleSubmit(classData, userId, classRating, coachRating, review)}>
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
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "black",
    fontSize: 20,
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
    fontSize:18
  },
});

export default RatingPopup;
