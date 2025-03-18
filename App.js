import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, ActivityIndicator, View, Alert, PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';


// Import your pages
import Registerpage from './RegisterPage/Registerpage';
import Loginpage from './LoginPage/Loginpage';
import Dashboardpage from './Dashboard/Dashboard';
import Donatepage from './Dashboard/DonatePage/Donate';
import Activity from './Dashboard/TablePage/Activity';
import AboutPage from './About Page/About';
import ProfilePage from './Profile/Profile';
import EditProfile from './Profile/EditProfile';
import ChangePassword from './Profile/ChangePassword';
import GalleryFolder from './Dashboard/Gallery/Gallery';
import MedicalCampimages from './Dashboard/Gallery/MedicalCamp/MedicalCamp';
import TrustImages from './Dashboard/Gallery/Trust/TrustImages';
import Invoice from './Dashboard/TablePage/invoice';
import PaymentSuccess from './Dashboard/TablePage/PaymentSuccess';
import Events from './Dashboard/Event/Event';
import Certificates from './Dashboard/Certificate/CertificateList';
import Awards from './Dashboard/Awards/AwardList';
import Prayer from './Dashboard/Prayer/Prayer';
import Message from './Dashboard/Message/Message';
import Volunteer from './Dashboard/Volunteer/Volunteer';
import Notification from './Dashboard/Notification Page/Notification';
import Verifyotp from './LoginPage/VerifyOtp'

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [isLoading, setIsLoading] = useState(true);
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
          setInitialRoute('Annai Anbalaya Trust');
        }
        await requestUserPermission();
        await requestNotificationPermission(); // Request for Android 13+
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'This app needs permission to send you notifications',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getToken();
    }
  };

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      setFcmToken(token);
      console.log("FCM Token:", token);
    } catch (error) {
      console.error("Error fetching FCM token:", error);
    }
  };

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log("Foreground message received:", remoteMessage);
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    return unsubscribeForeground;
  }, []);

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message received:', remoteMessage);
    });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name='Login' component={Loginpage} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={Registerpage} /> 
        <Stack.Screen name='Donate' component={Donatepage} />
        <Stack.Screen name='Annai Anbalaya Trust' component={Dashboardpage} options={{ headerShown: false }} />
        <Stack.Screen name='Your Donation History' component={Activity} />
        <Stack.Screen name='About Us' component={AboutPage} />
        <Stack.Screen name='Profile' component={ProfilePage} />
        <Stack.Screen name='EditProfile' component={EditProfile} />
        <Stack.Screen name='ChangePassword' component={ChangePassword} />
        <Stack.Screen name='Gallery' component={GalleryFolder} />
        <Stack.Screen name='Medical Camp Images' component={MedicalCampimages} />
        <Stack.Screen name='Trust Images' component={TrustImages} />
        <Stack.Screen name='Invoice' component={Invoice} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} options={{ headerShown: false }} />
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="Certificates" component={Certificates} />
        <Stack.Screen name="Awards" component={Awards} />
        <Stack.Screen name="Prayer Request" component={Prayer} />
        <Stack.Screen name="Feedback" component={Message} />
        <Stack.Screen name="Volunteer" component={Volunteer} />
        <Stack.Screen name="Notifications" component={Notification} />
        <Stack.Screen name="VerifyOtp" component={Verifyotp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
  },
});
