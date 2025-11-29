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
  ScrollView,
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
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

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

  const handleEditNumber = () => {
    setPhoneNumber('');
    setOtp('');
    setShowOtpInput(false);
    setShowKeypad(true);
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
        router.replace('/buy-gold' as any);
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
    const keypadData = [
      [{ number: '1', letters: '' }, { number: '2', letters: 'ABC' }, { number: '3', letters: 'DEF' }],
      [{ number: '4', letters: 'GHI' }, { number: '5', letters: 'JKL' }, { number: '6', letters: 'MNO' }],
      [{ number: '7', letters: 'PQRS' }, { number: '8', letters: 'TUV' }, { number: '9', letters: 'WXYZ' }],
      [{ number: '', letters: '' }, { number: '0', letters: '+' }, { number: '⌫', letters: '' }]
    ];

    return (
      <View style={styles.keypadContainer}>
        <View style={styles.keypad}>
          {keypadData.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((keyData, keyIndex) => (
                <TouchableOpacity
                  key={keyIndex}
                  style={[
                    styles.keypadButton,
                    keyData.number === '' && styles.keypadButtonEmpty
                  ]}
                  onPress={() => {
                    if (keyData.number === '⌫') {
                      isOtp ? handleOtpBackspace() : handleBackspace();
                    } else if (keyData.number !== '') {
                      isOtp ? handleOtpPress(keyData.number) : handleNumberPress(keyData.number);
                    }
                  }}
                  disabled={keyData.number === ''}
                >
                  <View style={styles.keypadButtonContent}>
                    <Text style={styles.keypadNumber}>{keyData.number}</Text>
                    {keyData.letters ? <Text style={styles.keypadLetters}>{keyData.letters}</Text> : null}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
                onPress={() => {
                  setShowKeypad(!showKeypad);
                  setShowCursor(true);
                }}
              >
                <Text style={styles.countryCode}>🇮🇳 +91</Text>
                <Text style={styles.phoneInput}>
                  {formatPhoneNumber(phoneNumber) || 'Phone Number'}
                  {showCursor && phoneNumber.length < 10 && <Text style={styles.cursor}>|</Text>}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms and Conditions */}
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms and Conditions</Text>
              </Text>
            </TouchableOpacity>

            {/* Send OTP Button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                (phoneNumber.length !== 10 || !agreeToTerms) && styles.sendButtonDisabled
              ]}
              onPress={sendOtp}
              disabled={phoneNumber.length !== 10 || !agreeToTerms || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#1A1A1A" />
              ) : (
                <Text style={[
                  styles.sendButtonText,
                  (phoneNumber.length !== 10 || !agreeToTerms) && { color: '#999999' }
                ]}>Verify phone number</Text>
              )}
            </TouchableOpacity>

            {/* Number Keypad */}
            {showKeypad && renderKeypad()}
          </>
        ) : (
          <>
            {/* OTP Input Section */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>We have sent a 6-digit OTP to your number +91 {phoneNumber}</Text>
              
              {/* Edit Number Row */}
              <View style={styles.editNumberRow}>
                <TouchableOpacity style={styles.editNumberButton} onPress={handleEditNumber}>
                  <Text style={styles.editNumberText}>Edit Number</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.otpContainer}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <View key={index} style={styles.otpBox}>
                    <Text style={styles.otpText}>
                      {otp[index] || ''}
                    </Text>
                  </View>
                ))}
              </View>
              
              {/* Resend OTP Row */}
              <View style={styles.resendRow}>
                <Text style={styles.didntReceiveText}>Didn't receive code?</Text>
                <TouchableOpacity onPress={sendOtp}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
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
                <ActivityIndicator color="#1A1A1A" />
              ) : (
                <Text style={[
                  styles.sendButtonText,
                  otp.length !== 6 && { color: '#999999' }
                ]}>Verify OTP</Text>
              )}
            </TouchableOpacity>



            {/* OTP Keypad */}
            {renderKeypad(true)}
          </>
        )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF3F3',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 250,
    maxWidth: '100%',
    width: '90%',
  },
  countryCode: {
    fontSize: 18,
    color: '#1A1A1A',
    marginRight: 10,
  },
  phoneInput: {
    fontSize: 18,
    color: '#1A1A1A',
    flex: 1,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  otpBox: {
    width: 40,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 35,
  },
  otpText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  sendButton: {
    backgroundColor: '#FFB800',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 20,
    minWidth: 200,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  sendButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  resendText: {
    color: '#FFB800',
    fontSize: 14,
    fontWeight: '600',
  },
  cursor: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: 'normal',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FFB800',
    borderColor: '#FFB800',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  termsLink: {
    color: '#FFB800',
    textDecorationLine: 'underline',
  },
  editNumberRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    maxWidth: 300,
    width: '100%',
    paddingHorizontal: 5,
  },
  editNumberButton: {
    alignSelf: 'flex-start',
  },
  editNumberText: {
    color: '#FFB800',
    fontSize: 14,
    fontWeight: '600',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    maxWidth: 300,
    width: '100%',
    paddingHorizontal: 5,
  },
  didntReceiveText: {
    color: '#666666',
    fontSize: 14,
  },
  keypadContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 10,
  },
  keypad: {
    justifyContent: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  keypadButton: {
    width: 70,
    height: 70,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 60,
  },
  keypadButtonEmpty: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  keypadButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadNumber: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  keypadLetters: {
    fontSize: 10,
    color: '#999999',
    marginTop: 2,
    textAlign: 'center',
  },
  keypadText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});