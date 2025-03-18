import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Text, Alert,useColorScheme } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';




const { width: screenWidth } = Dimensions.get('window');

const Dashboard = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const route = useRoute(); 
    const scrollViewRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const sliderImages = [
        { id: 1, source: require("../Dashboard/Trust.jpeg") },
        { id: 2, source: require("../Dashboard/Trust1.jpeg") },
        { id: 3, source: require("../Dashboard/trust_bg.jpg") },
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
        }, 4000);

        return () => clearInterval(intervalId);
    }, [sliderImages.length]);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: currentIndex * screenWidth,
                animated: true,
            });
        }
    }, [currentIndex]);

    

    const isActiveRoute = (routeName) => route.name === routeName;

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('isLoggedIn'); 
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }], 
                            });
                        } catch (e) {
                            console.error('Failed to logout.', e);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const [userName, setUserName] = useState(null); 

    useEffect(() => {
        const fetchUserName = async () => {
          try {
            const storedUserName = await AsyncStorage.getItem('username');
            if (storedUserName) {
              setUserName(storedUserName); 
            } else {
              setUserName('No user found');
            }
          } catch (error) {
            console.error('Error retrieving user name:', error);
            setUserName('Error retrieving user name');
          }
        };
    
        fetchUserName();
      }, []);
      const getResponsiveFontSize = (size) => {
        // Here, you can adjust the scaling factor as needed
        const scaleFactor = width / 375; // Assuming 375 is the base width (iPhone 6/7/8)
        return Math.round(size * scaleFactor);
    };
  
    return (
        <View style={styles.container}>
    {/* Use ScrollView to wrap all content */}
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.textBar}>
            <Image
                source={require('../Dashboard/TablePage/trust-logo.png')}
                style={styles.logo}
                resizeMode="cover"
            />
            <Text style={styles.textBarText}>ANNAI ANBALAYAA TRUST</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        <Image
            source={require('../Dashboard/Notification.png')} // Replace this path with the correct path to your notification icon
            style={styles.notificationIcon}
        />
    </TouchableOpacity>
        </View>

        <View style={styles.carouselContainer}>
        <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            >
                {sliderImages.map((item) => (
                    <Image
                        key={item.id}
                        source={item.source}
                        style={{ width: screenWidth, height: 200 }} // Set your desired height
                        resizeMode="cover"
                    />
                ))}
            </ScrollView>
        </View>

        {/* Main content area */}
        <View style={styles.contentContainer}>
            {/* Row 1 */}
            <View style={styles.imageRow}>
                <View style={styles.cardContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Donate')}>
                        <Image
                            source={require('../Dashboard/images/heart-preview.png')}
                            style={styles.imagemain}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageTextmain}>Donate</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Your Donation History')}>
                        <Image
                            source={require('../Dashboard/images/user.png')}
                            style={styles.imagemain}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageTextmain}>Your Donation History</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Row 2 */}
            <View style={styles.imageRow}>
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Certificates')}>
                        <Image
                            source={require('../Dashboard/images/certificate.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Certificates</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Events')}>
                        <Image
                            source={require('../Dashboard/images/event.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Events</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Gallery')}>
                        <Image
                            source={require('../Dashboard/images/gallery.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Gallery</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Awards')}>
                        <Image
                            source={require('../Dashboard/images/medal.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Awards</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Row 3 */}
            <View style={styles.imageRow}>
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Eventgallery')}>
                        <Image
                            source={require('../Dashboard/images/eventgallery.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Event Gallery</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Prayer Request')}>
                        <Image
                            source={require('../Dashboard/images/praying.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Prayer Request</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Volunteer')}>
                        <Image
                            source={require('../Dashboard/images/team.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Volunteer</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Feedback')}>
                        <Image
                            source={require('../Dashboard/images/comments.png')}
                            style={styles.image1}
                            resizeMode="cover"
                        />
                        <Text style={styles.imageText}>Feedback</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
            <TouchableOpacity
                style={[styles.navButton, isActiveRoute('Annai Anbalaya Trust') && styles.activeNavButton]}
                onPress={() => navigation.navigate('Annai Anbalaya Trust')}
            >
                <Image source={require('../Dashboard/Icons/house.png')} style={styles.icon} />
                <Text style={[styles.navText, isActiveRoute('Annai Anbalaya Trust') && styles.activeNavText]}>
                    Home
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.navButton, isActiveRoute('Profile') && styles.activeNavButton]}
                onPress={() => navigation.navigate('Profile')}
            >
                <Image source={require('../Dashboard/Icons/user.png')} style={styles.icon} />
                <Text style={[styles.navText, isActiveRoute('Profile') && styles.activeNavText]}>
                    Profile
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.navButton, isActiveRoute('About Us') && styles.activeNavButton]}
                onPress={() => navigation.navigate('About Us')}
            >
                <Image source={require('../Dashboard/Icons/id-card.png')} style={styles.icon} />
                <Text style={[styles.navText, isActiveRoute('About Us') && styles.activeNavText]}>
                    About Us
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.navButton, isActiveRoute('Logout') && styles.activeNavButton]}
                onPress={handleLogout}
            >
                <Image source={require('../Dashboard/Icons/logout(1).png')} style={styles.icon} />
                <Text style={[styles.navText, isActiveRoute('Logout') && styles.activeNavText]}>
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
</View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2F8FF',
    },
    textBar: {
        backgroundColor: '#fff', 
        alignItems: 'center',
        flexDirection: 'row', 
        paddingTop: 5,
    },
    logo: {
        width: 40,
        height: 40, 
        marginRight:10,
        marginBottom:10, 
    },
    textBarText: {
        color: "#fa61e9",
        paddingBottom:10,
    fontSize: 23,
    fontWeight: 'bold',
    maxWidth: '82%', // Limit the maximum width to 80% of the parent container
    textAlign: 'center', // Center the text
    textShadowColor: '#000', // Shadow color
    textShadowOffset: { width: 1, height: 1 }, // Offset for the shadow
    textShadowRadius: 2, // Blur radius for the shadow
    },
    notificationIcon: {
        width: 30, // Adjust width as needed
        height: 30, // Adjust height as needed
        marginLeft: 15, // Pushes the icon to the right end
        marginRight: 10, // Adds spacing on the right
        marginBottom: 5, 
    },
    carouselContainer: {
        height: 200,
        marginBottom: 20,
        backgroundColor: '#fff', 
        borderRadius: 15, 
        elevation: 5,
        shadowColor: '#000', 
        shadowOffset: {
        width: 0,
        height: 2, 
    },
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    },
    carouselImage: {
        width: screenWidth,
        height: '100%',
        
    },
    cardContainer: {
        backgroundColor: '#0884A8',
        borderRadius: 15,
        elevation: 2,
        width:'45%',
        marginHorizontal: 10,

    },
    cardContainer1: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
        marginBottom: 10,
        padding: 8,
        width: 70,
        height: 80, 
        shadowColor: '#343434', 
        shadowOffset: {
            width: 90, 
            height: 20, 
        },
        shadowOpacity: 0.25, 
        shadowRadius: 3.5, 
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,

    },
    imageRow1: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20,
    },
    imageRow2: {
        flexDirection: 'row',
        marginLeft: 20,
        width: '100%',
        marginBottom: 20,
    },
    imagemain: {
        width: 40,
        height: 40,
        alignSelf: 'center',
        marginTop: '10%',
    },
    image1: {
        width: 40,
        height: 40,
        alignSelf: 'center',
    },
    imageTextmain: {
        textAlign: 'center', 
        marginTop: 5, 
        fontSize: 16,
        marginBottom: '10%',
        color: '#fff',
    },
    imageText: {
        textAlign: 'center', 
        marginTop: 5, 
        fontSize: 9,
        marginBottom: '10%',
        fontWeight: 'bold',
        color: '#000000',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f8f8f8',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    navButton: {
        alignItems: 'center',
    },
    icon: {
        width: 30, // Adjust width as necessary
        height: 30, // Adjust height as necessary
    },
    navText: {
        fontSize: 12,
        marginTop: 5,
        color: '#000',
    },
    activeNavButton: {
        borderBottomWidth: 2,
        borderBottomColor: '#2196f3',
    },
    activeNavText: {
        color: '#2196f3',
    },
});

export default Dashboard;
