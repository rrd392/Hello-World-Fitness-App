import HeaderVer2 from "../../HeaderVer2";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { View, TouchableOpacity, ScrollView, Text, Image, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Meals from "../Nutrition/Meals";
import React, { useState } from "react";

const CalculateMeal = ()=> {
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState(null);

    const openModal = (meals) => {
        setSelectedMeal(meals);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <HeaderVer2
                    title="Nutrition" style={styles.header}
                    onPress={() => navigation.navigate("Nutrition")}
                />
            </SafeAreaView>

            {/* Choose Meals For Calculation Section */}
            <ScrollView style={styles.scrollContainer}>
                    <Text style={styles.sectionTitle}>Choose Meals For Calculation</Text>
                    <View style={styles.gridContainer}>
                        {Meals.map((meal, index) => (
                            <View key={meal.id} style={styles.mealContainer}>
                                <Image source={meal.image} style={styles.mealImage} />
                                <Text style={styles.mealTitle} numberOfLines={2}>{meal.title}</Text>

                                {/* Add Button (Bottom Right) */}
                                <TouchableOpacity style={styles.plusButton} onPress={() => openModal(meal)}>
                                    <Text style={styles.plusText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate("SelectedMeal")}>
                        <View style={styles.countingColumn}>
                            <Text>5</Text>
                        </View>
                        <Text style={styles.viewText}>View Your Selected Meal</Text>
                    </TouchableOpacity>
            </ScrollView>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeText}>x</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Enter Your Serving</Text>
                        <Image source={selectedMeal?.image} style={styles.mealImage} />
                        <Text style={styles.mealName}>{selectedMeal?.title}</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.servingText}>
                                ({selectedMeal?.portion})
                            </Text>
                            <TextInput style={styles.input} keyboardType="numeric" />
                            <Text style={styles.qtyText}>Qty</Text>
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={closeModal}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000'},
    sectionTitle: { marginTop: 5, fontSize: 24, color: '#E2F163', textAlign: 'center' },

    scrollContainer: { flex: 1, padding: 10 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10},
    
    mealContainer: { width: '30%', padding: 10, alignItems: 'center', position: 'relative'},
    mealImage: { width: 125, height: 125, borderRadius: 20 },
    mealTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 5 },
    plusButton: { position: 'absolute', bottom: 50, left: 88, backgroundColor: '#E2F163', width: 35, height: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center'},
    plusText: { fontSize: 25, fontWeight: 'bold'},

    viewButton: { flexDirection: 'row', marginTop: 10 ,backgroundColor: '#E2F163', width: 280, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'},
    countingColumn: { borderWidth: 1, width: 25, height: 25, alignItems: 'center', borderRadius: 15, justifyContent: 'center', position: 'absolute', left:17},
    viewText: { fontSize: 15, fontWeight: 'bold'},

    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'},
    modalContainer: { width: 300, backgroundColor: '#E2F163', borderRadius: 15, padding: 20, alignItems: 'center', position: 'relative'},
    closeButton: { position: 'absolute', top: -5, right: 16},
    closeText: {fontSize: 34},
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10},
    mealName: { fontSize: 16, fontWeight: '600', textAlign: 'center'},

    inputContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, },
    servingText: { fontWeight: 'bold', marginRight: 5},
    input: { width: 60, borderWidth: 1, textAlign: 'center', backgroundColor: 'white', marginHorizontal: 5, borderRadius: 5},
    qtyText: { fontWeight: 'bold'},
    addButton: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 40, borderRadius: 10, marginTop: 5},
    addButtonText: { color: 'white', fontWeight: 'bold'},
});

export default CalculateMeal;