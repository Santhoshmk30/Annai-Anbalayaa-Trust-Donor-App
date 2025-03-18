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

export default function OtpVerificationPage({ navigation }) {
    const [otp, setOtp] = useState('');
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

    const handleVerifyOtp = async () => {
        setError('');
        setLoading(true);

        if (!otp) {
            setError('Please enter the OTP.');
            setLoading(false);
            return;
        }

        try {
            const phone = await AsyncStorage.getItem('phone'); 
            const response = await fetch(
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

            const result = await response.json();
            console.log('API Response:', result);

            if (result.status === "error") {
                setError(result.message);
            } else {
                Alert.alert("Success", "OTP Verified Successfully!");
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Annai Anbalaya Trust' }],
                });
            }
        } catch (err) {
            console.error(err);
            setError('OTP verification failed. Please try again later.');
            Alert.alert("Error", 'OTP verification failed. Please try again later.');
        } finally {
            setLoading(false);
        }
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
                    <Text style={styles.headerText}>Verify OTP</Text>
                    <View style={styles.otpContainer}>
                <TextInput
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={4}
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="----"
                    placeholderTextColor="#ccc"
                    textAlign="center"
                />
            </View>
                    {loading ? (
                        <ActivityIndicator size="large" color="#FF1493" />
                    ) : (
                        <TouchableOpacity style={styles.loginButton} onPress={handleVerifyOtp}>
                            <Text style={styles.loginButtonText}>Verify</Text>
                        </TouchableOpacity>
                    )}
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View>
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
        justifyContent: 'flex-start',
        marginTop: -580,
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

    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    otpInput: {
        fontSize: 24,
        width: 150,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        backgroundColor: '#FFFFFF',
        color: '#000',
        marginHorizontal: 10,
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
});
