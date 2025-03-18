import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

const PaymentSuccess = ({ route, navigation }) => {
    const { SUMamount, transactionId } = route.params;

    const handleContinue = () => {
        navigation.navigate('Annai Anbalaya Trust');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎉 Payment Successful!</Text>

           

            <Text style={styles.message}>Transfer has been done!</Text>
            <Text style={styles.details}>Amount: ₹{SUMamount}</Text>
            <Text style={styles.message}>"Thank You For Your Generous Donation! Your Support For AAT Truly Makes A Difference!"</Text>
            <Text style={styles.details}>Transaction ID: {transactionId}</Text>
            
            <View style={styles.buttonContainer}>
                <Button title="Continue" onPress={handleContinue} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#e0f7fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000',
    },
    tickImage: {
        width: 100, // Adjust width as needed
        height: 100, // Adjust height as needed
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
        color: "grey",
    },
    details: {
        fontSize: 16,
        marginBottom: 5,
        color: '#000000',
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default PaymentSuccess;
