import HeaderVer2 from "../../HeaderVer2";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import mealPlans from "./mealPlans";

const Nutrition = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <HeaderVer2
                    title="Home" style={styles.header}
                    onPress={() => navigation.navigate("MemberDashboard")}
                />
            </SafeAreaView>

            {/* Calculate Calories Section */}
            <View style={styles.calculateSection}>
                <Text style={styles.sectionTitle}>Calculate Your Calories</Text>
                <TouchableOpacity style={styles.calculateButton} onPress={() => navigation.navigate("CalculateMeal")}>
                    <Text style={styles.calculateButtonText}>Calculate</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.suggestMealText}>Suggested Meal For You</Text>
                {mealPlans.loseWeight.map((meal) => (
                    <View key={meal.id} style={styles.mealContainer}>
                        <Text style={styles.mealTitle}>{meal.title}</Text>
                        <View style={styles.mealItems}>
                            {meal.items.map((item, index) => (
                                <React.Fragment key={index}>
                                    <View style={styles.mealItem}>
                                        <Image source={item.image} style={styles.mealImage} />
                                        <Text style={styles.mealName} numberOfLines={2} >{item.name}</Text>
                                        <Text style={styles.mealPortion}>{item.portion}</Text>
                                    </View>
                                    {index < meal.items.length - 1 && (
                                    <View style={styles.plusSignContainer}>
                                        <Text style={styles.plusSign}>+</Text>
                                    </View>
                                    )}
                                </React.Fragment>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000'},
    calculateSection: { backgroundColor: '#B3A0FF', padding: 15, height: 130,},
    sectionTitle: { fontSize: 24, color: 'black', textAlign: 'center' },
    calculateButton: { marginTop: 20, alignSelf: 'center', backgroundColor: '#000', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 15 },
    calculateButtonText: { color: '#E2F163', fontWeight: 'bold', fontSize: 17 },

    suggestMealText: { color: '#E2F163', fontSize: 20, textAlign: 'center', marginTop: 20, fontWeight: 'bold'},
    scrollContainer: { marginTop: 10 },

    mealContainer: { margin: 10 },
    mealTitle: { width: 70, marginLeft: 3, backgroundColor: "#E2F163", paddingVertical: 1, paddingHorizontal: 10, borderRadius: 20, alignSelf: "flex-center", fontWeight: "bold", marginBottom: 10, textAlign: 'center' },
    
    mealItems: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
    mealItem: { alignItems: "center" },
    mealImage: { width: 110, height: 110, borderRadius: 5 },
    mealName: { color: "#fff", fontSize: 13, fontWeight: "bold", textAlign: "center", marginTop: 5, width: 90, flexWrap: 'wrap', height: 32 },
    mealPortion: { color: "#ccc", fontSize: 12, textAlign: "center" },

    plusSignContainer: { justifyContent: 'center', alignItems: 'center', width: 15, marginHorizontal: 10, marginBottom: 50},
    plusSign: { fontSize: 25, fontWeight: "bold", color: "#fff", textAlign: "center",},
});

export default Nutrition;