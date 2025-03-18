import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = () => {
    const navigation = useNavigation();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState(null); 
    const [storedCurrentPassword, setStoredCurrentPassword] = useState('');

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userId');
            setUserId(id);
        };

        const fetchStoredPassword = async () => {
            const password = await AsyncStorage.getItem('currentPassword');
            setStoredCurrentPassword(password);
        };

        fetchUserId();
        fetchStoredPassword();
    }, []);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords don't match.");
            return;
        }

        try {
            if (!userId) {
                Alert.alert("Error", "User not logged in.");
                return;
            }

            const response = await fetch('https://annaianbalayaa.org/api/update_password', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mid:userId,
                    old_password: currentPassword, 
                    new_password: newPassword, 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('currentPassword', newPassword); // Use the correct key
                Alert.alert("Success", "Password changed successfully!");
                navigation.navigate('Profile');
            } else {
                Alert.alert("Error", data.message || "Failed to change password.");
            }
        } catch (error) {
            console.error('Error changing password:', error);
            Alert.alert("Error", "An unexpected error occurred.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change Password</Text>

            {userId && (
                <Text style={styles.userIdText}>User ID: {userId}</Text>
            )}
            
            <TextInput
                style={styles.input}
                placeholder="Current Password"
                placeholderTextColor="grey"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="grey"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="grey"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
                <Text style={styles.changeButtonText}>Change Password</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000000',
    },
    userIdText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    changeButton: {
        backgroundColor: '#fcabf3',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,    
        borderColor: '#FF1493',   
    },
    changeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ChangePassword;
