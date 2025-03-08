import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HeaderVer3 = ({ title, onPress, showBackButton = true }) => {
    return (
        <View style={styles.headerRow}>
            <TouchableOpacity style={styles.headerBack} onPress={onPress}>
                {showBackButton && (
                    <Ionicons
                        name="caret-back"
                        size={24}
                        color="#E2F163"
                    />
                )}
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>


    );
};

const styles = StyleSheet.create({
    headerRow: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBack: {
        position: 'absolute',
        left: 20,
        top: '50%',
        transform: [{ translateY: -12 }],
    },

    title: {
        color: "#E2F163",
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: "center",
    },
});

export default HeaderVer3;
