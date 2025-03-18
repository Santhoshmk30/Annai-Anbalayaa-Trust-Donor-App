import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Activity = () => {
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    const fetchActivityData = async () => {
        if (!userId) {
            Alert.alert('Error', 'User ID is not provided.');
            setLoading(false);
            return;
        }

        const API_URL = `https://annaianbalayaa.org/api/donor_activity/${userId}`;
        console.log("API URL:", API_URL);

        try {
            const response = await axios.get(API_URL);
            console.log("API Response:", response);

            if (response.status === 200 && response.data) {
                setActivityData(response.data);
            } else {
                Alert.alert('Error', 'Failed to fetch activity data.');
            }
        } catch (error) {
            console.error('Error fetching activity data:', error);
            Alert.alert('Error', `Failed to load activity data: ${error.response ? error.response.data : error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('userId');
                if (id) {
                    console.log("Retrieved user ID:", id);
                    setUserId(id);
                } else {
                    Alert.alert('Error', 'User ID not found. Please log in again.');
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to retrieve user ID.');
            }
        };

        getUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchActivityData();
        }
    }, [userId]);

    const navigation = useNavigation();

    const handleInvoicePress = (item) => {
      navigation.navigate('Invoice', { item });
    };

    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <Text style={styles.date}>{`Paid On: ${item.paid_on}`}</Text>
                <Text style={styles.description}>{`Transaction No: ${item.transaction_no}`}</Text>
                
                <View style={styles.amountContainer1}>
                    
                </View>
                

                <View style={styles.amountContainer}>
                <Button
                        title="Invoice"
                        buttonStyle={styles.invoiceButton}
                        onPress={() => handleInvoicePress(item)}
                    />
                    <Text style={styles.status(item.status)}>{item.status}</Text>
                    <Text style={styles.amount}>{`₹ ${item.amount}`}</Text>
                    
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Loading activities...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={activityData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    date: {
        fontSize: 14,
        color: '#000000',
    },
    description: {
        fontSize: 16,
        marginVertical: 5,
        color: '#888',
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
    },
    status: (status) => ({
        fontSize: 14,
        fontWeight: 'bold',
        color: status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'red',
        paddingRight: 40,
    }),
    invoiceButton: {
        backgroundColor: '#007bff',
        borderRadius: 20,
        marginTop: 10,
        width: 80,
        marginBottom: 20,
    },
});

export default Activity;
