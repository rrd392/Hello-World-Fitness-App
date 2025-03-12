import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PaymentConfirmation = ({ route }) => {
  const navigation = useNavigation();
  const { plan, transactionId } = route.params;

  const transactionDetails = {
    transactionId: transactionId || 'GymX-789012',
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    paymentMethod: 'Credit Card **** 4242',
    amount: plan.price,
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.successContainer}>
            <LinearGradient
              colors={['#E2F163', '#B6D83C']}
              style={styles.successCircle}
            >
              <Ionicons name="checkmark" size={48} color="#000" />
            </LinearGradient>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successSubtitle}>
              Thank you for choosing HelloworldFitness
            </Text>
          </View>

          <LinearGradient colors={['#1A1A1A', '#2D2D2D']} style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Membership Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Plan Name</Text>
              <Text style={styles.detailValue}>{plan.plan_name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>
                {plan.duration} Month{plan.duration > 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.separator} />

            <Text style={styles.detailsTitle}>Transaction Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID</Text>
              <Text style={styles.detailValue}>{transactionDetails.transactionId}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{transactionDetails.date}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method</Text>
              <Text style={styles.detailValue}>{transactionDetails.paymentMethod}</Text>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalAmount}>RM{transactionDetails.amount}</Text>
            </View>
          </LinearGradient>

          <Text style={styles.noteText}>
            Your membership will be activated immediately. A confirmation email
            has been sent to your registered email address.
          </Text>

          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => navigation.navigate('MemberDashboard')}
          >
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
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
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    color: '#E2F163',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successSubtitle: {
    color: '#FFF',
    fontSize: 16,
    opacity: 0.8,
  },
  detailsCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  detailsTitle: {
    color: '#E2F163',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailLabel: {
    color: '#AAA',
    fontSize: 14,
  },
  detailValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  totalLabel: {
    color: '#E2F163',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#E2F163',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteText: {
    color: '#888',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  homeButton: {
    backgroundColor: '#E2F163',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentConfirmation;