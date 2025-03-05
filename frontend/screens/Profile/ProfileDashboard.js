import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileDashboard = () => {
    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <Text style={styles.uidText}>UID:001</Text>
                <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
                <Text style={styles.userName}>Madison Smith</Text>
                <Text style={styles.userEmail}>madison@example.com</Text>
                <Text style={styles.userBirthday}>Birthday: April 1st</Text>
                <Text style={styles.membershipBadge}>Standard Monthly</Text>
                
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}><Text style={styles.statNumber}>75 Kg</Text><Text style={styles.statLabel}>Weight</Text></View>
                    <View style={styles.statBox}><Text style={styles.statNumber}>28</Text><Text style={styles.statLabel}>Years Old</Text></View>
                    <View style={styles.statBox}><Text style={styles.statNumber}>1.65 CM</Text><Text style={styles.statLabel}>Height</Text></View>
                </View>
            </View>

            {/* Menu Section */}
            <View style={styles.menuSection}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
                        <View style={styles.menuIconContainer}><Ionicons name={item.icon} size={24} color='#fff' /></View>
                        <Text style={styles.menuText}>{item.title}</Text>
                        <Ionicons name='chevron-forward' size={20} color='#fff' />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNavigation}>
                {bottomNavItems.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.navItem} onPress={item.onPress}>
                        <Ionicons name={item.icon} size={28} color='#fff' />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const menuItems = [
    { title: 'Profile', icon: 'person', onPress: () => console.log('Profile') },
    { title: 'Membership', icon: 'star', onPress: () => console.log('Membership') },
    { title: 'Transaction History', icon: 'receipt', onPress: () => console.log('Transaction History') },
    { title: 'Achievement', icon: 'trophy', onPress: () => console.log('Achievement') },
    { title: 'Logout', icon: 'exit', onPress: () => console.log('Logout') },
];

const bottomNavItems = [
    { icon: 'home', onPress: () => console.log('Home') },
    { icon: 'barbell', onPress: () => console.log('Classes') },
    { icon: 'fitness', onPress: () => console.log('Fitness') },
];

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#8E77FF' },
    headerSection: { alignItems: 'center', padding: 20 },
    uidText: { color: '#fff', marginBottom: 10, fontWeight: 'bold' },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    userName: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    userEmail: { color: '#fff', marginBottom: 5 },
    userBirthday: { color: '#fff', marginBottom: 10 },
    membershipBadge: { backgroundColor: '#FFF', color: '#8E77FF', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20, fontWeight: 'bold', marginVertical: 10 },
    statsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
    statBox: { alignItems: 'center', padding: 10 },
    statNumber: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    statLabel: { color: '#fff', fontSize: 14 },
    menuSection: { backgroundColor: '#000', paddingVertical: 20 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomColor: '#333', borderBottomWidth: 1 },
    menuIconContainer: { width: 40, alignItems: 'center' },
    menuText: { flex: 1, color: '#fff', fontSize: 16 },
    bottomNavigation: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#8E77FF' },
    navItem: { padding: 10 }
});

export default ProfileDashboard;
