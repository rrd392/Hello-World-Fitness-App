import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HeaderVer1 = ({ title, onPress, showBackButton = true }) => {
    return (
        <TouchableOpacity style={styles.headerRow} onPress={onPress}>
            {showBackButton && (
                <Ionicons
                    name="caret-back"
                    size={24}
                    color="#E2F163"
                    style={styles.backIcon}
                />
            )}
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    
    titleContainer: {
        flex: 1,
    },
    title: {
        color: "#896CFE",
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default HeaderVer1;
