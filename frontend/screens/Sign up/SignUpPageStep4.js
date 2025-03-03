import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpPageStep4() {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      type: "Standard",
      options: [
        { 
          id: "standard-monthly",
          duration: "Monthly", 
          price: "RM30.00", 
          billing: "Billed Monthly",
        },
        { 
          id: "standard-yearly",
          duration: "Yearly", 
          price: "RM300.00", 
          billing: "Billed Annually", 
          savings: "SAVE 16.67%",
        }
      ]
    },
    {
      type: "Premium",
      options: [
        { 
          id: "premium-monthly",
          duration: "Monthly", 
          price: "RM50.00", 
          billing: "Billed Monthly",

        },
        { 
          id: "premium-yearly",
          duration: "Yearly", 
          price: "RM500.00", 
          billing: "Billed Annually", 
          savings: "SAVE 16.67%",
        }
      ]
    }
  ];

  const handlePayment = () => {
    if (!selectedPlan) {
      alert("Please select a membership plan before proceeding.");
      return;
    }
    navigation.navigate("CreatedPage");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={26} color="#E2F163" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
      </View>

      <Text style={styles.mainTitle}>Select Your Membership Plan</Text>
      <Text style={styles.subtitle}>
        Choose the perfect membership plan for your fitness journey. Select a plan that fits your goals and lifestyle.
      </Text>

      <View style={styles.formContainer}>
        <ScrollView contentContainerStyle={styles.plansContainer}>
          {plans.map((planGroup) => (
            <View key={planGroup.type} style={styles.planGroupContainer}>
              
              <View style={styles.optionsRow}>
                {planGroup.options.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.planCard,
                      selectedPlan?.id === option.id && styles.selectedPlan
                    ]}
                    onPress={() => setSelectedPlan(option)}
                  >
                    <Text style={styles.planTypeHeader}>{planGroup.type}</Text>
                    <Text style={styles.planDuration}>{option.duration}</Text>
                    <Text style={styles.planPrice}>{option.price}</Text>

                    {option.savings && (
                      <Text style={styles.savingsBadge}>{option.savings}</Text>
                    )}
                    <Text style={styles.billingText}>{option.billing}</Text>
                    
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity 
        style={styles.payButton} 
        onPress={handlePayment}
        
      >
        <Text style={styles.payButtonText}>Pay {selectedPlan?.price}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E2F163",
    textAlign: "center",
    flex: 1,
  },
  formContainer: {
    backgroundColor: "#B3A0FF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    flex: 1,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  plansContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  planGroupContainer: {
    marginBottom: 30,
  },
  planTypeHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  planCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    width: "48%",
    borderWidth: 2,
    borderColor: "#E2F163",
  },
  selectedPlan: {
    backgroundColor: "#E2F163",
    borderColor: "#000",
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
  },
  planDuration: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  savingsBadge: {
    fontSize: 12,
    color: "black",
    backgroundColor:"#4CAF50",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    borderRadius:50,
  },
  billingText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  featuresBox: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    padding: 10,
  },
  featureText: {
    fontSize: 12,
    color: "#000",
    marginBottom: 3,
  },
  payButton: {
    backgroundColor: "#E2F163",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 20,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});