import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet,Button } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SelectList } from 'react-native-dropdown-select-list';
import PhonePePaymentSDK from 'react-native-phonepe-pg';
import Base64 from 'react-native-base64';
import sha256 from 'sha256';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Donate() {
    const [currentPage, setCurrentPage] = useState(0);
    const pagerRef = useRef(null); 
    const navigation = useNavigation();

    const [userId, setUserId] = useState(''); // State to store userId

    useEffect(() => {
        // Fetch userId from AsyncStorage on component mount
        const fetchUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    setUserId(storedUserId);
                }
            } catch (error) {
                console.error("Failed to fetch userId from storage:", error);
            }
        };
        fetchUserId();
    }, []);

    

    
    

    const renderTabButton = (label, index) => (
        <TouchableOpacity
            key={index}
            onPress={() => {
                setCurrentPage(index);
                pagerRef.current.setPage(index); 
            }}
            style={styles.tabButton}
        >
            <LinearGradient
                colors={currentPage === index ? ['#6a11cb', '#2575fc'] : ['#ddd', '#eee']}
                style={styles.gradient}
            >
                <Text style={currentPage === index ? styles.selectedTabText : styles.tabText}>
                    {label}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    const handlePageChange1 = (page) => {
        setCurrentPage(page);
        pagerRef.current.setPage(page);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.tabContainer}>
                {['Individual', 'Company', 'NGO'].map((label, index) =>
                    renderTabButton(label, index)
                )}
               
            </View>
            <PagerView
                ref={pagerRef} 
                style={{ flex: 1 }}
                initialPage={0}
                onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
            >
                <View key="1" style={styles.page}>
                    <Individual />
                </View>
                <View key="2" style={styles.page}>
                    <Company />
                </View>
                <View key="3" style={styles.page}>
                    <NGO />
                </View>
            </PagerView>
        </View>
    );

    function Individual() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [donationSelected, setDonationSelected] = useState('');
    const [packageSelected, setPackageSelected] = useState('');
    const [SUMamount, setAmount] = useState('');
    const [duration, setDuration] = useState('');
    const [address, setAddress] = useState('');
    const [panno, setPan] = useState('');
    const [data, setData] = useState([]);
    const [foodPacks, setFoodPacks] = useState([]);
    const [goodsPacks, setGoodsPacks] = useState([]);
    const [isEditable, setIsEditable] = useState(true);
    


 
    const [environmentforSDK] = useState("PRODUCTION");
    const [merchantId] = useState("M22LA7K1ZIX2D"); 
    const [appId] = useState('Annai'); 
    const [enableLogging] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const foodResponse = await fetch('https://annaianbalayaa.org/api/food_package');
                const foodResult = await foodResponse.json();
                const formattedFoodPackages = Object.entries(foodResult).map(([key, value]) => ({ key, value }));
                setFoodPacks(formattedFoodPackages);

                const goodsResponse = await fetch('https://annaianbalayaa.org/api/goods_package');
                const goodsResult = await goodsResponse.json();
                const formattedGoodsPackages = Object.entries(goodsResult).map(([key, value]) => ({ key, value }));
                setGoodsPacks(formattedGoodsPackages);
            } catch (error) {
                console.error("Error fetching packages:", error);
                Alert.alert("Error", "Failed to fetch package data.");
            }
        };

        fetchPackages();
    }, []);

    useEffect(() => {
        console.log("User ID:", userId); // Check if userId is set
    
        if (!userId) return; // Exit if userId is not available
    
        const fetchProfileData = async () => {
            try {
                console.log("Fetching profile data...");
                const response = await fetch(`https://annaianbalayaa.org/api/get_profile/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (response.ok) {
                    const profileData = await response.json();
                    console.log("Profile data fetched:", profileData);
                    setName(profileData.name || '');
                    setEmail(profileData.email || '');
                    setPhone(profileData.phone || '');
                    setAddress(profileData.address || '');
                    setDob(profileData.dob || '');
                    setPan(profileData.pan_no || '');
                } else {
                    console.error('Failed to fetch profile data, status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };
    
        fetchProfileData();
    }, [userId]);

    const handlePaymentSuccess = (userId, name, phone, email, SUMamount, transactionId) => {
        const paymentDetails = {
            mid: userId,
            name: name,
            mobile_no: phone,
            email: email,
            transaction_no: transactionId,
            amount: SUMamount,
            status: 'SUCCESS',
            date: new Date().toISOString(),
        };
    
        console.log(`User ID: ${paymentDetails.mid}, name: ${paymentDetails.name}, phone: ${paymentDetails.mobile_no}, email: ${paymentDetails.email}, transactionId: ${paymentDetails.transaction_no}, amount: ${paymentDetails.amount}, status: ${paymentDetails.status}`);
    
    
        // Optionally show a loading indicator while processing
        //setLoading(true);
    
        // Make a POST request to your server to record the payment
        fetch('https://annaianbalayaa.org/api/payment_pending', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentDetails),
        })
        .then(response =>{ console.log(response)

            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error("Error response data:", errorData);
                    throw new Error("Failed to store payment history.");
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("API success response:", data);
        })

        
        

        // .then(data => {
        //     //setLoading(false); // Hide loading indicator
        //     if (data.success) {

        //     } else {
        //         Alert.alert('Error', 'Failed to record payment. Please try again.');
        //     }
        // })
        .catch(error => {
            //setLoading(false); // Hide loading indicator
            console.error("Error recording payment:", error);
            //Alert.alert('Error', 'An error occurred while processing your payment. Please try again.');
        });
        navigation.navigate('PaymentSuccess', { SUMamount, transactionId  });
    };
    

    const generateTransactionId = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0'); 
        const merchantPrefix = "T";
        return `${merchantPrefix}${timestamp}${random}`;
        

    }

    const handleSubmit = () => {
        if (!SUMamount) {
            Alert.alert("Error", "All fields are required.");
            return;
        }
        
    
        // Prepare data pending to send to your server
        

    
        // const donationData = {
        //     mid:userId,
        //     name,
        //     email,
        //     phone,
        //     dob,
        //     donation: donationSelected,
        //     package: packageSelected,
        //     amount: SUMamount,
        //     transaction_no:transactionId,
        //     duration,
        //     address,
        //     pan: panno,
        // };
    
        // try {
        //     // Send donation data to your API
        //     const response = await fetch("http://annaianbalayaa.org/api/payment_pending", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(donationData),
        //     });
    
        //     // Check if the request was successful
        //     console.log(response)
        //     if (response.ok) {
        //         const result = await response.json();
        //         //Alert.alert("Success", "Donation details saved successfully!");
    
        //         // Proceed with PhonePe payment after successfully storing data
        initiatePhonePePayment();
        //     } else {
        //         throw new Error("Failed to save donation details. Please try again.");
        //     }
        // } catch (error) {
        //     console.error("API error:", error);
        //     Alert.alert("Error", error.message);
        // }
    };
    
    const initiatePhonePePayment = () => {
        PhonePePaymentSDK.init(environmentforSDK, merchantId, appId, enableLogging)
            .then(() => {

                const transactionId = generateTransactionId();
                const amount=SUMamount*100
                const requestBody = {
                    merchantId: merchantId,
                    merchantTransactionId:transactionId ,
                    merchantUserId: "", 
                    amount: amount, 
                    mobileNumber: phone,
                    callbackUrl: "http://annaianbalayaa.org/api/callback-url",
                    paymentInstrument: {
                        type: "PAY_PAGE",
                    },
                };
    
                const salt_key = "8164fb47-04f2-4910-a8ed-ead989926a27";
                const salt_index = 1;
                const payload = JSON.stringify(requestBody);
                const payload_main = Base64.encode(payload);
                const string = payload_main + "/pg/v1/pay" + salt_key;
                const checksum = sha256(string) + "###" + salt_index;

                
    
                PhonePePaymentSDK.startTransaction(
                    payload_main,
                    checksum,
                    null,
                    null
                )
                
                    .then(resp => {
                        console.log(resp);
                        
                        if (resp.status === "SUCCESS") {
                            handlePaymentSuccess(userId,name,phone,email,SUMamount, transactionId);
                        } else {
                            Alert.alert("Payment Failed", "The payment was unsuccessful. Please try again.");
                        }
                    })
                    .catch(err => {
                        console.error("PhonePe transaction error:", err);
                    });
            })
            .catch(err => {
                console.error("PhonePe SDK initialization error:", err);
                Alert.alert("Error", "Failed to initialize payment. Please try again.");
            });
    };
    
    
    const initiatePayment = async (entry) => {
       
    }

    const clearFields = () => {
        setName('');
        setEmail('');
        setPhone('');
        setDob('');
        setDonationSelected('');
        setPackageSelected('');
        setAmount('');
        setDuration('');
        setAddress('');
        setPan('');
    };

    const donations = [
        { key: '1', value: 'Food Package' },
        { key: '2', value: 'Goods Package' },
        { key: '3', value: 'Custom Amount' },
    ];
    const durationOptions = [
        { key: '1', value: 'Occasion' },
        { key: '3', value: 'Monthly' },
        { key: '6', value: 'Once' },
        
    ];

    const handleDonationChange = (val) => {
        setDonationSelected(val);
        if(val === 'Custom Amount'){
            setIsEditable(true);
          }
        setPackageSelected(''); 
        setAmount(''); 
    };

    const handlePackageChange = (val) => {
        const selectedPackage = donationSelected === 'Food Package'
            ? foodPacks.find(pkg => pkg.value === val)
            : goodsPacks.find(pkg => pkg.value === val);
           

        if (selectedPackage) {
            setPackageSelected(`${selectedPackage.value}`);

            if (donationSelected !== 'Custom Amount') {
                setAmount(selectedPackage.key);
                setIsEditable(false);
              
            }
        } else {
            setPackageSelected('');
            setAmount('');
            Alert.alert(val);
        }
    };

    const availablePackages = donationSelected === 'Food Package' ? foodPacks : donationSelected === 'Goods Package' ? goodsPacks : [];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        placeholder="Name"
                        placeholderTextColor="grey"
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pan No</Text>
                    <TextInput
                        style={styles.textInput}
                        value={panno}
                        placeholder="Pan No"
                        placeholderTextColor="grey"
                        onChangeText={setPan}
                    />
                    <Text style={styles.noticeheading}>
                    Important Notice:</Text>
                    <Text style={styles.notice}>
                    Please ensure the PAN number is accurate for receipt generation.
    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor="grey"
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={phone}
                        placeholder="Phone"
                        placeholderTextColor="grey"
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>D.O.B</Text>
                    <TextInput
                        style={styles.textInput}
                        value={dob}
                        placeholder="D.O.B"
                        placeholderTextColor="grey"
                        onChangeText={setDob}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Donation Towards <Text style={styles.asterisk}>*</Text></Text>
                    <SelectList 
                        setSelected={handleDonationChange} 
                        data={donations} 
                        save="value"
                        placeholder="Select Donation"
                        boxStyles={styles.selectBox} 
                        inputStyles={styles.selectInput}
                        dropdownStyles={styles.dropdown} 
                        dropdownTextStyles={styles.dropdownText} 
                    />
                </View>
                {donationSelected !== 'Custom Amount' && (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Package</Text>
                        <SelectList 
                            setSelected={handlePackageChange} 
                            data={availablePackages.map(pkg => ({ key: pkg.key, value: `${pkg.value}` }))} 
                            save="value"
                            placeholder="Select Package"
                            boxStyles={styles.selectBox} 
                            inputStyles={styles.selectInput}
                            dropdownStyles={styles.dropdown} 
                            dropdownTextStyles={styles.dropdownText}
                        />
                    </View>
                )}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Amount</Text>
                     <TextInput
                    style={styles.textInput}
                    testID="SUMamountInput"
                    editable={isEditable}
                    value={SUMamount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    /> 

                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Duration</Text>
                    <SelectList
                    setSelected={setDuration} // Assuming you have a setter for duration
                    data={durationOptions} 
                    save="value"
                    laceholder="Select Duration"
                    boxStyles={styles.selectBox} 
                    inputStyles={styles.selectInput}
                    dropdownStyles={styles.dropdown} 
                    dropdownTextStyles={styles.dropdownText} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.textInput}
                        value={address}
                        placeholder="Address"
                        placeholderTextColor="grey"
                        onChangeText={setAddress}
                    />
                </View>
                
                <Button title="Donate" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
}};

function Company() {
    const navigation = useNavigation();
    const [companyname, setCompanyName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [donationSelected, setDonationSelected] = useState('');
    const [packageSelected, setPackageSelected] = useState('');
    const [SUMamount, setAmount] = useState('');
    const [duration, setDuration] = useState('');
    const [address, setAddress] = useState('');
    const [panno, setPan] = useState('');
    const [data, setData] = useState([]);
    const [foodPacks, setFoodPacks] = useState([]);
    const [goodsPacks, setGoodsPacks] = useState([]);
    const [isEditable, setIsEditable] = useState(true);
    const [userId, setUserId] = useState('');

 
    const [environmentforSDK] = useState("PRODUCTION");
    const [merchantId] = useState("M22LA7K1ZIX2D"); 
    const [appId] = useState('Annai'); 
    const [enableLogging] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const foodResponse = await fetch('https://annaianbalayaa.org/api/food_package');
                const foodResult = await foodResponse.json();
                const formattedFoodPackages = Object.entries(foodResult).map(([key, value]) => ({ key, value }));
                setFoodPacks(formattedFoodPackages);

                const goodsResponse = await fetch('https://annaianbalayaa.org/api/goods_package');
                const goodsResult = await goodsResponse.json();
                const formattedGoodsPackages = Object.entries(goodsResult).map(([key, value]) => ({ key, value }));
                setGoodsPacks(formattedGoodsPackages);
            } catch (error) {
                console.error("Error fetching packages:", error);
                Alert.alert("Error", "Failed to fetch package data.");
            }
        };

        fetchPackages();
    }, []);

    const handlePaymentSuccess = (userId, name, phone, email, SUMamount, transactionId) => {
        const paymentDetails = {
            mid: userId,
            company_name:companyname,
            name: name,
            mobile_no: phone,
            email: email,
            transaction_no: transactionId,
            amount: SUMamount,
            status: 'SUCCESS',
            date: new Date().toISOString(),
        };
    
        console.log(`User ID: ${paymentDetails.mid}, name: ${paymentDetails.name}, phone: ${paymentDetails.mobile_no}, email: ${paymentDetails.email}, transactionId: ${paymentDetails.transaction_no}, amount: ${paymentDetails.amount}, status: ${paymentDetails.status}`);
    
    
        // Optionally show a loading indicator while processing
        //setLoading(true);
    
        // Make a POST request to your server to record the payment
        fetch('https://annaianbalayaa.org/api/payment_pending', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentDetails),
        })
        .then(response =>{ console.log(response)

            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error("Error response data:", errorData);
                    throw new Error("Failed to store payment history.");
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("API success response:", data);
        })

        
        

        // .then(data => {
        //     //setLoading(false); // Hide loading indicator
        //     if (data.success) {

        //     } else {
        //         Alert.alert('Error', 'Failed to record payment. Please try again.');
        //     }
        // })
        .catch(error => {
            //setLoading(false); // Hide loading indicator
            console.error("Error recording payment:", error);
            //Alert.alert('Error', 'An error occurred while processing your payment. Please try again.');
        });
        navigation.navigate('PaymentSuccess', { SUMamount, transactionId  });
    };
    

    const generateTransactionId = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0'); 
        const merchantPrefix = "T";
        return `${merchantPrefix}${timestamp}${random}`;
        

    }

    const handleSubmit = () => {
        if (!SUMamount) {
            Alert.alert("Error", "All fields are required.");
            return;
        }
        

        initiatePhonePePayment();
        
    };
    
    const initiatePhonePePayment = () => {
        PhonePePaymentSDK.init(environmentforSDK, merchantId, appId, enableLogging)
            .then(() => {

                const transactionId = generateTransactionId();
                const amount=SUMamount*100
                const requestBody = {
                    merchantId: merchantId,
                    merchantTransactionId:transactionId ,
                    merchantUserId: "", 
                    amount: amount, 
                    mobileNumber: phone,
                    callbackUrl: "http://annaianbalayaa.org/api/callback-url",
                    paymentInstrument: {
                        type: "PAY_PAGE",
                    },
                };
    
                const salt_key = "8164fb47-04f2-4910-a8ed-ead989926a27";
                const salt_index = 1;
                const payload = JSON.stringify(requestBody);
                const payload_main = Base64.encode(payload);
                const string = payload_main + "/pg/v1/pay" + salt_key;
                const checksum = sha256(string) + "###" + salt_index;

                
    
                PhonePePaymentSDK.startTransaction(
                    payload_main,
                    checksum,
                    null,
                    null
                )
                
                    .then(resp => {
                        console.log(resp);
                        
                        if (resp.status === "SUCCESS") {
                            handlePaymentSuccess(userId,name,phone,email,SUMamount, transactionId);
                        } else {
                            Alert.alert("Payment Failed", "The payment was unsuccessful. Please try again.");
                        }
                    })
                    .catch(err => {
                        console.error("PhonePe transaction error:", err);
                    });
            })
            .catch(err => {
                console.error("PhonePe SDK initialization error:", err);
                Alert.alert("Error", "Failed to initialize payment. Please try again.");
            });
    };
    
    const initiatePayment = async (entry) => {
       
    }

    const clearFields = () => {
        setCompanyName('');
        setName('');
        setEmail('');
        setPhone('');
        setDob('');
        setDonationSelected('');
        setPackageSelected('');
        setAmount('');
        setDuration('');
        setAddress('');
        setPan('');
    };

    const donations = [
        { key: '1', value: 'Food Package' },
        { key: '2', value: 'Goods Package' },
        { key: '3', value: 'Custom Amount' },
    ];
    const durationOptions = [
        { key: '1', value: 'Occasion' },
        { key: '3', value: 'Monthly' },
        { key: '6', value: 'Once' },
        
    ];

    const handleDonationChange = (val) => {
        setDonationSelected(val);
        if(val === 'Custom Amount'){
            setIsEditable(true);
          }
        setPackageSelected(''); 
        setAmount(''); 
    };

    const handlePackageChange = (val) => {
        const selectedPackage = donationSelected === 'Food Package'
            ? foodPacks.find(pkg => pkg.value === val)
            : goodsPacks.find(pkg => pkg.value === val);
           

        if (selectedPackage) {
            setPackageSelected(`${selectedPackage.value}`);

            if (donationSelected !== 'Custom Amount') {
                setAmount(selectedPackage.key);
                setIsEditable(false);
              
            }
        } else {
            setPackageSelected('');
            setAmount('');
            Alert.alert(val);
        }
    };

    const availablePackages = donationSelected === 'Food Package' ? foodPacks : donationSelected === 'Goods Package' ? goodsPacks : [];

    return (
        <ScrollView contentContainerStyle={styles.scrollcontainercontainer}>
            <View style={styles.card}>
            <View style={styles.inputContainer}>
                    <Text style={styles.label}>Company Name <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={companyname}
                        placeholder="Company Name"
                        placeholderTextColor="grey"
                        onChangeText={setCompanyName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name of Person <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        placeholder="Name of Person"
                        placeholderTextColor="grey"
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>GST No/Pan No <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={panno}
                        placeholder="GST No/Pan No"
                        placeholderTextColor="grey"
                        onChangeText={setPan}
                    />
                    <Text style={styles.noticeheading}>
                    Important Notice:</Text>
                    <Text style={styles.notice}>
                    Your donation is exempted U/S 80G of Income Tax Act. If you want to claim exemption, you must fill your PAN Number.
    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor="grey"
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={phone}
                        placeholder="Phone"
                        placeholderTextColor="grey"
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>D.O.B</Text>
                    <TextInput
                        style={styles.textInput}
                        value={dob}
                        placeholder="D.O.B"
                        placeholderTextColor="grey"
                        onChangeText={setDob}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Donation Towards <Text style={styles.asterisk}>*</Text></Text>
                    <SelectList 
                        setSelected={handleDonationChange} 
                        data={donations} 
                        save="value"
                        placeholder="Select Donation"
                        boxStyles={styles.selectBox} 
                        inputStyles={styles.selectInput}
                        dropdownStyles={styles.dropdown} 
                        dropdownTextStyles={styles.dropdownText} 
                    />
                </View>
                {donationSelected !== 'Custom Amount' && (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Package</Text>
                        <SelectList 
                            setSelected={handlePackageChange} 
                            data={availablePackages.map(pkg => ({ key: pkg.key, value: `${pkg.value}` }))} 
                            save="value"
                            placeholder="Select Package"
                            boxStyles={styles.selectBox} 
                            inputStyles={styles.selectInput}
                            dropdownStyles={styles.dropdown} 
                            dropdownTextStyles={styles.dropdownText}
                        />
                    </View>
                )}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Amount</Text>
                     <TextInput
                    style={styles.textInput}
                    testID="SUMamountInput"
                    editable={isEditable}
                    value={SUMamount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    /> 

                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Duration</Text>
                    <SelectList
                    setSelected={setDuration} // Assuming you have a setter for duration
                    data={durationOptions} 
                    save="value"
                    laceholder="Select Duration"
                    boxStyles={styles.selectBox} 
                    inputStyles={styles.selectInput}
                    dropdownStyles={styles.dropdown} 
                    dropdownTextStyles={styles.dropdownText} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.textInput}
                        value={address}
                        placeholder="Address"
                        placeholderTextColor="grey"
                        onChangeText={setAddress}
                    />
                </View>
                
                <Button title="Donate" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
};


function NGO() {
    const navigation = useNavigation();
    const [ngoname, setNGOName] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [donationSelected, setDonationSelected] = useState('');
    const [packageSelected, setPackageSelected] = useState('');
    const [SUMamount, setAmount] = useState('');
    const [duration, setDuration] = useState('');
    const [address, setAddress] = useState('');
    const [panno, setPan] = useState('');
    const [data, setData] = useState([]);
    const [foodPacks, setFoodPacks] = useState([]);
    const [goodsPacks, setGoodsPacks] = useState([]);
    const [isEditable, setIsEditable] = useState(true);
    const [userId, setUserId] = useState('');

 
    const [environmentforSDK] = useState("PRODUCTION");
    const [merchantId] = useState("M22LA7K1ZIX2D"); 
    const [appId] = useState('Annai'); 
    const [enableLogging] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const foodResponse = await fetch('https://annaianbalayaa.org/api/food_package');
                const foodResult = await foodResponse.json();
                const formattedFoodPackages = Object.entries(foodResult).map(([key, value]) => ({ key, value }));
                setFoodPacks(formattedFoodPackages);

                const goodsResponse = await fetch('https://annaianbalayaa.org/api/goods_package');
                const goodsResult = await goodsResponse.json();
                const formattedGoodsPackages = Object.entries(goodsResult).map(([key, value]) => ({ key, value }));
                setGoodsPacks(formattedGoodsPackages);
            } catch (error) {
                console.error("Error fetching packages:", error);
                Alert.alert("Error", "Failed to fetch package data.");
            }
        };

        fetchPackages();
    }, []);

    const handlePaymentSuccess = (userId,name,phone,email,SUMamount, transactionId)=> {

        const paymentDetails = {
            mid:userId,
            name:name,
            mobile_no:phone,
            email:email,
            transaction_no: transactionId,
            amount: SUMamount,
            status: 'SUCCESS',
            date: new Date().toISOString(),
        };
    
        // Optionally show a loading indicator while processing
        //setLoading(true);
    
        // Make a POST request to your server to record the payment
        fetch('http://annaianbalayaa.org/api/payment_pending', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentDetails),
        })
        .then(response =>{ console.log(response)

            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error("Error response data:", errorData);
                    throw new Error("Failed to store payment history.");
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("API success response:", data);
        })

        
        

        // .then(data => {
        //     //setLoading(false); // Hide loading indicator
        //     if (data.success) {

        //     } else {
        //         Alert.alert('Error', 'Failed to record payment. Please try again.');
        //     }
        // })
        .catch(error => {
            //setLoading(false); // Hide loading indicator
            console.error("Error recording payment:", error);
            //Alert.alert('Error', 'An error occurred while processing your payment. Please try again.');
        });
        navigation.navigate('PaymentSuccess', { SUMamount, transactionId  });
    };
    

    const generateTransactionId = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0'); 
        const merchantPrefix = "T";
        return `${merchantPrefix}${timestamp}${random}`;
        

    }

    const handleSubmit = () => {
        if (!SUMamount) {
            Alert.alert("Error", "All fields are required.");
            return;
        }
        
    
        // Prepare data pending to send to your server
        

    
        // const donationData = {
        //     mid:userId,
        //     name,
        //     email,
        //     phone,
        //     dob,
        //     donation: donationSelected,
        //     package: packageSelected,
        //     amount: SUMamount,
        //     transaction_no:transactionId,
        //     duration,
        //     address,
        //     pan: panno,
        // };
    
        // try {
        //     // Send donation data to your API
        //     const response = await fetch("http://annaianbalayaa.org/api/payment_pending", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(donationData),
        //     });
    
        //     // Check if the request was successful
        //     console.log(response)
        //     if (response.ok) {
        //         const result = await response.json();
        //         //Alert.alert("Success", "Donation details saved successfully!");
    
        //         // Proceed with PhonePe payment after successfully storing data
        initiatePhonePePayment();
        //     } else {
        //         throw new Error("Failed to save donation details. Please try again.");
        //     }
        // } catch (error) {
        //     console.error("API error:", error);
        //     Alert.alert("Error", error.message);
        // }
    };
    
    const initiatePhonePePayment = () => {
        PhonePePaymentSDK.init(environmentforSDK, merchantId, appId, enableLogging)
            .then(() => {

                const transactionId = generateTransactionId();
                const amount=SUMamount*100
                const requestBody = {
                    merchantId: merchantId,
                    merchantTransactionId:transactionId ,
                    merchantUserId: "", 
                    amount: amount, 
                    mobileNumber: phone,
                    callbackUrl: "http://annaianbalayaa.org/api/callback-url",
                    paymentInstrument: {
                        type: "PAY_PAGE",
                    },
                };
    
                const salt_key = "8164fb47-04f2-4910-a8ed-ead989926a27";
                const salt_index = 1;
                const payload = JSON.stringify(requestBody);
                const payload_main = Base64.encode(payload);
                const string = payload_main + "/pg/v1/pay" + salt_key;
                const checksum = sha256(string) + "###" + salt_index;

                
    
                PhonePePaymentSDK.startTransaction(
                    payload_main,
                    checksum,
                    null,
                    null
                )
                
                    .then(resp => {
                        console.log(resp);
                        
                        if (resp.status === "SUCCESS") {
                            handlePaymentSuccess(userId,name,phone,email,SUMamount, transactionId);
                        } else {
                            Alert.alert("Payment Failed", "The payment was unsuccessful. Please try again.");
                        }
                    })
                    .catch(err => {
                        console.error("PhonePe transaction error:", err);
                    });
            })
            .catch(err => {
                console.error("PhonePe SDK initialization error:", err);
                Alert.alert("Error", "Failed to initialize payment. Please try again.");
            });
    };
    
    
    const initiatePayment = async (entry) => {
       
    }

    const clearFields = () => {
        setNGOName('');
        setName('');
        setEmail('');
        setPhone('');
        setDob('');
        setDonationSelected('');
        setPackageSelected('');
        setAmount('');
        setDuration('');
        setAddress('');
        setPan('');
    };

    const donations = [
        { key: '1', value: 'Food Package' },
        { key: '2', value: 'Goods Package' },
        { key: '3', value: 'Custom Amount' },
    ];
    const durationOptions = [
        { key: '1', value: 'Occasion' },
        { key: '3', value: 'Monthly' },
        { key: '6', value: 'Once' },
        
    ];

    const handleDonationChange = (val) => {
        setDonationSelected(val);
        if(val === 'Custom Amount'){
            setIsEditable(true);
          }
        setPackageSelected(''); 
        setAmount(''); 
    };

    const handlePackageChange = (val) => {
        const selectedPackage = donationSelected === 'Food Package'
            ? foodPacks.find(pkg => pkg.value === val)
            : goodsPacks.find(pkg => pkg.value === val);
           

        if (selectedPackage) {
            setPackageSelected(`${selectedPackage.value}`);

            if (donationSelected !== 'Custom Amount') {
                setAmount(selectedPackage.key);
                setIsEditable(false);
              
            }
        } else {
            setPackageSelected('');
            setAmount('');
            Alert.alert(val);
        }
    };

    const availablePackages = donationSelected === 'Food Package' ? foodPacks : donationSelected === 'Goods Package' ? goodsPacks : [];

    return (
        <ScrollView contentContainerStyle={styles.scrollcontainercontainer}>
            <View style={styles.card}>
            <View style={styles.inputContainer}>
                    <Text style={styles.label}>NGO Name <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={ngoname}
                        placeholder="NGO Name"
                        placeholderTextColor="grey"
                        onChangeText={setNGOName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name of Person <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        placeholder="Name of Person"
                        placeholderTextColor="grey"
                        
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pan No</Text>
                    <TextInput
                        style={styles.textInput}
                        value={panno}
                        placeholder="Pan No"
                        placeholderTextColor="grey"
                        onChangeText={setPan}
                    />
                    <Text style={styles.noticeheading}>
                    Important Notice:</Text>
                    <Text style={styles.notice}>
                    Your donation is exempted U/S 80G of Income Tax Act. If you want to claim exemption, you must fill your PAN Number.
    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email  <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={email}
                        placeholder="Email"
                        placeholderTextColor="grey"
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone <Text style={styles.asterisk}>*</Text></Text>
                    <TextInput
                        style={styles.textInput}
                        value={phone}
                        placeholder="Phone"
                        placeholderTextColor="grey"
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>D.O.B</Text>
                    <TextInput
                        style={styles.textInput}
                        value={dob}
                        placeholder="D.O.B"
                        placeholderTextColor="grey"
                        onChangeText={setDob}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Donation Towards <Text style={styles.asterisk}>*</Text></Text>
                    <SelectList 
                        setSelected={handleDonationChange} 
                        data={donations} 
                        save="value"
                        placeholder="Select Donation"
                        boxStyles={styles.selectBox} 
                        inputStyles={styles.selectInput}
                        dropdownStyles={styles.dropdown} 
                        dropdownTextStyles={styles.dropdownText} 
                    />
                </View>
                {donationSelected !== 'Custom Amount' && (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Package</Text>
                        <SelectList 
                            setSelected={handlePackageChange} 
                            data={availablePackages.map(pkg => ({ key: pkg.key, value: `${pkg.value}` }))} 
                            save="value"
                            placeholder="Select Package"
                            boxStyles={styles.selectBox} 
                            inputStyles={styles.selectInput}
                            dropdownStyles={styles.dropdown} 
                            dropdownTextStyles={styles.dropdownText}
                        />
                    </View>
                )}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Amount</Text>
                     <TextInput
                    style={styles.textInput}
                    testID="SUMamountInput"
                    editable={isEditable}
                    value={SUMamount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    /> 

                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Duration</Text>
                    <SelectList
                    setSelected={setDuration} // Assuming you have a setter for duration
                    data={durationOptions} 
                    save="value"
                    laceholder="Select Duration"
                    boxStyles={styles.selectBox} 
                    inputStyles={styles.selectInput}
                    dropdownStyles={styles.dropdown} 
                    dropdownTextStyles={styles.dropdownText} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.textInput}
                        value={address}
                        placeholder="Address"
                        placeholderTextColor="grey"
                        onChangeText={setAddress}
                    />
                </View>
                
                <Button title="Donate" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
};
 
const styles = StyleSheet.create({
   scrollcontainer: {
        flex: 1,
        width: 350, 
        justifyContent: 'center',
        backgroundColor: '#102C3C',
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 5,
        width: 350, 
        marginVertical: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    inputContainer: {
        marginVertical: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 5,
        padding: 10,
        height: 50,
        fontSize: 16,
        width: 300,
        color: '#000000',
    },
    noticeheading:{
        fontSize: 14,
        color: 'red',
        marginTop: 5,
        fontWeight: 'bold',

    },
    notice: {
        fontSize: 12,
        color: '#000000',
        marginTop: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#000000',
    },
    asterisk: {
        color: 'red',
    },
    selectBox: {
    borderColor: '#333',
    borderWidth: 1,
    backgroundColor: '#f9f9f9',
  },
  selectInput: {
    color: '#000000', 
  },
  dropdown: {
    backgroundColor: '#ffffff', 
  },
  dropdownText: {
    color: '#000000', 
  },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#f8f8f8',
    },
    tabButton: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 25,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: 10,
        borderRadius: 25,
    },
    tabText: {
        textAlign: 'center',
        color: '#444',
        fontWeight: '500',
    },
    selectedTabText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: '600',
    },
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        
    },
});
