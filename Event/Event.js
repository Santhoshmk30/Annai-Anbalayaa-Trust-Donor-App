import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements'; // Ensure you have react-native-elements installed

const EventList = () => {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState([]);

  // Fetch data from the API
  const fetchEventData = async () => {
    try {
      const response = await fetch('https://annaianbalayaa.org/api/events');
      const json = await response.json();
      setEventData(json); // Assuming the API response is a JSON array
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  // Render each event item
  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        {item.image && ( // Check if image exists
          <Image
            source={{ uri: `https://annaianbalayaa.org${item.image}` }}// Assuming the image URL is in the `image` field
            style={styles.image}
            resizeMode="cover"
          />
        )}
      
        <Text style={styles.description}>{`Event Name: ${item.name}`}</Text>
       
      </View>
    );
  };

  // Render the UI
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text>Loading events...</Text>
        </View>
      ) : (
        <FlatList
          data={eventData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
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
  image: {
    width: '100%', // Adjust to your needs
    height: 200,   // Set a fixed height or use dimensions according to your design
    borderRadius: 8,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    marginVertical: 5,
    color: '#000000',
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
});

export default EventList;
