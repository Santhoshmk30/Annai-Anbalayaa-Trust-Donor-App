import React, { useState, useEffect } from "react";
import {
    Text,
    TextInput,
    View,
    StyleSheet,
    ActivityIndicator,
    Image,
    Alert,
    TouchableOpacity,
    Keyboard,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage({ navigation }) {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

    const handleLogin = async () => {
        if (!phone || phone.length !== 10) {
          Alert.alert("Invalid Input", "Please enter a valid 10-digit phone number.");
          return;
        }
      
        try {
          const response = await fetch("https://annaianbalayaa.org/api/send_otp", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ mobile: phone }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            Alert.alert("Success", "OTP sent successfully.");
            await AsyncStorage.setItem('phone', phone); 
      
            navigation.navigate('VerifyOtp');
          } else {
            Alert.alert("Error", data.message || "Failed to send OTP. Please try again.");
          }
        } catch (error) {
          console.error("Error sending OTP:", error);
          Alert.alert("Error", "Something went wrong. Please try again later.");
        }
      };
    const goToRegister = () => {
        navigation.navigate('Register');
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
                    <Text style={styles.headerText}>Login</Text>
                    <TextInput
                        onChangeText={setPhone}
                        placeholder="Mobile Number"
                        placeholderTextColor="grey"
                        style={styles.textInput}
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                    />
                    {loading ? (
                        <ActivityIndicator size="large" color="#FF1493" />
                    ) : (
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                    )}
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
                <Text onPress={goToRegister} style={styles.registerLink}>
                    Create an account? Register here
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        padding: 20,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        width: '100%',
        padding: 20,
        marginTop: '-219%',
    },
    overlayWithKeyboard: {
        justifyContent: 'flex-start',  // Keeps the card in the same position when the keyboard is visible
        marginTop: -580,  // Adjust this value based on how much space you need when the keyboard is open
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
        borderColor: "#333",
        width: "100%",
        marginVertical: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        color: '#000000',
    },
    loginButton: {
        backgroundColor: "#fcabf3",
        borderColor: "#FF1493",
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: "#fff",
        fontWeight: 'bold',
    },
    errorText: {
        color: "red",
        marginTop: 10,
    },
    registerLink: {
        color: "#fff",
        textDecorationLine: "underline",
        paddingTop: '5%',
    },
});
