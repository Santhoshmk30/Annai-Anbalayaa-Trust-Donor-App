import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TextInput, Button } from 'react-native';

const Volunteer = () => {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState([]);
  const [userInput, setUserInput] = useState('');

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

  // Handle Interested button click
  const handleInterested = () => {
    console.log('Interested:', userInput);
    setUserInput(''); // Clear input after submission
  };

  // Handle Not Interested button click
  const handleNotInterested = () => {
    console.log('Not Interested:', userInput);
    setUserInput(''); // Clear input after submission
  };

  // Render each event item
  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        {item.image && (
          <Image
            source={{ uri: `https://annaianbalayaa.org${item.image}` }} // Assuming the image URL is in the `image` field
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <Text style={styles.description}>{`Event Name: ${item.name}`}</Text>
        <TextInput
              style={styles.input}
              placeholder="Enter your message..."
              value={userInput}
              onChangeText={setUserInput}
            />
            <View style={styles.buttonContainer}>
              <Button title="Interested" onPress={handleInterested} />
              <Button title="Not Interested" onPress={handleNotInterested} />
            </View>
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
        <>
          <FlatList
            data={eventData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()} // Assuming each event has a unique ID
          />
          {/* Moved input and buttons outside of the FlatList */}
          <View style={styles.inputContainer}>
            
          </View>
        </>
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
  description: {
    fontSize: 16,
    marginVertical: 5,
    color: '#000000',
  },
  inputContainer: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Volunteer;
