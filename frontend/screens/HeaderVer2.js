import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const HeaderVer2 = ({
    title,
    onPress,
    showBackButton = true,
    containerStyle, // optional additional styles for the container
}) => {

    const navigation=useNavigation();
    const toggleNotification = () => navigation.navigate('Notification');
    const handleGoToProfile = () => navigation.navigate('ProfileStack');

    return (
        <View style={[styles.headerRow, containerStyle]}>
            <TouchableOpacity style={styles.headerBack} onPress={onPress}>
                {showBackButton && (
                    <Ionicons
                        name="caret-back"
                        size={24}
                        color="#E2F163"
                    />
                )}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.iconRow}>
                <TouchableOpacity onPress={toggleNotification}>
                    <Ionicons name="notifications" size={24} color="#896CFE" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGoToProfile}>
                    <Ionicons name="person" size={24} color="#896CFE" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#000',
    },
    headerBack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
   
    titleContainer: {
        marginLeft: 10,
    },
    title: {
        color: "#896CFE",
        fontSize: 24,
        fontWeight: 'bold',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap:20,
    },
});

export default HeaderVer2;
