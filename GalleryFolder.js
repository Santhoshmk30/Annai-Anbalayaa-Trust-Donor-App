// GalleryFolder.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GalleryFolder = () => {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState([]);
  const navigation = useNavigation();

  // Fetch data from the API
  const fetchEventData = async () => {
    try {
      const response = await fetch('https://annaianbalayaa.org/api/gallery_folder');
      const json = await response.json();
      setEventData(json);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  // Handle navigation to details page
  const openDetails = (item) => {
    navigation.navigate('PhotoDetails', { item }); // Pass item data to the PhotoDetails page
  };

  // Render each event item
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => openDetails(item)}>
        {item.image && (
          <Image
            source={{ uri: `https://annaianbalayaa.org${item.image}` }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
    );
  };

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
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default GalleryFolder;
