import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../../env";

const DeleteModal = ({ visible, onCancel, workoutId, member }) => {

    const navigation = useNavigation();

    const deleteWorkoutPlan = async(workout_plan_id) => {
        try {
        const response = await fetch(`${API_BASE_URL}/api/trainer-workout/deleteWorkoutPlan`, {
            method: "delete",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({workout_plan_id}),
        });
    
        const data = await response.json();
    
        if (data.success) {
            Alert.alert('Workout plan deleted successfully!');
            onCancel();
            navigation.navigate('MemberWorkoutPlan', {member});
        }
        } catch (error) {
        console.error("Error updating workout plan:", error);
        Alert.alert("Error", error.message || "Network request failed");
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        Are you sure you want to delete?
                    </Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={() => deleteWorkoutPlan(workoutId)}
                        >
                            <Text style={styles.confirmButtonText}>Yes, delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#B3A0FF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        paddingBottom:40,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight:600,        
        marginTop: 10,
        marginBottom:40,
        textAlign: 'center',

    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 10,
        marginRight: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontWeight: 'bold',
        fontSize:20,
        color: "#B3A0FF",
        
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#E2F163',
        paddingVertical: 10,
        marginLeft: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontWeight: 'bold',
        fontSize:20,
    },
});

export default DeleteModal;