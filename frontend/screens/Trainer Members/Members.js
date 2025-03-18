import { SafeAreaView, View, TouchableOpacity, ScrollView, Text , Image} from 'react-native';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Members = () => {
    const navigation=useNavigation();
    const toggleNotification = () => navigation.navigate('Notification');
    const handleGoToProfile = () => navigation.navigate('ProfileDashboard');

    const membersList = [
        { id: '1', name: 'Emily Lai', gender: 'female', email: 'emily.lai@example.com',
            age: '20', height: '165 cm', weight: '40 kg', fitnessGoals: 'Lose Weight',
        },
        { id: '2', name: 'John Tan', gender: 'male', email: 'john.tan@example.com',
            age: '25', height: '175 cm', weight: '68 kg', fitnessGoals: 'Muscle Mass Gain'
        },
        { id: '3', name: 'Samantha Lee', gender: 'female', email: 'samantha.lee@example.com',
            age: '23', height: '160 cm', weight: '50 kg', fitnessGoals: 'Shape Body'
        },
        { id: '4', name: 'Michael Ong', gender: 'male', email: 'michael.ong@example.com',
            age: '30', height: '180 cm', weight: '75 kg', fitnessGoals: 'Gain Weight'
        },
        { id: '5', name: 'Jessica Lim', gender: 'female', email: 'jessica.lim@example.com',
            age: '28', height: '170 cm', weight: '55 kg', fitnessGoals: 'Shape Body'
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={toggleNotification}>
                    <Ionicons name="notifications" size={24} color="#896CFE" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGoToProfile}>
                    <Ionicons name="person" size={24} color="#896CFE" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView>
                <Text style={styles.titleText}>Member Under You</Text>
                <View style={styles.membersSection}>
                    {membersList.map((member) => (
                        <View key={member.id} style={styles.memberCardSection}>
                        {/* Member Profile */}
                        <View style={styles.memberProfile}>
                            <Image
                                source={require("../../assets/icon.png")}
                                style={styles.profileImage}
                            />
                            <View style={styles.nameNemailContainer}>
                                <View style={styles.nameNgender}>
                                    <Text style={styles.nameText}>{member.name}</Text>
                                    <Text style={styles.genderText}>
                                        {member.gender === "male" ? "♂️" : "♀️"}
                                    </Text>
                                </View>
                                <Text>{member.email}</Text>
                            </View>
                            
                        </View>
                        <View style={styles.divider} />
                        {/* Member Information */}
                        <View style={styles.memberInfoRow1}>
                            <View style={styles.infoStyle}>
                                <Text style={styles.infoTitle}>Age:</Text>
                                <Text style={styles.infoData}>{member.age}</Text>
                            </View>
                            <View style={styles.infoStyle}>
                                <Text style={styles.infoTitle}>Height:</Text>
                                <Text style={styles.infoData}>{member.height}</Text>
                            </View>
                            <View style={styles.infoStyle}>
                                <Text style={styles.infoTitle}>Weight:</Text>
                                <Text style={styles.infoData}>{member.weight}</Text>
                            </View>
                        </View>
                        <View style={styles.memberInfoRow2}>
                            <View style={styles.infoStyle}>
                                <Text style={styles.infoTitle}>Fitness Goal:</Text>
                                <Text style={styles.infoData}>{member.fitnessGoals}</Text>
                            </View>
                        </View>

                        {/* Buttons Section */}
                        <View style={styles.btnSelection}>
                            <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate("ViewProgress")}>
                                <Text style={styles.buttonText}>View Progress</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.viewBtn} onPress={() => navigation.navigate("MemberWorkoutPlan")}>
                                <Text style={styles.buttonText}>View Workout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#212020'},
    headerRow: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingHorizontal: 20, paddingVertical: 13, backgroundColor: "#212020", gap: 20, marginTop: 50 },
    titleText: {color: 'white', fontWeight: 'bold', fontSize: 24, alignSelf: 'center'},
    membersSection: { padding: 15},
    memberCardSection: { backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 20},
    memberProfile: { flexDirection: 'row', gap: 10},
    profileImage: { width: 80, height: 80, borderRadius: 50 },
    nameNemailContainer: { flexDirection: 'column', justifyContent: 'center'},
    nameText: { fontSize: 16, fontWeight: 'bold'},
    nameNgender: { flexDirection: 'row', gap: 5},

    divider: { height: 1, backgroundColor: "#666", marginBottom: 10, marginTop: 10},
    memberInfoRow1: { flexDirection: 'row', justifyContent: 'space-between'},
    infoStyle: { flexDirection: 'row', gap: 5},
    infoTitle: { fontSize: 16},
    infoData: { fontSize: 16, fontWeight: 'bold'},
    memberInfoRow2: { marginTop: 10},

    btnSelection: { flexDirection: 'row', alignSelf: 'center', gap: 40, marginTop: 10},
    viewBtn: { backgroundColor: 'black', width: 140, borderRadius: 20 },
    buttonText: { color: '#E2F163', fontWeight: 'bold', alignSelf: 'center', fontSize: 16, padding: 8},
});

export default Members;