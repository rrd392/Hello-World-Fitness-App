import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const MembershipRenew = () => {
  const navigation = useNavigation();
  const { params } = useRoute();

  if (!params?.plan) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No plan selected. Please go back and choose a plan.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const plan = params.plan;
  const [selectedPayment, setSelectedPayment] = useState("card");

  const paymentMethods = [
    { id: "card", name: "Credit/Debit Card", icon: "card-outline" },
    { id: "ewallet", name: "E-Wallet", icon: "wallet-outline" }
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent} 
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#E2F163" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Renew Membership</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Plan Details */}
          <View style={styles.planCard}>
            <Text style={styles.planName}>{plan.plan_name}</Text>
            <Text style={styles.planPrice}>RM{plan.price.toFixed(2)}</Text>
            <Text style={styles.planDescription}>{plan.description}</Text>
          </View>

          {/* Payment Methods */}
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          <ScrollView contentContainerStyle={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[styles.methodCard, selectedPayment === method.id && styles.selectedMethod]}
                onPress={() => setSelectedPayment(method.id)}
              >
                <Ionicons name={method.icon} size={24} color="#E2F163" style={styles.methodIcon} />
                <Text style={styles.methodName}>{method.name}</Text>
                <Ionicons name={selectedPayment === method.id ? "radio-button-on" : "radio-button-off"} size={24} color="#E2F163" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>

        {/* Confirm Button - Moved Above Keyboard */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={() => navigation.navigate("PaymentConfirmation", { plan })}
          >
        <Text style={styles.confirmText}>Confirm Payment</Text>
        <Text style={styles.confirmPrice}>RM{plan.price.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollViewContent: { flexGrow: 1, padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  headerTitle: { color: "#E2F163", fontSize: 20, fontWeight: "bold" },
  planCard: { backgroundColor: "#1A1A1A", padding: 24, borderRadius: 12, marginBottom: 20 },
  planName: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
  planPrice: { color: "#E2F163", fontSize: 28, fontWeight: "bold" },
  planDescription: { color: "#D2D2D2", fontSize: 14 },
  sectionTitle: { color: "#E2F163", fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  paymentMethods: { paddingHorizontal: 16 },
  methodCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#1A1A1A", borderRadius: 12, padding: 20, marginBottom: 12 },
  selectedMethod: { borderWidth: 1, borderColor: "#E2F163" },
  methodIcon: { marginRight: 16 },
  methodName: { color: "#FFF", fontSize: 16, flex: 1 },
  
  /* Fix: Place button above keyboard */
  buttonContainer: { 
    padding: 15, 
    backgroundColor: "#000", 
    alignItems: "center", 
    justifyContent: "center", 
    borderTopWidth: 1, 
    borderColor: "#333" 
  },
  confirmButton: { backgroundColor: "#E2F163", padding: 15, borderRadius: 12, alignItems: "center", width: "100%" },
  confirmText: { color: "#000", fontSize: 18, fontWeight: "bold" },
  confirmPrice: { color: "#000", fontSize: 18, fontWeight: "bold" },
});

export default MembershipRenew;
