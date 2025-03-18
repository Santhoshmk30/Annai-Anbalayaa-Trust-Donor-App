import React, { useState, useEffect } from "react";
import { Text, TextInput, View, StyleSheet, ActivityIndicator, Image, Alert, TouchableOpacity, Keyboard } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Registerpage({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isPasswordVisible, setPasswordVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleOtp = async () => {
        if (!phone|| phone.length !== 10) {
            Alert.alert("Invalid Input", "Please enter a valid 10-digit phone number.");
            return;
        }

        try {
            const response = await fetch("https://annaianbalayaa.org/api/send_otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mobile:phone }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "OTP sent successfully.");
            } else {
                Alert.alert("Error", data.message || "Failed to send OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            Alert.alert("Error", "Something went wrong. Please try again later.");
        }
    };


    const handleRegister = async () => {
        setError('');
        setLoading(true);
    
        if (!name || !email || !phone) {
          setError('All fields are required.');
          setLoading(false);
          return;
        }
    
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          setError('Please enter a valid email.');
          setLoading(false);
          return;
        }
      
    
        try {
          const verifyResponse = await fetch(
            'https://annaianbalayaa.org/api/otp_verify', 
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                mobile:phone,
                otp }), 
            }
          );
    
          const verifyResult = await verifyResponse.json();

          console.log(verifyResult);
          
    
          if (verifyResponse.ok && verifyResult.status === 'success') {
            
            const registerResponse = await fetch(
              'https://annaianbalayaa.org/api/register', 
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phone }),
              }
            );
            
      
            const registerResult = await registerResponse.json();
            console.log(registerResult);
      
            if (registerResponse.ok && registerResult.status === 'success') {
              Alert.alert('Success', 'User registered successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('Annai Anbalaya Trust') },
              ]);
            } else {
         
              Alert.alert('Error', 'Registration failed. Please try again.'); 
            }
          } else {
     
            Alert.alert('Error', 'OTP verification failed. Please try again.'); 
          }
        } catch (err) {
         
          Alert.alert('Error', 'An error occurred. Please try again later.'); 
        } finally {
          setLoading(false);
        }
      };
    const goToLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../RegisterPage/login-bg1.png")} />
            <View style={[styles.overlay, isKeyboardVisible && styles.overlayWithKeyboard]}>
                <View style={styles.card}>
                    <Image
                        source={require("../RegisterPage/trust-logo.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.headerText}>Register</Text>
                    <TextInput
                        onChangeText={setName}
                        placeholder="Full Name"
                        placeholderTextColor="grey"
                        style={styles.textInput}
                        keyboardType="default"
                        autoCapitalize="words"
                    />
                    <TextInput
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor="grey"
                        style={styles.textInput}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        onChangeText={setPhone}
                        placeholder="Phone Number"
                        placeholderTextColor="grey"
                        style={styles.textInput}
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                    />
                    <View style={styles.otp}>
                    <TextInput
                        onChangeText={setOtp}
                        placeholder="Enter OTP"
                        placeholderTextColor="grey"
                        secureTextEntry={!isPasswordVisible}
                        style={styles.otptextInput}
                    />
                    
                        <TouchableOpacity style={styles.otpButton} onPress={handleOtp}>
                            <Text style={styles.otpButtonText}>Send OTP</Text>
                        </TouchableOpacity>
                    
                    </View>
                    {loading ? (
                        <ActivityIndicator size="large" color="#FF1493" />
                    ) : (
                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.registerButtonText}>Register</Text>
                        </TouchableOpacity>
                    )}
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
                <Text onPress={goToLogin} style={styles.loginLink}>
                    Already have an account? Login here
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        height: "100%",
        width: "100%",
        position: 'absolute',
        top: 0,
        left: 0,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        width: '100%',
        padding: 20
    },
    overlayWithKeyboard: {
        justifyContent: 'flex-end',
        marginTop: -680,
    },
    headerText: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
        textAlign: 'center',
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        width: 360,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 0,
        marginTop: 70,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
        alignSelf: 'center',
    },
    textInput: {
        borderWidth: 1,
        borderColor: "gray",
        width: "100%",
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        color: '#000000',
    },
    otp:{
        flexDirection:'row',
    },
    otptextInput: {
        borderWidth: 1,
        borderColor: "gray",
        width: "60%",
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        color: '#000000',
    },
    registerButton: {
        backgroundColor: "#fcabf3",
        borderColor: "#FF1493",
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    registerButtonText: {
        color: "#fff",
        fontWeight: 'bold',
    },
    
    otpButtonText: {
        marginTop:20,
        marginLeft:30,
        color: "blue",
        fontWeight: 'bold',
        textDecorationLine:'underline line',
    },
    errorText: {
        color: "red",
        marginTop: 10,
    },
    loginLink: {
        color: "#fff",
        textDecorationLine: "underline",
        paddingTop: '5%',
    },
    togglePasswordText: {
        color: "#FF1493",
        textAlign: 'right',
        marginTop: 5,
    },
});
