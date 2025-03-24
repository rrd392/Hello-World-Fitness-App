import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView, 
  Alert,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../env";


export default function SelectTrainerPage({ route }) {
  const navigation = useNavigation();
  
  const { userId: member_id } = route?.params || {};

  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);


  if (!member_id) {
    Alert.alert("Error", "TrainerSelectionPage Member ID is missing.");
    navigation.goBack();
    return null;
  }

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/trainers`);
  
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format (not JSON)");
      }
  
      const data = await response.json();
      setTrainers(data.trainers || []);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      Alert.alert("Error", error.message);
    }
  };

  const handleSelectTrainer = async () => {
    if (!selectedTrainer) {
      Alert.alert("Selection Required", "Please select a trainer.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile/selectTrainer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id, trainer_id: selectedTrainer }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Trainer assigned successfully!");
        navigation.navigate("CreatedPage");
      } else {
        Alert.alert("Error", data.message || "Trainer selection failed.");
      }
    } catch (error) {
      console.error("Error selecting trainer:", error);
      Alert.alert("Error", "Network request failed.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.titleHeader}>Create Account</Text>
      </KeyboardAvoidingView>

      <ScrollView style={{paddingHorizontal:20}}>
        <Text style={styles.title}>Select Your Trainer</Text>

        {trainers.map((trainer) => (
          <TouchableOpacity
            key={trainer.user_id}
            style={[
              styles.trainerCard,
              selectedTrainer === trainer.user_id && styles.selectedTrainer
            ]}
            onPress={() => setSelectedTrainer(trainer.user_id)}
          >
            <View style={styles.trainerInfo}>
              <Image source={{ uri: `${API_BASE_URL}/uploads/${trainer.profile_picture}` }} style={styles.trainerImage} />
              <View>
                <Text style={styles.trainerName}>{trainer.name}</Text>
                <Text style={styles.trainerContact}>Gender: {trainer.gender}</Text>
                <Text style={styles.trainerContact}>Email: {trainer.email}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleSelectTrainer}
        >
          <Text style={styles.confirmButtonText}>Confirm Trainer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#232323",
  },
  container: {
    marginTop: 50,
  },
  titleHeader: {
    fontSize: 24,
    color: "#E2F163",
    textAlign: "center",
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    marginTop:40,
  },
  trainerCard: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#E2F163",
  },
  selectedTrainer: {
    backgroundColor: "#E2F163",
    borderColor: "#000",
  },
  trainerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  trainerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  trainerContact: {
    fontSize: 14,
    color: "#666",
  },
  confirmButton: {
    backgroundColor: "#E2F163",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});
