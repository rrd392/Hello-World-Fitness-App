import { StyleSheet } from "react-native";
import HeaderVer4 from "../HeaderVer4";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, View, TouchableOpacity, ScrollView, Text , Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const MemberWorkoutPlan = () => {

    const navigation=useNavigation();

    const workoutPlans = [
        { id: '1', name: 'Workout 1' },
        { id: '2', name: 'Workout 2' },
        { id: '3', name: 'Workout 3' },
        { id: '4', name: 'Workout 4' },
        { id: '5', name: 'Workout 5' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <HeaderVer4
                title="Back" style={styles.headerRow}
                onPress={() => navigation.goBack()}
            />

            <ScrollView style={styles.content}>
                <Text style={styles.titleText}>Emily Lai's Workout</Text>                
                <View style={styles.bgStyle}>
                {[
                    ...workoutPlans,
                    { id: 'add', name: 'Add' }
                ].reduce((rows, workout, index) => {
                    if (index % 3 === 0) {
                        rows.push([]);
                    }
                    rows[rows.length - 1].push(workout);
                    return rows;
                }, []).map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.workoutRow}>
                        {row.map((workout) => (
                            <TouchableOpacity 
                                key={workout.id} 
                                style={[styles.workoutBox, workout.id === 'add' && styles.addWorkoutBox]}
                                onPress={workout.id === 'add' ? () => navigation.navigate("CreateWorkout") : 
                                    () => navigation.navigate("ViewWorkout")}
                            >
                                {workout.id === 'add' ? (
                                    <Feather name="plus" size={40} color="#B3A0FF" />
                                ) : (
                                    <>
                                        <Text style={styles.workoutNameText}>{workout.name}</Text>
                                        <Text style={styles.viewDetailsText}>View Details</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#212020' },
    content: { padding: 10},
    bgStyle: { padding: 10},
    titleText: { color: '#E2F163', fontSize: 24, fontWeight: 'bold', alignSelf: 'center'},

    workoutRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, gap: 10},
    workoutBox: { backgroundColor: '#E2F163', flex: 1, margin: 5, height: 100, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
    addWorkoutBox: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#B3A0FF', borderStyle: 'dashed'},
    workoutNameText: { fontWeight: 'bold', fontSize: 16 },
    viewDetailsText: { fontSize: 13},
    actionIcon: { flexDirection: 'row', gap: 20, marginTop: 10},
});
    

export default MemberWorkoutPlan;