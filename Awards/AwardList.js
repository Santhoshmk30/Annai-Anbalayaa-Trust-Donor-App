import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements'; // Make sure react-native-elements is installed

const AwardList = () => {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);

  // Fetch data from the API
  const fetchCertificates = async () => {
    try {
      const response = await fetch('https://annaianbalayaa.org/api/awards/AAT23399');
      const json = await response.json();
      setCertificates(json); // Assuming the API response is a JSON array
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Render each certificate item
  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        {item.image && (
          <Image
            source={{ uri: `https://annaianbalayaa.org${item.image}` }} // Concatenate base URL with the image path
            style={styles.image}
            resizeMode="cover"
          />
        )}      
      </View>
    );
  };

  // Render the UI
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text>Loading certificates...</Text>
        </View>
      ) : (
        <FlatList
          data={certificates}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Assuming each certificate has a unique ID
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
    width: '100%', // Adjust as needed
    height: 200,   // Set a fixed height or use dimensions according to your design
    borderRadius: 8,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: '#888',
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  detailsButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    width: 150,
  },
});

export default AwardList;
