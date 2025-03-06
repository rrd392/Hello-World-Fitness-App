// LogoutModal.js
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const LogoutModal = ({ visible, onCancel, onConfirm }) => {
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
                        Are you sure you want to log out?
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
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmButtonText}>Yes, logout</Text>
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

export default LogoutModal;
