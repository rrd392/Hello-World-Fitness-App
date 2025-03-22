import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ScrollView, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSignup } from "../../context/SignupForm";
import API_BASE_URL from "../../env";

export default function SignUpPageStep4() {
  const navigation = useNavigation();
  const { signupData, setSignupData } = useSignup();
  const [plans, setPlans] = useState([]);
  const selectedPlan = plans.find(plan => plan.membership_id === signupData.membershipPlan);


  useEffect(() => {
    fetchMembershipPlan();
  }, []); 

  const fetchMembershipPlan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/signup/displayMembership`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
      }

      const data = await response.json();

      if (data) {
        if (Array.isArray(data.results)) {
          setPlans(data.results);
        } else if (data.results) {
          setPlans([data.results]); 
        } else {
          setPlans([]); 
        }
      }
    } catch (error) {
      console.error("Error fetching membership plan data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    }
  };

  const handlePayment = async () => {
    if (!signupData.membershipPlan) {
      Alert.alert("Missing Information", "Please select a membership plan.");
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/signup/signupProcess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        //console.log("User ID:", data.user_id);
        if (signupData.membershipPlan === 2 || signupData.membershipPlan === 4) {
          navigation.navigate("TrainerSelection", { userId: data.user_id });
        } else {
          navigation.navigate("CreatedPage");
        }
      } else {
        Alert.alert(data.message);
      }
    } catch (error) {
      console.error("Error adding user data:", error);
      Alert.alert("Error", error.message || "Network request failed");
    }
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

      <ScrollView contentContainerStyle={styles.plansContainer}>
        <Text style={styles.mainTitle}>Select Your Membership Plan</Text>
        <Text style={styles.subtitle}>
          Choose the perfect membership plan for your fitness journey. Select a plan that fits your goals and lifestyle.
        </Text>

        <View style={styles.formContainer}>
          {plans.map((plan) => (              
            <View key={plan.membership_id} style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.planCard,
                  signupData.membershipPlan === plan.membership_id && styles.selectedPlan
                ]}
                onPress={() => setSignupData({ ...signupData, membershipPlan: plan.membership_id })}
              >
                <Text style={styles.planTypeHeader}>{plan.plan_name}</Text>
                <Text style={styles.planDuration}>{plan.duration} {plan.duration === 1 ? "month" : "months"}</Text>
                <Text style={styles.planPrice}>RM {plan.price.toFixed(2)}</Text>
                <Text style={styles.billingText}>Billed {plan.duration === 1 ? "Monthly" : plan.duration === 12 ? "Annually" : `Every ${plan.duration} Months`}</Text>
                
              </TouchableOpacity>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.payButton} 
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>Pay RM{plans.find(plan => plan.membership_id === signupData.membershipPlan)?.price ?? "0.00"}</Text>

        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop:30,
    paddingBottom:10,
    width:"100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap:'wrap',
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
    justifyContent: "center",   
    alignItems: "center",       
    paddingVertical: 20,
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
    width:"48%",
    marginBottom: 20,
    flexWrap:'wrap',
    justifyContent: "center", 
  },
  planCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    width: "100%",
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
  billingText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: "#E2F163",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 20,
    width:300
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});