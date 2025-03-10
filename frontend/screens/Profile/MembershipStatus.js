import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MembershipStatus = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState(2);
  const [isExpired, setIsExpired] = useState(false);
  const [expiryDate, setExpiryDate] = useState('2025-03-15'); // Replace with actual expiry date from API

  // Check membership status on mount
  useEffect(() => {
    const checkExpiry = () => {
      const currentDate = new Date();
      const expiry = new Date(expiryDate);
      setIsExpired(expiry < currentDate);
    };
    
    checkExpiry();
  }, [expiryDate]);

  const membershipPlans = [
    {
      id: 1,
      name: 'Standard Monthly',
      price: 30,
      features: ['Basic Access', 'Group Classes', 'Locker Rooms'],
      gradient: ['#1A1A1A', '#2D2D2D']
    },
    {
      id: 2,
      name: 'Premium Monthly',
      price: 50,
      features: ['Personal Trainer', 'Priority Booking', 'Spa Access'],
      gradient: ['#2D2D2D', '#4D4D4D']
    },
    {
      id: 3,
      name: 'Standard Yearly',
      price: 300,
      features: ['Annual Discount', '2 Guest Passes', 'Event Access'],
      gradient: ['#1A1A1A', '#2D2D2D']
    },
    {
      id: 4,
      name: 'Premium Yearly',
      price: 500,
      features: ['4 Guest Passes', 'Merch Discounts', 'VIP Events'],
      gradient: ['#2D2D2D', '#4D4D4D']
    }
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#E2F163" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gym Membership</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Current Plan Card */}
        <View style={styles.currentPlanCard}>
          <LinearGradient
            colors={['#1A1A1A', '#2D2D2D']}
            style={styles.currentPlanGradient}
          >
            <Text style={[styles.currentBadge, isExpired && styles.expiredBadge]}>
              {isExpired ? 'EXPIRED' : 'ACTIVE'}
            </Text>
            <Text style={styles.currentPlan}>Premium Monthly</Text>
            <Text style={styles.expiryDate}>
              {isExpired ? 'Expired on ' : 'Renews: '}
              {new Date(expiryDate).toLocaleDateString()}
            </Text>
          </LinearGradient>
        </View>

        {/* Membership Plans */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.plansContainer}
        >
          {membershipPlans.map((plan) => (
            <TouchableOpacity 
              key={plan.id}
              style={styles.planContainer}
              onPress={() => setSelectedPlan(plan.id)}
            >
              <LinearGradient 
                colors={plan.gradient}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.selectedPlan
                ]}
              >


                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  {plan.name.includes('Premium') && (
                    <Ionicons name="diamond" size={16} color="#E2F163" />
                  )}
                </View>
                <Text style={styles.planPrice}>RM{plan.price}</Text>
                <Text style={styles.planDuration}>
                  {plan.duration} Month{plan.duration > 1 ? 's' : ''}
                </Text>
                
                <View style={styles.featuresContainer}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Ionicons name="checkmark" size={14} color="#E2F163" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom CTA Button with padding */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={() => navigation.navigate('MembershipRenew')}
          >
            <Text style={styles.ctaText}>
              {isExpired ? 'Renew Membership' : 'Upgrade Plan'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#000" />
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
    paddingBottom: 40 // Add space for bottom navigation
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
  currentPlanCard: {
    borderRadius: 16,
    marginBottom: 32,
    overflow: 'hidden',
  },
  currentPlanGradient: {
    padding: 24,
  },
  currentBadge: {
    color: '#E2F163',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  expiredBadge: {
    color: '#FF4444',
    fontSize: 12,
    marginBottom: 16,
    width:"16%",
  },
  currentPlan: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  expiryDate: {
    color: '#D2D2D2',
    fontSize: 14,
  },
  planContainer: {
    marginHorizontal: 8,
    width: 280,
  },
  planCard: {
    padding: 20,
    borderRadius: 16,
    height: 320,
    justifyContent: 'space-between',
  },
  selectedPlan: {
    borderWidth: 2,
    borderColor: '#E2F163',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  planPrice: {
    color: '#E2F163',
    fontSize: 32,
    fontWeight: 'bold',
  },
  planDuration: {
    color: '#D2D2D2',
    fontSize: 14,
    marginBottom: 16,
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    color: '#D2D2D2',
    fontSize: 14,
  },
  ctaContainer: {
    paddingTop: 24,
    paddingBottom: 40 // Extra padding for bottom nav
  },
  ctaButton: {
    backgroundColor: '#E2F163',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
  },
  ctaText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MembershipStatus;


// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const MembershipStatus = () => {
//   const navigation = useNavigation();
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [isExpired, setIsExpired] = useState(true); // Set based on actual expiry date

//   // Mock data - replace with actual API call
//   const currentMembership = {
//     id: 2,
//     name: 'Premium Monthly',
//     price: 50,
//     expiryDate: '2023-01-01', // Past date for expired state
//     features: ['Personal Trainer', 'Priority Booking', 'Spa Access'],
//   };

//   const membershipPlans = [
//     { id: 2, name: 'Premium Monthly', price: 50, duration: 1 },
//     { id: 4, name: 'Premium Yearly', price: 500, duration: 12 }
//   ];

//   useEffect(() => {
//     // Check expiry date
//     const expiryDate = new Date(currentMembership.expiryDate);
//     setIsExpired(expiryDate < new Date());
//   }, []);

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="chevron-back" size={28} color="#E2F163" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Membership Status</Text>
//           <View style={{ width: 28 }} />
//         </View>

//         {/* Current Plan Card */}
//         <LinearGradient colors={['#1A1A1A', '#2D2D2D']} style={styles.currentPlanCard}>
//           <View style={styles.statusBadgeContainer}>
//             <Text style={[styles.statusBadge, isExpired && styles.expiredBadge]}>
//               {isExpired ? 'EXPIRED' : 'ACTIVE'}
//             </Text>
//           </View>
          
//           <Text style={styles.currentPlanName}>{currentMembership.name}</Text>
//           <Text style={styles.expiryDate}>
//             {isExpired ? 'Expired on ' : 'Valid until '}
//             {new Date(currentMembership.expiryDate).toLocaleDateString()}
//           </Text>
          
//           <View style={styles.featuresContainer}>
//             {currentMembership.features.map((feature, index) => (
//               <View key={index} style={styles.featureItem}>
//                 <Ionicons name="checkmark" size={14} color="#E2F163" />
//                 <Text style={styles.featureText}>{feature}</Text>
//               </View>
//             ))}
//           </View>
//         </LinearGradient>

//         {/* Renewal Options */}
//         <Text style={styles.sectionTitle}>Renew Your Membership</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {membershipPlans.map((plan) => (
//             <TouchableOpacity 
//               key={plan.id}
//               style={[
//                 styles.planCard,
//                 selectedPlan?.id === plan.id && styles.selectedPlan
//               ]}
//               onPress={() => setSelectedPlan(plan)}
//             >
//               <Text style={styles.planName}>{plan.name}</Text>
//               <Text style={styles.planPrice}>RM{plan.price}</Text>
//               <Text style={styles.planDuration}>
//                 {plan.duration} Month{plan.duration > 1 ? 's' : ''}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Renew Button */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity 
//             style={styles.renewButton}
//             onPress={() => navigation.navigate('MembershipRenew', { 
//               plan: selectedPlan || currentMembership 
//             })}
//           >
//             <Text style={styles.buttonText}>
//               {selectedPlan ? 'Renew Selected Plan' : 'Renew Current Plan'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   safeArea: { flex: 1, padding: 16, paddingBottom: 40 },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
//   headerTitle: { color: '#E2F163', fontSize: 20, fontWeight: 'bold' },
//   currentPlanCard: { padding: 24, borderRadius: 16, marginBottom: 24 },
//   statusBadgeContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
//   statusBadge: { 
//     backgroundColor: '#4CAF50', 
//     color: '#000', 
//     paddingHorizontal: 12, 
//     paddingVertical: 4, 
//     borderRadius: 20, 
//     fontSize: 12, 
//     fontWeight: 'bold' 
//   },
//   expiredBadge: { backgroundColor: '#FF4444' },
//   currentPlanName: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
//   expiryDate: { color: '#D2D2D2', fontSize: 14, marginBottom: 16 },
//   featuresContainer: { gap: 12 },
//   featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   featureText: { color: '#D2D2D2', fontSize: 14 },
//   sectionTitle: { color: '#E2F163', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
//   planCard: { 
//     backgroundColor: '#1A1A1A', 
//     padding: 20, 
//     borderRadius: 12, 
//     marginHorizontal: 8, 
//     width: 200 
//   },
//   selectedPlan: { borderWidth: 2, borderColor: '#E2F163' },
//   planName: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
//   planPrice: { color: '#E2F163', fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
//   planDuration: { color: '#D2D2D2', fontSize: 14 },
//   buttonContainer: { paddingTop: 24, paddingBottom: 40 },
//   renewButton: { 
//     backgroundColor: '#E2F163', 
//     padding: 18, 
//     borderRadius: 12, 
//     alignItems: 'center' 
//   },
//   buttonText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
// });

// export default MembershipStatus;