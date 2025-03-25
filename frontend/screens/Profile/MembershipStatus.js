import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from "../../env";
import { getUserId } from '../getUserId';
import HeaderVer3 from "../HeaderVer3";

const MembershipStatus = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [membershipPlans, setMembershipPlans] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserId();
        if (!userData?.id) {
          Alert.alert("Error", "Invalid user ID.");
          return;
        }
        const userId = userData.id;
        setUserId(userId);

        const response = await fetch(`${API_BASE_URL}/api/profile/displayUserData/${userId}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Membership fetch failed: ${errorText}`);
        }

        const data = await response.json();

        if (data?.membership_id) {
          setSelectedPlan(data.membership_id);
          setExpiryDate(data.end_date);
        } else {
          setIsExpired(true);
          setExpiryDate('');
        }

        // Fetch available membership plans
        const plansResponse = await fetch(`${API_BASE_URL}/api/profile/displayMembershipPlan`);
        if (!plansResponse.ok) {
          const plansError = await plansResponse.text();
          throw new Error(`Plans fetch failed: ${plansError}`);
        }

        const plansData = await plansResponse.json();
        setMembershipPlans(plansData.membershipPlan || []);

      } catch (error) {
        console.error("Full error details:", error);
        Alert.alert("Error", error.message || "Failed to load data");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (expiryDate) {
      const today = new Date();
      const expiry = new Date(expiryDate);
      setIsExpired(expiry < today);
    } else {
      setIsExpired(true);
    }
  }, [expiryDate]);

  const getCurrentPlanDetails = () => {
    if (!selectedPlan) return { name: 'No Active Plan', expiry: '' };



    const plan = membershipPlans.find(p => p.membership_id === selectedPlan);
    return {
      name: plan?.plan_name || 'Unknown Plan',
      expiry: expiryDate ? new Date(expiryDate).toLocaleDateString() : 'N/A'
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <HeaderVer3
          title="Renew Membership"
          onPress={() => navigation.goBack()}
        />

        <View style={styles.currentPlanCard}>
          <LinearGradient colors={['#1A1A1A', '#2D2D2D']} style={styles.currentPlanGradient}>
            <Text style={[styles.currentBadge, isExpired && styles.expiredBadge]}>
              {isExpired ? 'EXPIRED' : 'ACTIVE'}
            </Text>
            <Text style={styles.currentPlan}>
              {getCurrentPlanDetails().name}
            </Text>
            <Text style={styles.expiryDate}>
              {isExpired
                ? (!expiryDate || expiryDate === 'N/A' || expiryDate.trim() === '')
                  ? 'Renew the membership plan to get more benefits'
                  : `Expired on ${getCurrentPlanDetails().expiry}`
                : `Renews: ${getCurrentPlanDetails().expiry}`}
            </Text>

          </LinearGradient>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.plansContainer}
        >
          {membershipPlans.map((plan) => (
            <TouchableOpacity
              key={plan.membership_id}
              style={styles.planContainer}
              onPress={() => setSelectedPlan(plan.membership_id)}
            >
              <LinearGradient
                colors={plan.membership_id % 2 === 0 ? ['#404040', '#505050'] : ['#303030', '#404040']}
                style={[styles.planCard, selectedPlan === plan.membership_id && styles.selectedPlan]}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.plan_name}</Text>
                  {plan.plan_name.includes('Premium') && (
                    <Ionicons name="diamond" size={16} color="#E2F163" />
                  )}
                </View>
                <Text style={styles.planPrice}>RM{plan.price}</Text>
                <Text style={styles.durationText}>{plan.duration} Month{plan.duration > 1 ? 's' : ''}</Text>

                {/* Description with tick marks */}
                <View style={styles.descriptionContainer}>
                  {plan.description.split(',').map((feature, index) => (
                    <View key={index} style={styles.descriptionItem}>
                      <Ionicons name="checkmark-circle" size={18} color="#E2F163" style={styles.checkIcon} />
                      <Text style={styles.descriptionText}>{feature.trim()}</Text>
                    </View>
                  ))}

                </View>
              </LinearGradient>
            </TouchableOpacity>

          ))}

        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={isExpired ? styles.renewButton : styles.upgradeButton}
          onPress={() => {
            const selectedPlanDetails = membershipPlans.find(p => p.membership_id === selectedPlan);
            if (selectedPlanDetails) {
              navigation.navigate("MembershipRenew", {
                plan: selectedPlanDetails,
                userId,
                planName: selectedPlanDetails.plan_name,
                planID: selectedPlanDetails.membership_id
              });
            } else {
              Alert.alert("Error", "Please select a membership plan.");
            }
          }}
        >
          <Text style={styles.buttonText}>{isExpired ? "Renew" : "Upgrade"}</Text>
          <Ionicons name="arrow-forward" size={18} color="#000" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#000',

  },
  container: {
    marginTop: 30,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  headerTitle: {
    color: '#E2F163',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E2F163',
  },
  currentPlanCard: {
    marginTop:40,
    borderRadius: 16,
    marginBottom: 32,
    overflow: 'hidden',
  },
  currentPlanGradient: {
    padding: 24
  },
  currentBadge: {
    color: '#E2F163',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 16
  },
  expiredBadge: {
    color: '#FF4444'
  },
  currentPlan: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  expiryDate: {
    color: '#D2D2D2',
    fontSize: 14
  },
  plansContainer: {
    paddingHorizontal: 8
  },
  planContainer: {
    width: 280,
    marginRight: 16
  },
  planCard: {
    borderRadius: 12,
    padding: 20,
    height: 320
  },
  selectedPlan: {
    borderWidth: 2,
    borderColor: '#E2F163'
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  planName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    flex: 1
  },
  planPrice: {
    color: '#E2F163',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8
  },
  durationText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  descriptionContainer: {
    marginTop: 12,
    paddingHorizontal: 5,
  },
  descriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  checkIcon: {
    marginRight: 6
  },
  descriptionText: {
    color: '#E2E2E2',
    fontSize: 14,
    fontWeight: '500'
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  renewButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#E2F163',
    borderRadius: 25,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#E2F163',
    borderRadius: 25,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default MembershipStatus;
