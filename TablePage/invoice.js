import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image, Alert, PermissionsAndroid, Platform } from 'react-native';
import ViewShot from 'react-native-view-shot';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as FileSystem from 'react-native-fs';

const Invoice = ({ route }) => {
    const { item } = route.params;
    const viewRef = useRef(null);

    

    const requestStoragePermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message: 'This app needs access to your storage to save PDF files.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Storage permission granted');
                    return true;
                } else {
                    console.log('Storage permission denied');
                    Alert.alert('Permission Denied', 'You need to grant permission to save the file.');
                    return false;
                }
            } else {
                return true; 
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const createAndDownloadPDF = async () => {
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) return;

        try {
            // Capture the content as a screenshot
            const uri = await viewRef.current.capture();
            console.log('Captured URI:', uri);

            // Generate the PDF from HTML content
            const options = {
                html: `
                    <h1>Invoice</h1>
                    <p>Receipt No: ${item.invoice_no}</p>
                    <p>Donor Name: ${item.name}</p>
                    <p>Amount: ₹ ${item.amount}</p>
                    <p>Thank you for your donation.</p>
                `,
                fileName: 'donation_receipt',
                directory: 'Documents',
            };

            const file = await RNHTMLtoPDF.convert(options);
            console.log('PDF File:', file.filePath);

            // Save PDF locally
            const savePath = `${FileSystem.DocumentDirectoryPath}/donation_receipt.pdf`;
            await FileSystem.copyFile(file.filePath, savePath);
            Alert.alert('PDF saved locally at', savePath);
        } catch (error) {
            console.error('Error generating PDF:', error);
            Alert.alert('Failed to generate PDF');
        }
    };


    return (
        <ScrollView style={styles.container}>
            <ViewShot 
                ref={viewRef} 
                options={{ format: 'png', quality: 0.9 }} 
            >
                <View style={styles.header}>
                    <Image
                        source={require('../TablePage/trust-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.trustName}>Annai Anbalayaa Trust</Text>
                    <Text style={styles.regInfo}>
                        GOVT. REG NO: 1228/2006 | PAN NO: AACTA2634E NITI Aayog Reg no: TN/2017/0160826
                    </Text>
                </View>

                <View style={styles.receiptContainer}>
                    <Image
                        source={require('./trust-logo.png')}
                        style={styles.tableWatermark}
                        resizeMode="contain"
                    />
                    <Text style={styles.receiptTitle}>DONATION RECEIPT</Text>
                    <View style={styles.table}>
                        {[
                            { label: 'Receipt No:', value: item.invoice_no },
                            { label: 'Receipt Date:', value: item.paid_on },
                            { label: 'Company Name:', value: item.name },
                            { label: ' Name of Person:', value: item.name },
                            { label: 'NGO Name:', value: item.name },
                            { label: 'Donor Name:', value: item.name },
                            { label: 'Email:', value: item.email },
                            { label: 'Mobile No:', value: item.mobile_no },
                            { label: 'Amount:', value: `₹ ${item.amount}` },
                            { label: 'Address:', value: item.address },
                            { label: 'GST No/PAN No:', value: item.pan_no },
                            { label: 'PAN NO:', value: item.pan_no },
                            { label: 'Payment Method:', value: item.payment_mode },
                            { label: 'Transaction Id:', value: item.transaction_no },
                        ].map((row, index) => (
                            <View style={styles.row} key={index}>
                                <Text style={styles.label}>{row.label}</Text>
                                <Text style={styles.value}>{row.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.noteContainer}>
                    <Text style={styles.note}>
                        "Thank you very much for supporting Annai Anbalayaa Trust to give a better life to the destitute and elder who are greatly in need."
                    </Text>
                    <Text style={styles.note}>
                        "You have donated to an organization which is under tax-exemption U/s 12 (a) of Income Tax Act 1961."
                    </Text>
                    <Text style={styles.note}>
                        "Your contribution will help children and our senior mothers receive the care and respect they truly deserve."
                    </Text>
                </View>
                <View style={styles.signatureContainer}>
                    <Text style={styles.TrustText}>Annai Anbalayaa Trust</Text>
                    <Image
                        source={require('./anbalayaa-seel.png')}
                        style={styles.signature}
                        resizeMode="contain"
                    />
                    <Text style={styles.signatureText}>Authorized Signature</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Head Office: No/87 Sri Saibaba Nagar, NCTPS Post, Athipattu, Chennai - 600120, Tamil Nadu. Mobile No: +91 89418 40841. E-Mail: info@annaiabalayaa.org
                    </Text>
                    <Text style={styles.footerText}>
                        Branch Office: 311, T1 Krishnamachari Rd, Pudupet, Royapettah, Chennai, Tamil Nadu 600014. Mobile No: +91 89418 40841. Website: www.annaiabalayaa.org
                    </Text>
                </View>
            </ViewShot>

            <View style={styles.buttonContainer}>
                <Button title="Download" onPress={createAndDownloadPDF} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 180,
        height: 110,
        marginBottom: 10,
    },
    trustName: {
        fontSize: 21,
        fontWeight: 'bold',
        color: '#000000',
    },
    regInfo: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
        color: '#000000',
    },
    receiptContainer: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        position: 'relative',
    },
    tableWatermark: {
        position: 'absolute',
        top: '20%',
        left: '1%',
        width: '100%',
        height: '100%',
        opacity: 0.1,
        zIndex: -1,
    },
    receiptTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#000000',
    },
    table: {
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
        color: '#000000',
    },
    value: {
        fontSize: 14,
        flex: 2,
        textAlign: 'right',
        color: '#000000',
    },
    noteContainer: {
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    note: {
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 5,
        color: '#000000',
    },
    footer: {
        marginTop: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingTop: 10,
    },
    footerText: {
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 5,
        color: '#000000',
    },
    TrustText: {
        marginLeft:-20,
        color: '#000000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 20,
    },
    signatureContainer: {
        marginLeft: 270,
        marginTop: 10,
        marginBottom: 10,
    },
    signature: {
        width: 150,
        height: 50,
    },
    signatureText: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: 'bold',
        color: '#000000',
    },
});

export default Invoice;
