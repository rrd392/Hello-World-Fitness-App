import React, { useState } from "react";
import { View, ScrollView, Text, Image,TextInput,TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderVer2 from "../../HeaderVer2";
import { StyleSheet } from "react-native";
import meals from "./Meals";

const SelectedMeal = () => {
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [calculateC, setCalculateC] = useState(null);

    const openModal = (meals) => {
        setCalculateC(meals);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

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
                    {meals.slice(0, 3).map((meal, index) => (
                        <View key={meal.id} style={styles.listMealContainer}>
                        <View style={styles.countingColumn}>
                            <Text style={styles.countingText}>{index + 1}</Text>
                        </View>
                        <Image source={require("../../../assets/icon.png")} style={styles.mealImage} />
                        <View style={styles.mealTitleContainer}>
                            <Text style={styles.mealTitileText}>{meal.title}</Text>
                            <Text style={styles.mealPortionText}>{meal.portion}</Text>
                        </View>
                        <TextInput style={styles.input} keyboardType="numeric" />
                    </View>
                    ))}
                </View>
                <TouchableOpacity style={styles.calculateCaloriesButton} onPress={() => openModal(calculateC)}>
                    <Text style={styles.calculateCaloriesText}>Calculate Calories</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                            <Text style={styles.closeText}>x</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Total Calories</Text>
                        <TextInput style={styles.totalCalinput} keyboardType="numeric" />
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
    input: { textAlign: 'center', width: 70, borderWidth: 1, backgroundColor: 'white', borderRadius: 5, right: 5, color: 'black'},
    calculateCaloriesButton: { backgroundColor: '#E2F163', width: 150, position: 'absolute', bottom: -50, right: 20, padding: 8, borderRadius: 10, alignItems: 'center'},
    calculateCaloriesText: { fontWeight: 'bold'},

    overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center'},
    modalContainer: { width: 250, backgroundColor: '#E2F163', borderRadius: 15, padding: 20, alignItems: 'center', position: 'relative'},
    closeButton: { position: 'absolute', top: -5, right: 16},
    closeText: {fontSize: 34},
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10},
    totalCalinput: { textAlign: 'center', width: 150, backgroundColor: 'white', borderWidth: 1, borderRadius: 2},
    addButton: { backgroundColor: '#000', width: 85, height: 30, borderRadius: 6, marginTop: 10},
    addButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', padding: 5},
});

export default SelectedMeal;