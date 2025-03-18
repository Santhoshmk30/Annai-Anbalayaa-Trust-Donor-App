import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const Message = () => {
  const [name, setName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else if (response.assets) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    if (!name || !selectedSubject || !description) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }

    const apiUrl = `https://annaianbalayaa.org/api/store_message/${userId}`;
    const newActivityItem = {
      name,
      subject: selectedSubject,
      description,
      image: imageUri || null,
    };

    try {
      const response = await axios.post(apiUrl, newActivityItem);
      if (response.status === 200) {
        Alert.alert("Message: Message Saved Successfully")
        fetchActivityData(); // Fetch updated activity data after submission
      } else {
        Alert.alert('Error', 'Failed to submit Message.');
      }
    } catch (error) {
      console.error('Error submitting prayer request:', error.response ? error.response.data : error.message);
      Alert.alert('Error', `Failed to submit prayer request: ${error.message}`);
    }

    // Reset input fields
    setName('');
    setSelectedSubject('');
    setDescription('');
    setImageUri(null);
  };

  const fetchActivityData = async () => {
    const userId = await AsyncStorage.getItem('userId');

    if (!userId) {
      Alert.alert('Error', 'User ID not found.');
      setLoading(false);
      return;
    }

    const apiUrl = `https://annaianbalayaa.org/api/show_message/${userId}`;
    console.log('Fetching data from API:', apiUrl); // Log the URL

    try {
      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data);
      if (Array.isArray(response.data)) {
        setActivityData(response.data); // Set the fetched activity data
      } else {
        Alert.alert('Error', 'Received data is not in the expected format.');
      }
    } catch (error) {
      console.error('Error fetching activity data:', error.response ? error.response.data : error.message);
      Alert.alert('Error', `Failed to fetch activity data: ${error.response ? error.response.data.message : error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityData(); // Fetch activity data when the component mounts
  }, []);

  const renderActivityItem = ({ item, index }) => (
    <View style={styles.tableRow} key={index}>
      <Text style={styles.tableCell}>{index + 1}</Text>
      <Text style={styles.tableCell}>{item.subject}</Text>
      <Text style={styles.tableCell}>{item.description}</Text>
      {item.image && (
          <Image
            source={{ uri: `https://annaianbalayaa.org${item.image}` }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Feedback</Text>

        {/* Form Card */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Enter Subject"
            placeholderTextColor="grey"
            value={selectedSubject}
            onChangeText={setSelectedSubject}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="grey"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View style={styles.imageInputContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
              <Text style={styles.uploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
            <Text style={styles.imageInputText}>
              {imageUri ? 'Image Selected' : 'No File Choosen'}
            </Text>
          </View>

          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

          <Button title="Submit" onPress={handleSubmit} />
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Sl. No.</Text>
          <Text style={styles.tableHeaderCell}>Subject</Text>
          <Text style={styles.tableHeaderCell}>Description</Text>
          <Text style={styles.tableHeaderCell}>Image</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
        ) : activityData.length > 0 ? (
          <FlatList
            data={activityData}
            renderItem={renderActivityItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.activityList}
          />
        ) : (
          <Text style={styles.nodata}>No data available</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffeef8', // Light pink background
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    color: '#000000',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2,
    marginBottom: 20,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: '#000000',
  },
  imageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: '#000000',
  },
  imageInputText: {
    flex: 1,
    color: '#000000',
  },
  uploadButton: {
    marginLeft: 10,
    padding: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  uploadButtonText: {
    color: '#007bff',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d3d3d3',
    padding: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#000000',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    color: '#000000'
  },
  tableImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  nodata: {
    textAlign: 'center',
    marginVertical: 20,
    color: 'grey',
  },
});

export default Message;
