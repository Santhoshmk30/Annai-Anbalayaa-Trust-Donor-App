import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const imageData = [
  { id: '1', name: 'Medical Camp', image: require('../Gallery/MedicalCamp.jpg'), route: 'Medical Camp Images' }, 
  { id: '2', name: 'Trust Images', image: require('../Gallery/Trust.png'), route: 'Trust Images' },
];

const Gallery = () => {
  const navigation = useNavigation(); 

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => navigation.navigate(item.route)}
      >
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.overlay}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={imageData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  itemContainer: {
    marginBottom: 10,
  },
  itemImage: {
    width: '100%',
    height: 200,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  itemName: {
    color: 'white',
    fontSize: 20,
  },
});

export default Gallery;
