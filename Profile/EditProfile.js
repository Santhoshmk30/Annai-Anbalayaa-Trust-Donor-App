import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [userDob, setUserDOB] = useState('');
    const [userCity, setUserCity] = useState('');
    const [userState, setUserState] = useState('');
    const [userPincode, setUserPincode] = useState('');
    const [userPanNo, setUserPanNo] = useState('');

    useEffect(() => {
        const fetchUserId = async () => {
            const storedUserId = await AsyncStorage.getItem('userId');
            setUserId(storedUserId);
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;

            try {
                const response = await axios.get(`https://annaianbalayaa.org/api/get_profile/${userId}`);
                if (response.data && response.data.id) {
                    const userData = response.data; 
                    setUserName(userData.name || '');
                    setUserEmail(userData.email || '');
                    setUserPhone(userData.phone || '');
                    setUserAddress(userData.address || '');
                    setUserDOB(userData.dob || '');
                    setUserCity(userData.city || '');
                    setUserState(userData.state || '');
                    setUserPincode(userData.pin_code || '');
                    setUserPanNo(userData.pan_no || '');
                    
                } else {
                    Alert.alert('Error', 'Failed to fetch user data.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                Alert.alert('Error', `Failed to load user data: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleSave = async () => {
        try {
            const response = await axios.post(`https://annaianbalayaa.org/api/update_profile`, {
                mid: userId,
                name: userName,
                email: userEmail,
                phone: userPhone,
                address: userAddress,
                dob: userDob,
                city: userCity,
                state: userState,
                pin_code: userPincode,
                pan_no: userPanNo,
            });

            if (response.data) {
                Alert.alert('Success', 'Profile updated successfully!');
                navigation.navigate('Annai Anbalaya Trust');
            } else {
                Alert.alert('Error', 'Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', `Failed to update profile: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Loading user data...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            <TextInput
                style={styles.input}
                placeholder="User ID"
                placeholderTextColor="grey"
                value={userId}
                editable={false}
            />
            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="grey"
                value={userName}
                onChangeText={setUserName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="grey"
                value={userEmail}
                onChangeText={setUserEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                placeholderTextColor="grey"
                value={userPhone}
                onChangeText={setUserPhone}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="grey"
                value={userAddress}
                onChangeText={setUserAddress}
            />
            <TextInput
                style={styles.input}
                placeholder="DOB"
                placeholderTextColor="grey"
                value={userDob}
                onChangeText={setUserDOB}
            />
            <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="grey"
                value={userCity}
                onChangeText={setUserCity}
            />
            <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor="grey"
                value={userState}
                onChangeText={setUserState}
            />
            <TextInput
                style={styles.input}
                placeholder="Pincode"
                placeholderTextColor="grey"
                value={userPincode}
                onChangeText={setUserPincode}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Pan No"
                placeholderTextColor="grey"
                value={userPanNo}
                onChangeText={setUserPanNo}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000000',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: '#000000',
    },
    saveButton: {
        backgroundColor: '#fcabf3',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FF1493',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EditProfile;
