import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const MembershipRenew = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const plan = params?.plan || {
    membership_id: 2,
    plan_name: 'Premium Monthly',
    price: 50.00,
    duration: 1,
    description: 'Includes all Standard features, plus a dedicated personal trainer'
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
    { id: 'ewallet', name: 'E-Wallet', icon: 'wallet-outline' }
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#E2F163" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Renew Membership</Text>
          <View style={{ width: 28 }} />
        </View>
        
        <View style={styles.renewalCard}>
        <Text style={styles.renewalText}>Renewing: {plan.name}</Text>
        <Text style={styles.renewalPrice}>RM{plan.price}</Text>
        <Text style={styles.renewalDuration}>
          {plan.duration} Month{plan.duration > 1 ? 's' : ''}
        </Text>
      </View>

        {/* Plan Overview */}
        <LinearGradient colors={['#1A1A1A', '#2D2D2D']} style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{plan.plan_name}</Text>
            {plan.plan_name.includes('Premium') && (
              <Ionicons name="diamond" size={20} color="#E2F163" />
            )}
          </View>
          <Text style={styles.planPrice}>RM{plan.price.toFixed(2)}</Text>
          <Text style={styles.planDuration}>
            {plan.duration} Month{plan.duration > 1 ? 's' : ''}
          </Text>
          <Text style={styles.planDescription}>{plan.description}</Text>
        </LinearGradient>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <ScrollView contentContainerStyle={styles.paymentMethods}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedPayment === method.id && styles.selectedMethod
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <Ionicons 
                name={method.icon} 
                size={24} 
                color="#E2F163" 
                style={styles.methodIcon}
              />
              <Text style={styles.methodName}>{method.name}</Text>
              <Ionicons
                name={selectedPayment === method.id ? "radio-button-on" : "radio-button-off"}
                size={24}
                color="#E2F163"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Confirm Button with padding */}
        <View style={styles.confirmContainer}>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={() => {/* Handle payment */}}
          >
            <Text style={styles.confirmText}>Confirm Payment</Text>
            <Text style={styles.confirmPrice}>RM{plan.price.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    padding: 16,
    paddingBottom: 40 // Bottom padding for navigation
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    color: '#E2F163',
    fontSize: 20,
    fontWeight: 'bold',
  },
  planCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 12,
  },
  planPrice: {
    color: '#E2F163',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planDuration: {
    color: '#D2D2D2',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  planDescription: {
    color: '#D2D2D2',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    color: '#E2F163',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  paymentMethods: {
    paddingHorizontal: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  selectedMethod: {
    borderWidth: 1,
    borderColor: '#E2F163',
  },
  methodIcon: {
    marginRight: 16,
  },
  methodName: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  confirmContainer: {
    paddingTop: 24,
    paddingBottom: 40 // Extra bottom padding
  },
  confirmButton: {
    backgroundColor: '#E2F163',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  confirmText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmPrice: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MembershipRenew;