import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

function ClassCard({ title, time, coach, date, slots, image }) {
  const navigation = useNavigation();
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failModalVisible, setFailModalVisible] = useState(false);
  const [classFull, setClassFull] = useState(false); // Set to true to show fail modal and alse to show success modal
  return (
    <View style={styles.wrapper}>
      <View style={styles.cardContainer}>
        {/* Class Info & Image */}
        <View style={styles.topSection}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.detailRow}>
              <MaterialIcons name="schedule" size={20} color="white" />
              <Text style={styles.detailText}> {time}</Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome name="user" size={18} color="white" />
              <Text style={styles.slotText}>
                {" "}
                <Text style={styles.redText}>{slots}</Text>
              </Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome name="headphones" size={18} color="white" />
              <Text style={styles.detailText}> {coach}</Text>
            </View>

            <View style={styles.detailRow}>
              <FontAwesome name="calendar" size={18} color="white" />
              <Text style={styles.detailText}> {date}</Text>
            </View>
          </View>

          <Image source={image} style={styles.cardImage} />
        </View>
      </View>

      {/* Button Section*/}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (classFull) {
              setFailModalVisible(true); // Show fail modal if class is full
            } else {
              setSuccessModalVisible(true); // Show success modal if class is not full
            }
          }}
        >
          <Text style={styles.buttonText}>Attend</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("SelectedClass", { className: title })
          }
        >
          <Text style={styles.buttonText}>More</Text>
        </TouchableOpacity>
      </View>
      {/* CLass sign up status */}
      <Modal visible={successModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Ionicons name="close" size={20} color="black" />
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
              <Ionicons name="close" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>Sorry, Class is Full.</Text>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => {
                setModalVisible(false);
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
    marginTop: 20,
    width: "95%",
    alignSelf: "center",
    marginBottom: 40, // Space below card and buttons
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
  cardImage: {
    width: 200,
    height: 165,
    borderRadius: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15, // Adds spacing between card and buttons
  },
  button: {
    backgroundColor: "#212020",
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
    padding: 20,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
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
