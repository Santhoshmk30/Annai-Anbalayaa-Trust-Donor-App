import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, RefreshControl, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window'); // Get the screen dimensions

const Profile = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const isActiveRoute = (routeName) => route.name === routeName;

    const fetchUserData = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                const response = await fetch(`https://annaianbalayaa.org/api/get_profile/${userId}`);
                const data = await response.json();

                if (data.id) {
                    setUserData({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone,
                        address: data.address || 'Address not provided',
                        city: data.city || 'City not provided',
                        state: data.state || 'State not provided',
                        pin_code: data.pin_code || 'Pincode not provided',
                        pan_no: data.pan_no || 'PAN No not provided',
                        dob:data.dob || 'DOB not provided',
                    });
                } else {
                    Alert.alert("Error", "Failed to load user data.");
                }
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            Alert.alert("Error", "An unexpected error occurred.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchUserData();
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        await AsyncStorage.removeItem('userId');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196f3" />
            </View>
        );
    }

    const {
        name = '',
        email = '',
        phone = '',
        address = 'Address not provided',
        city = 'City not provided',
        state = 'State not provided',
        pin_code = 'Pincode not provided',
        pan_no = 'PAN No not provided',
        dob = 'DOB not provided',
    } = userData || {};

    return (
        <KeyboardAvoidingView style={styles.pageContainer} behavior="padding">
            <ScrollView 
                contentContainerStyle={[styles.container, { paddingBottom: 70 }]} // Increase paddingBottom for more scrollable space
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Image
                            source={require('../RegisterPage/trust-logo.png')}
                            style={styles.profileImage}
                            resizeMode="cover"
                        />
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.email}>{email}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Phone:</Text>
                        <Text style={styles.infoText}>{phone}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Address:</Text>
                        <Text style={styles.infoText}>{address}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>DOB:</Text>
                        <Text style={styles.infoText}>{dob}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>City:</Text>
                        <Text style={styles.infoText}>{city}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>State:</Text>
                        <Text style={styles.infoText}>{state}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Pincode:</Text>
                        <Text style={styles.infoText}>{pin_code}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>PAN No:</Text>
                        <Text style={styles.infoText}>{pan_no}</Text>
                    </View>

                    <View style={styles.section}>
                        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('EditProfile')}>
                            <Text style={styles.settingsButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('ChangePassword')}>
                            <Text style={styles.settingsButtonText}>Change Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={[styles.navButton, isActiveRoute('Annai Anbalaya Trust') && styles.activeNavButton]}
                    onPress={() => navigation.navigate('Annai Anbalaya Trust')}
                >
                    <Image source={require('../Dashboard/Icons/house.png')} style={styles.icon} />
                    <Text style={[styles.navText, isActiveRoute('Annai Anbalaya Trust') && styles.activeNavText]}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, isActiveRoute('Profile') && styles.activeNavButton]}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Image source={require('../Dashboard/Icons/user.png')} style={styles.icon} />
                    <Text style={[styles.navText, isActiveRoute('Profile') && styles.activeNavText]}>
                        Profile
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, isActiveRoute('About Us') && styles.activeNavButton]}
                    onPress={() => navigation.navigate('About Us')}
                >
                    <Image source={require('../Dashboard/Icons/id-card.png')} style={styles.icon} />
                    <Text style={[styles.navText, isActiveRoute('About Us') && styles.activeNavText]}>
                        About Us
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.navButton, isActiveRoute('Logout') && styles.activeNavButton]}
                    onPress={handleLogout}
                >
                    <Image source={require('../Dashboard/Icons/logout(1).png')} style={styles.icon} />
                    <Text style={[styles.navText, isActiveRoute('Logout') && styles.activeNavText]}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 70, // Add extra bottom padding
        marginBottom: 10,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        borderWidth: 1, 
        borderColor: '#fcabf3', 
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    email: {
        fontSize: 16,
        marginBottom: 20,
        color: '#000000',
    },
    card: {
        width: '90%', // Change to a percentage for responsiveness
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        marginTop: 20, // Reduced margin for better fit
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        width: '100%', // Ensure it uses full width
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    infoText: {
        fontSize: 16,
        color: '#000000',
    },
    section: {
        marginTop: 20,
    },
    settingsButton: {
        backgroundColor: '#fcabf3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor:'#FF1493',
    },
    settingsButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f8f8f8',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    navButton: {
        alignItems: 'center',
    },
    icon: {
        width: 30, // Adjust width as necessary
        height: 30, // Adjust height as necessary
    },
    navText: {
        fontSize: 12,
        marginTop: 5,
        color: '#000',
    },
    activeNavButton: {
        borderBottomWidth: 2,
        borderBottomColor: '#2196f3',
    },
    activeNavText: {
        color: '#2196f3',
    },
});

export default Profile;
