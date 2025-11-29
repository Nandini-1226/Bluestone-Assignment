import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNumberPress = (number: string) => {
    if (phoneNumber.length < 10) {
      setPhoneNumber(phoneNumber + number);
    }
  };

  const handleBackspace = () => {
    setPhoneNumber(phoneNumber.slice(0, -1));
  };

  const handleOtpPress = (number: string) => {
    if (otp.length < 6) {
      setOtp(otp + number);
    }
  };

  const handleOtpBackspace = () => {
    setOtp(otp.slice(0, -1));
  };

  const sendOtp = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowOtpInput(true);
      setShowKeypad(false);
      Alert.alert('OTP Sent', `OTP sent to +91 ${phoneNumber}`);
    }, 1500);
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      if (otp === '123456') { // Mock OTP for demo
        router.navigate('./buy-gold' as any);
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
        setOtp('');
      }
    }, 1500);
  };

  const formatPhoneNumber = (number: string) => {
    if (number.length <= 5) {
      return number;
    }
    return number.slice(0, 5) + ' ' + number.slice(5);
  };

  const renderKeypad = (isOtp = false) => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', '⌫']
    ];

    return (
      <View style={styles.keypad}>
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((key, keyIndex) => (
              <TouchableOpacity
                key={keyIndex}
                style={[
                  styles.keypadButton,
                  key === '' && styles.keypadButtonEmpty
                ]}
                onPress={() => {
                  if (key === '⌫') {
                    isOtp ? handleOtpBackspace() : handleBackspace();
                  } else if (key !== '') {
                    isOtp ? handleOtpPress(key) : handleNumberPress(key);
                  }
                }}
                disabled={key === ''}
              >
                <Text style={styles.keypadText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
          />
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Welcome to Bold!</Text>

        {!showOtpInput ? (
          <>
            {/* Phone Number Input Section 
            Show cursor while typing */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Please enter your 10 digit phone number, we will send an OTP to verify.</Text>
              <TouchableOpacity
                style={styles.phoneInputContainer}
                onPress={() => setShowKeypad(!showKeypad)}
              >
                <Text style={styles.countryCode}>🇮🇳 +91</Text>
                <Text style={styles.phoneInput}>
                  {formatPhoneNumber(phoneNumber) || 'Phone Number'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                phoneNumber.length !== 10 && styles.sendButtonDisabled
              ]}
              onPress={sendOtp}
              disabled={phoneNumber.length !== 10 || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendButtonText}>Verify Phone number</Text>
              )}
            </TouchableOpacity>

            {/* Number Keypad */}
            {showKeypad && renderKeypad()}
          </>
        ) : (
          <>
            {/* OTP Input Section */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Enter OTP sent to +91 {phoneNumber}</Text>
              <View style={styles.otpContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <View key={index} style={styles.otpBox}>
                    <Text style={styles.otpText}>
                      {otp[index] || ''}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Verify OTP Button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                otp.length !== 6 && styles.sendButtonDisabled
              ]}
              onPress={verifyOtp}
              disabled={otp.length !== 6 || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.sendButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            {/* Resend OTP */}
            <TouchableOpacity style={styles.resendButton} onPress={sendOtp}>
              {/* Right align this */}
              <View style={{ alignItems: 'flex-end', flex: 1 }}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </View>
            </TouchableOpacity>

            {/* OTP Keypad */}
            {renderKeypad(true)}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF3F3',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 60,
  },
  inputSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 250,
  },
  countryCode: {
    fontSize: 18,
    color: '#333',
    marginRight: 10,
  },
  phoneInput: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  otpBox: {
    width: 45,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 20,
    minWidth: 150,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  resendText: {
    color: '#D4AF37',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  keypad: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  keypadButton: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  keypadButtonEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  keypadText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});