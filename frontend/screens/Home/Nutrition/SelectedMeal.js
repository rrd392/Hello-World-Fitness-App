import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, Image,TextInput,TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderVer2 from "../../HeaderVer2";
import { StyleSheet } from "react-native";
import API_BASE_URL from "../../../env";

const SelectedMeal = ({route}) => {
    const navigation = useNavigation();
    const {addMeal} = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [calculateC, setCalculateC] = useState(0);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    useEffect(() => {
        let totalCalories = addMeal.reduce((sum, meal) => sum + (meal.calories * meal.quantity), 0);
        setCalculateC(totalCalories);
    }, [addMeal]);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <HeaderVer2
                    title="Meal" style={styles.header}
                    onPress={() => navigation.navigate("CalculateMeal")}
                />
            </SafeAreaView>

            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>Your Selected Meal</Text>
                <View style={styles.selectedContainer}>
                    {addMeal.map((meal, index) => (
                        <View key={meal.meal_id} style={styles.listMealContainer}>
                        <View style={styles.countingColumn}>
                            <Text style={styles.countingText}>{index + 1}</Text>
                        </View>
                        <Image source={meal.meal_pictures? { uri: `${API_BASE_URL}/uploads/${meal.meal_pictures}`}
                                : require("../../../assets/icon.png")} style={styles.mealImage} />
                        <View style={styles.mealTitleContainer}>
                            <Text style={styles.mealTitileText}>{meal.name}</Text>
                            <Text style={styles.mealPortionText}>{meal.serving_size}</Text>
                        </View>
                        <Text style={styles.input}>{meal.quantity}x</Text>
                    </View>
                    ))}
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.calculateCaloriesButton} onPress={() => openModal()}>
                <Text style={styles.calculateCaloriesText}>Calculate Calories</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeText}>x</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Total Calories</Text>
                        <Text style={styles.totalCalinput}>{calculateC} KCAL</Text>
                        <TouchableOpacity style={styles.addButton} onPress={closeModal}>
                            <Text style={styles.addButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000'},
    sectionTitle: { marginTop: 10, fontSize: 24, color: '#E2F163', textAlign: 'center' },
    listMealContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20},
    countingColumn: { borderColor: 'white', borderWidth: 1, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 25, left: 10},
    countingText: { color: 'white', alignSelf: 'center', fontSize: 15},
    mealImage: { width: 125, height: 125, borderRadius: 15,},
    mealTitleContainer: { justifyContent: 'center', alignContent: 'center', width: 140, gap: 2, marginLeft: 8 },
    mealTitileText: { color: 'white', fontWeight: 'bold', fontSize: 16, },
    mealPortionText: {fontSize: 15, color: 'white'},
    input: { textAlign: 'center', width: 70, borderWidth: 1, backgroundColor: 'white', padding:3, right: 5, color: 'black', fontWeight:500},
    calculateCaloriesButton: { backgroundColor: '#E2F163', position: 'absolute', bottom: 20, right: 20, paddingVertical: 10,paddingHorizontal:20, borderRadius: 10, alignItems: 'center'},
    calculateCaloriesText: { fontWeight: 500, fontSize:18},
    selectedContainer:{paddingBottom:40},

    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'},
    modalContainer: { width: "70%", backgroundColor: '#E2F163', borderRadius: 15, padding: 20, alignItems: 'center', position: 'relative'},
    closeButton: { position: 'absolute', top: -5, right: 16},
    closeText: {fontSize: 34},
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20},
    totalCalinput: { textAlign: 'center', width: "70%", backgroundColor: 'white', borderWidth: 1, borderRadius: 2, fontSize:20, padding:10, marginBottom:5},
    addButton: { backgroundColor: '#000', width: "50%", height: 30, borderRadius: 10, marginTop: 10},
    addButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', padding: 5},
});

export default SelectedMeal;