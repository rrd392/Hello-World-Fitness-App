import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, StyleSheet, 
  SafeAreaView, KeyboardAvoidingView, Platform, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import API_BASE_URL from "../../env";

const MembershipRenew = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!params?.plan?.membership_id || !params?.userId) {
      Alert.alert("Invalid Request", "Please select a membership plan first.");
      navigation.goBack();
    }
  }, []);

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "card-outline" },
    { id: "ewallet", name: "E-Wallet", icon: "wallet-outline" }
  ];

  const handlePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const { plan, userId } = params;
      const payment_date = new Date().toISOString().split('T')[0];

      const paymentData = {
        user_id: Number(userId),
        membership_id: Number(plan.membership_id),
        amount: parseFloat(plan.price),
        description: plan.plan_name,
        paymentMethod: paymentMethods.find(m => m.id === selectedPayment).name,
        payment_date,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/profile/update-membership`,
        paymentData,
        { timeout: 10000 } 
        
      );

      if (response.data.success) {
        if(plan.membership_id == 2 || plan.membership_id == 4){
          navigation.replace("TrainerSelection", {
            userId,
            plan,
            paymentMethod: paymentData.paymentMethod,
            totalPaid: plan.price,
            payment_date,
            endDate: response.data.endDate 
          });
        }else{
          navigation.replace("PaymentConfirmation", {
            userId,
            plan,
            paymentMethod: paymentData.paymentMethod,
            totalPaid: plan.price,
            payment_date,
            endDate: response.data.endDate 
          });
        }
      } else {
        Alert.alert("Payment Failed", response.data.message || "Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", {
        message: error.message,
        responseData: error.response?.data, 
        responseStatus: error.response?.status, 
        config: error.config
      });
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || "Payment processing failed";
        
      Alert.alert("Payment Error", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!params?.plan || !params?.userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Invalid request parameters</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
          <Text style={styles.buttonText}>Return to Plans</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { plan } = params;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#E2F163" />
            </TouchableOpacity>
            <Text style={styles.title}>Complete Payment</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Plan Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.planName}>{plan.plan_name}</Text>
            <Text style={styles.price}>RM{plan.price.toFixed(2)}</Text>
            <View style={styles.divider} />
            <Text style={styles.duration}>
              {plan.duration} Month{plan.duration > 1 ? 's' : ''} Membership
            </Text>
            <Text style={styles.description}>{plan.description}</Text>
          </View>

          {/* Payment Methods */}
          <Text style={styles.sectionHeader}>Select Payment Method</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedPayment === method.id && styles.selectedMethod
                ]}
                onPress={() => setSelectedPayment(method.id)}
                disabled={isProcessing}
              >
                <Ionicons 
                  name={method.icon} 
                  size={24} 
                  color="#E2F163" 
                  style={styles.methodIcon} 
                />
                <Text style={styles.methodLabel}>{method.name}</Text>
                <Ionicons 
                  name={selectedPayment === method.id 
                    ? "radio-button-on" 
                    : "radio-button-off"} 
                  size={24} 
                  color="#E2F163" 
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Payment Button */}
        <View style={styles.footer}>
        <TouchableOpacity 
           style={[styles.payButton, isProcessing && styles.disabledButton]}
            onPress={handlePayment}
            disabled={isProcessing}
        >
          <Text style={styles.payButtonText}>
            {isProcessing ? "Processing..." : "Confirm Payment"}
          </Text>
          <Text style={styles.payButtonAmount}>RM{plan.price.toFixed(2)}</Text>
             {isProcessing && (
          <ActivityIndicator size="small" color="#000" style={styles.spinner} />
           )}
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginTop: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#E2F163',
    fontSize: 22,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  planName: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  price: {
    color: '#E2F163',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 15,
  },
  duration: {
    color: '#E2F163',
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    color: '#AAA',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    color: '#E2F163',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  paymentMethods: {
    gap: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 16,
  },
  selectedMethod: {
    borderWidth: 1,
    borderColor: '#E2F163',
  },
  methodIcon: {
    marginRight: 15,
  },
  methodLabel: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#333',
  },
  payButton: {
    backgroundColor: '#E2F163',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  payButtonAmount: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  button: {
    backgroundColor: '#E2F163',
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
  },
});

export default MembershipRenew;