import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const About = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const isActiveRoute = (routeName) => route.name === routeName;

    const handleLogout = () => {
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
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.pageContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image
                    source={require("../Dashboard/trust_bg.jpg")}
                    style={styles.image}
                    resizeMode="cover"
                />
                <Text style={styles.title}>Annai Anbalayaa Trust</Text>
                <Text style={styles.description}>
                    Mr. Sivakumar established the Annai Anbalayaa Trust in 2006 with a mission to support orphaned children. Initially started by three individuals in Athipattu, the trust was officially registered in 2006. It has since been dedicated to providing food, education, and care for orphaned children.

                    In response to the COVID-19 pandemic, and in compliance with government regulations, the children were temporarily transferred to government facilities. During this period, the trust undertook a COVID-19 relief project in 2019 and later received approval for a night shelter home project from GCC in 2022.

                    Currently, the trust operates an old age home for abounded mothers in Athipattu and continues to support education, sports, health, and community development initiatives. We have a facility of hundred old age mothers in Athipattu home, currently there are 50 old age mothers are there. Through these efforts, Annai Anbalayaa Trust remains committed to enhancing the well-being and opportunities of those in need.
                </Text>

                {/* Add extra space here for scrolling */}
                <View style={styles.spacer} />

            </ScrollView>

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
        </View>
    );
};

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
        flexGrow: 1,
    },
    image: {
        width: '100%',
        height: width * 0.5, // Responsive height
        marginBottom: 20,
    },
    title: {
        fontSize: width * 0.06, // Responsive font size
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#000000',
    },
    description: {
        fontSize: width * 0.04, // Responsive font size
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 20, // Added more margin for better spacing
        color: '#000000',
    },
    spacer: {
        height: 100, // Extra space at the bottom
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
        width: 30,
        height: 30,
    },
    navText: {
        fontSize: width * 0.03, // Responsive font size
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

export default About;
