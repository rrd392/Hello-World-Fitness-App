import React from 'react';
import { View, Image, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";

const MemberDashboard = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    
    navigation.navigate('Login'); 
  };

  const announcements = [
    { id: '1', text: 'More Nutritious Meal Are Added Into...' },
    { id: '2', text: 'Level Up Your Cardio With Our Cardio Blast...' },
    { id: '3', text: 'New Yoga Classes Available Every Weekend!' }
  ];

return (
  <View style={styles.container}>
    {/* Header Section */}
    <SafeAreaView style={styles.header}>
      <View style={styles.headerRow}>
        <Text style={styles.greeting}>Hi, Madison</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity><Ionicons name="search" size={24} color="#896CFE" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="notifications" size={24} color="#896CFE" /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="person" size={24} color="#896CFE" /></TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subtitle}>It’s time to challenge your limits.</Text>
      <Text style={styles.membership}>Standard Monthly</Text>
      {/* Navigation Icons */}
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.navItem} >
          <Ionicons name="checkbox-outline" size={30} color="white" />
          <Text style={styles.navText}>Check In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="barbell-outline" size={30} color="white" />
          <Text style={styles.navText}>Classes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="nutrition-outline" size={30} color="white" />
          <Text style={styles.navText}>Nutrition</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>

    
    {/* Upcoming Class Section */}
    <View style={styles.upcomingClass}>
      <Text style={styles.sectionTitle}>Your Upcoming Event</Text>
      <View style={styles.classCard}>
        <View>
          <Text style={styles.classTitle}>Yoga Flow</Text>
          <Text style={styles.classDetails}><Ionicons name="time-outline" size={15} color="white" /> 8:00 - 9:00</Text>
          <Text style={styles.classDetails}><Ionicons name="person-outline" size={15} color="white" /> Coach Aaron</Text>
          <Text style={styles.classDetails} marginBottom='30'><Ionicons name="calendar-outline" size={15} color="white" /> 2025-01-02</Text>
        </View>
          <Image source={require('../../assets/bck1.png')} style={styles.classImage} />
        </View>
      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreButtonText}>More</Text>
      </TouchableOpacity>
    </View>

    {/* Announcements */}
    <View style={styles.announcementSection}>
      <Text style={styles.announcementTitle}>Explore Classes</Text>
      <FlatList
        data={announcements}
        horizontal={true} // Enables horizontal scrolling
        showsHorizontalScrollIndicator={false} // Hides scrollbar
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            {/* Background Image */}
            <Image source={require('../../assets/bck1.png')} style={styles.announcementImage} />
            {/* Text Overlay */}
            <View style={styles.textOverlay}>
              <Text style={styles.announcementText}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 20, marginBottom:-30},
  greeting: { fontSize: 24, color: '#896CFE', fontWeight: 'bold', marginBottom:10 },
  subtitle: { fontSize: 14, color: '#fff', marginBottom: 10},
  membership: { backgroundColor: '#fff', paddingVertical: 5, paddingHorizontal:20, borderRadius: 20, alignSelf: 'flex-start', fontWeight:'bold', color:'#896CFE', marginBottom:20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  iconRow: { flexDirection: 'row', justifyContent: 'space-between', gap:10},
  navButtons: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  navItem: { alignItems: 'center' },
  navText: { color: 'white', marginTop: 5 },

  upcomingClass: {backgroundColor:'#896CFE', padding: 15},
  sectionTitle: { fontSize: 24, color: 'white', marginBottom: 10, textAlign:'center' },
  classCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000', borderRadius: 10 },
  classTitle: { fontSize: 24, color: 'yellow', marginTop:30, marginLeft:40 },
  classDetails: { color: '#fff', marginLeft:40 },
  classImage: { width: 150, height: '100%', borderRadius: 10 },
  moreButton: { marginTop: 10, alignSelf: 'center', backgroundColor: '#000', paddingHorizontal: 30, paddingVertical:8, borderRadius: 20 },
  moreButtonText: { color: 'white' },

  announcementTitle: { fontSize: 18, color: 'white', marginBottom: 10, fontWeight:'bold' },
  announcementSection: { backgroundColor: '#111', padding: 15, marginTop: 20 },
  announcementImage: { width: '100%', height: '100%', borderRadius: 10, marginRight: 10, position: 'absolute' },
  announcementText: { color: 'white', fontSize: 14, textAlign: 'center' },
  listContainer: {paddingHorizontal: 10},
  card: {
    width: Dimensions.get('window').width * 0.4,
    height: 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  textOverlay: {
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 10,
  },
});

export default MemberDashboard;