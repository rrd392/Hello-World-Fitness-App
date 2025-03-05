import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const CheckIn = () => {
    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.homeNav}>Home</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#000',
    },
    header: {
        padding: 20, 
        marginBottom:-30,
    },
    homeNav: {
        fontSize: 24, 
        color: '#896CFE', 
        fontWeight: 'bold', 
        marginBottom:10,
    }
});

export default CheckIn;