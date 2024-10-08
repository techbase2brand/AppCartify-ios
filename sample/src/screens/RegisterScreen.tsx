import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ActivityIndicator, ImageBackground, Pressable, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from '../utils';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { whiteColor, blackColor, grayColor, redColor, mediumGray } from '../constants/Color'
import {
  BY_CONTINUING_YOU_AGREE, EMAIL, PASSWORD, CONFIRM_PASSWORD, PLEASE_FILL_ALL_FIELD, INVALID_EMAIL_FORMAT, PASSWORD_MUST_BE_AT, APP_NAME,
  PASSWORD_DO_NOT_MATCH, getAdminAccessToken, getStoreDomain, FIRST_NAME, LAST_NAME, TERM_OF_SERVICES, PRIVACY_POLICY, CONTENT_POLICY,
  ALREADY_HAVE_AN_ACCOUNT, LOGIN, STOREFRONT_DOMAIN, ADMINAPI_ACCESS_TOKEN, PRIVACY_POLICY_URL, TERM_OF_SERVICES_URL, CONTENT_POLICY_URL
} from '../constants/Constants'
import { GOOGLE_LOGO_IMAGE, BACKGROUND_IMAGE, OTP_VERIFICATION_IMAGE, FACEBOOK_LOGO_IMAGE, APPLE_LOGO_IMAGE } from '../assests/images'
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import LoadingModal from '../components/Modal/LoadingModal';
import AuthModal from '../components/Modal/AuthModal';
import SuccessModal from '../components/Modal/SuccessModal';
import { logEvent } from '@amplitude/analytics-react-native';
// import PushNotification from 'react-native-push-notification';
import OTPTextInput from 'react-native-otp-textinput';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../redux/actions/authActions';
import WebViewModal from '../components/Modal/WebViewModal';
import { useThemes } from '../context/ThemeContext';
import { lightColors, darkColors } from '../constants/Color';
import { appleAuth } from '@invertase/react-native-apple-authentication';
const { flex, alignJustifyCenter, alignItemsCenter, borderWidth1, borderRadius5, resizeModeContain, flexDirectionRow, positionAbsolute, textAlign, textDecorationUnderline } = BaseStyle;

const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const selectedItem = useSelector((state) => state.menu.selectedItem);
  const { isDarkMode } = useThemes();
  const colors = isDarkMode ? darkColors : lightColors;
  // const STOREFRONT_DOMAIN = getStoreDomain(selectedItem)
  // const ADMINAPI_ACCESS_TOKEN = getAdminAccessToken(selectedItem)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false)
  const [socialLogin, setSocialLogin] = useState(false)
  const [showOTP, setShowOTP] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [resendButtonDisabled, setResendButtonDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [showWebView, setShowWebView] = useState(false);
  const [webViewURL, setWebViewURL] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    logEvent('RegisterScreen Initialized');
  }, [])


  const handleSendOtp = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
      setError(PLEASE_FILL_ALL_FIELD);
      return;
    }
    if (!emailPattern.test(email)) {
      setEmailError(INVALID_EMAIL_FORMAT);
      return;
    }
    if (password.length < 8) {
      setPasswordError(PASSWORD_MUST_BE_AT);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(PASSWORD_DO_NOT_MATCH);
      return;
    }
    setShowOTP(true)
    try {
      const formattedPhoneNumber = `+91${phone}`;
      const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
      console.log(confirmation)
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  //sign in with user Details
  const handleSignUp = async () => {
    logEvent('Sign up Button clicked');
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // setEmailError('');
    // setPasswordError('');
    // setConfirmPasswordError('');

    // if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
    //   setError(PLEASE_FILL_ALL_FIELD);
    //   return;
    // }
    // if (!emailPattern.test(email)) {
    //   setEmailError(INVALID_EMAIL_FORMAT);
    //   return;
    // }
    // if (password.length < 8) {
    //   setPasswordError(PASSWORD_MUST_BE_AT);
    //   return;
    // }
    // if (password !== confirmPassword) {
    //   setConfirmPasswordError(PASSWORD_DO_NOT_MATCH);
    //   return;
    // }
    try {
      // const response = await fetch(`https://${STOREFRONT_DOMAIN}/admin/api/2023-10/customers.json`, {
      const response = await fetch('https://admin.appcartify.com:8443/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMINAPI_ACCESS_TOKEN
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: `+91${phone}`,
          addresses: [{
            address1: null,
            city: null,
            province: null,
            country: null,
            zip: null,
            phone: null,
            default: true
          }],
          password: password,
          password_confirmation: confirmPassword
        })
      });
      const responseData = await response.json();
      if (responseData.message) {
        setError('')
        setError(responseData.message)
      }
      console.log('User registered successfully:', responseData);

      await AsyncStorage.setItem('userDetails', JSON.stringify(responseData))
      // if (response.ok) {
      Toast.show(`User Registered Succesfully`);
      setSuccessModalVisible(false)
      navigation.navigate('Home');
      dispatch(loginSuccess({ email, password }));
      logEvent('User Registered Succesfully');
      handleNotificationTrigger()
      // }
    } catch (error) {
      console.log('Registration error:', error);
      logEvent(`Registration error: ${error}`);
    }
  };

  //sign in with google
  const googleSignUp = async () => {
    logEvent('GoogleSignUp Button clicked');
    try {
      setLoading(true)
      await GoogleSignin.hasPlayServices();
      const { idToken, user } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      console.log('User signed up with Google successfully!', JSON.stringify(user));
      await AsyncStorage.setItem('userImage', user.photo)
      // Extract necessary details from the user's Google account
      const { email, givenName, familyName } = user;
      const isRegistered = await checkIfUserIsRegistered(user.email)
      if (isRegistered) {
        Toast.show(`User LoggedIn Succesfully`);
      } else {
        // Send user details to Shopify
        const shopifyResponse = await registerUserToShopify({
          email: email,
          password: "defaultPassword",
          password_confirmation: "defaultPassword",
          first_name: givenName,
          last_name: familyName,
        });
        console.log('Shopify response:', shopifyResponse);
        await AsyncStorage.setItem('userDetails', JSON.stringify(shopifyResponse))
        Toast.show(`User Registered Succesfully`);
        handleNotificationTrigger();
      }

      navigation.navigate("Home");
      dispatch(loginSuccess({ email: user.email, password: '' }));
      setLoading(false)
      logEvent('GoogleSignUp Succesfully');

    } catch (error) {
      setLoading(false)
      console.error('Google sign up error:', error);
      Toast.show("User All ready registered please login ")
      logEvent(`Google sign up error:${error}`);
    }
  };

  //sign in with facebbok
  // const onFacebookButtonPress = async () => {
  //   logEvent('Sign up with Facebook Button clicked');
  //   try {
  //     const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  //     setLoading(true)
  //     if (result.isCancelled) {
  //       logEvent(`Sign Up with Facebook cancelled by user`);
  //       throw 'User cancelled the login process';
  //     }

  //     const data = await AccessToken.getCurrentAccessToken();

  //     if (!data) {
  //       throw 'Something went wrong obtaining access token';
  //     }

  //     const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  //     const userCredential = await auth().signInWithCredential(facebookCredential);
  //     console.log(userCredential)
  //     if (userCredential.additionalUserInfo.isNewUser) {
  //       const { profile } = userCredential.additionalUserInfo;
  //       console.log(profile)
  //       const { first_name, last_name, email,picture } = profile;
  //       await AsyncStorage.setItem('userImage',picture?.data?.url)
  //       // Send user details to Shopify
  //       const shopifyResponse = await registerUserToShopify({
  //         email: email,
  //         password: "defaultPassword",
  //         password_confirmation: "defaultPassword",
  //         first_name: first_name,
  //         last_name: last_name,
  //       });
  //       console.log('Shopify response:', shopifyResponse);
  //       await AsyncStorage.setItem('userDetails', JSON.stringify(shopifyResponse))
  //       Toast.show(`User Registered Succesfully`);
  //       dispatch(loginSuccess({ email: profile.email, password: '' }));
  //       navigation.navigate('Home');
  //       setLoading(false)
  //       logEvent(`Sign Up with Facebook Success`);
  //     } else {
  //       // Handle the case where the user already exists
  //       Toast.show('User already registered. Please log in.');
  //       setLoading(false)
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false)
  //     logEvent(`Sign Up with Facebook error:${error}`);
  //   }
  // };
  const onFacebookButtonPress = async () => {
    logEvent('Sign up with Facebook Button clicked');
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      setLoading(true);

      if (result.isCancelled) {
        logEvent('Sign Up with Facebook cancelled by user');
        throw new Error('User cancelled the login process');
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      const userCredential = await auth().signInWithCredential(facebookCredential);

      console.log(userCredential);

      if (userCredential.additionalUserInfo.isNewUser) {
        const { profile } = userCredential.additionalUserInfo;
        const { first_name, last_name, email, picture } = profile;
        await AsyncStorage.setItem('userImage', picture?.data?.url);

        // Check if user is registered in Shopify
        const isRegistered = await checkIfUserIsRegistered(email);

        if (isRegistered) {
          await AsyncStorage.setItem('isUserLoggedIn', profile.id);
          navigation.navigate("Home");
          dispatch(loginSuccess({ email, password: '' }));
          setLoading(false);
          logEvent('Sign in with Facebook Success');
        } else {
          // Register the new user to Shopify
          const shopifyResponse = await registerUserToShopify({
            email,
            password: "defaultPassword",
            password_confirmation: "defaultPassword",
            first_name,
            last_name,
          });
          console.log('Shopify response:', shopifyResponse);
          await AsyncStorage.setItem('userDetails', JSON.stringify(shopifyResponse));
          Toast.show('User Logged In Successfully');
          dispatch(loginSuccess({ email, password: '' }));
          navigation.navigate("Home");
          setLoading(false);
          logEvent('Sign In with Facebook Success');
        }
      } else {
        // Existing user logic
        const { profile } = userCredential.additionalUserInfo;
        await AsyncStorage.setItem('isUserLoggedIn', profile.id);
        navigation.navigate("Home");
        dispatch(loginSuccess({ email: profile.email, password: '' }));
        setLoading(false);
        logEvent('Sign In with Facebook Success');
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      logEvent(`Sign Up with Facebook error: ${error.message}`);
    }
  };

  //registerUserToShopify when user sign with google
  const registerUserToShopify = async (userData) => {
    try {
      const response = await fetch(`https://${STOREFRONT_DOMAIN}/admin/api/2023-10/customers.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMINAPI_ACCESS_TOKEN,
        },
        body: JSON.stringify({ customer: userData }),
        // body: JSON.stringify(userData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to register user on Shopify');
      }
    } catch (error) {
      console.error('Error registering user on Shopify:', error);
      throw error;
    }
  };
  const checkIfUserIsRegistered = async (email) => {
    console.log("check user exit email ", email)
    try {
      const response = await fetch(`https://${STOREFRONT_DOMAIN}/admin/api/2024-04/customers.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ADMINAPI_ACCESS_TOKEN,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        const customers = responseData.customers;
        // console.log(customers);
        // Check if any customer matches the provided email
        const isRegistered = customers.some(customer => {
          if (customer.email === email) {
            console.log('Customer found:', customer);
            return true;
          }
          return false;
        });

        return isRegistered;
      } else {
        throw new Error('Failed to fetch customers from Shopify');
      }
    } catch (error) {
      console.error('Error checking user registration:', error);
      return false;
    }
  };

  const toggleShowPassword = () => {
    logEvent('Show Password icon click on Register Screen');
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    logEvent('Show ConfirmPassword icon click on Register Screen');
    setShowConfirmPassword(!showConfirmPassword);
  };


  const handleNotificationTrigger = () => {
    // Trigger notification logic here
    // PushNotification.localNotification({
    //   channelId: "default-channel-id",
    //   title: 'Welcome',
    //   message: 'Thank you for using our app!',
    // });
  };

  const handleOTPChange = (otp) => {
    setOtp(otp);
    setIsOtpComplete(otp.length === 6); // Assuming OTP length is 6
  };

  const VerifyOTP = () => {
    setSuccessModalVisible(true)
  }

  async function appleSignIn() {
    console.log("working>>", );
    try {
      setLoading(true)
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
      // See: https://github.com/invertase/react-native-apple-authentication#faqs
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    const {
      email,
    
    } = appleAuthRequestResponse;
    const isRegistered = await checkIfUserIsRegistered(email)
    if (isRegistered) {
      Toast.show(`User LoggedIn Succesfully`);
    }
  else {
    // Send user details to Shopify
    const shopifyResponse = await registerUserToShopify({
      email: email,
      password: "defaultPassword",
      password_confirmation: "defaultPassword",
      first_name: appleAuthRequestResponse?.fullName?.givenName,
      last_name: appleAuthRequestResponse?.fullName?.familyName,
    });
    console.log('Shopify response:', shopifyResponse);
    await AsyncStorage.setItem('userDetails', JSON.stringify(shopifyResponse))
    Toast.show(`User Registered Succesfully`);
    handleNotificationTrigger();
  }
  navigation.navigate("Home");
  dispatch(loginSuccess({ email: email, password: '' }));
  setLoading(false)
    }catch (error) {
      setLoading(false)
      console.error('Apple sign In error:', error);
      logEvent(`Apple sign In error:${error}`);
    }
  
    // // Create a Firebase credential from the response
    // const { identityToken, nonce } = appleAuthRequestResponse;
    // const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
  
    // // Sign the user in with the credential
    // return auth().signInWithCredential(appleCredential);
  }
  
  useEffect(() => {
    let interval;
    if (resendButtonDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendButtonDisabled(false);
      setTimer(60); // Reset the timer back to 30 seconds or your desired interval
    }
    return () => clearInterval(interval);
  }, [resendButtonDisabled, timer]);

  const hadleResendOtp = async () => {
    if (resendButtonDisabled) return; // Prevent multiple clicks if already disabled
    try {
      setResendButtonDisabled(true);
      const formattedPhoneNumber = `+91${phone}`;
      console.log(formattedPhoneNumber)
      await auth().signInWithPhoneNumber(formattedPhoneNumber);
      console.log('OTP resent');
    } catch (error) {
      console.error('Error resending OTP:', error);
    }
  };

  return (

    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.whiteColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground style={[flex, { backgroundColor: colors.whiteColor }]} source={isDarkMode ? '' : BACKGROUND_IMAGE}>
        {showOTP ?
          <>
            <View style={[styles.logoBox, alignJustifyCenter, { height: hp(25), }]}>
              <Image source={OTP_VERIFICATION_IMAGE} style={[styles.image, resizeModeContain]} />
            </View>
            <View style={[{ marginTop: spacings.large }]}>
              <Text style={[styles.text, { color: colors.blackColor }]}>OTP Verification</Text>
            </View>
            <Text style={{ color: colors.blackColor, marginHorizontal: spacings.small }}>
              {`Enter the OTP sent to +91 ${phone}`}
            </Text>
            <View style={[{ width: "100%", height: hp(18) }, alignJustifyCenter]}>
              <OTPTextInput
                handleTextChange={handleOTPChange}
                inputCount={6}
                tintColor={colors.blackColor}
                offTintColor={colors.blackColor}
                containerStyle={styles.otpContainer}
                textInputStyle={[styles.otpInput, { color: colors.blackColor }]}
              />
              {/* <TouchableOpacity onPress={hadleResendOtp}>
                <Text style={{ color: blackColor, marginHorizontal: spacings.small }} >
                  {`OTP not Received?`} <Text style={{ color: blackColor, marginHorizontal: spacings.small, fontWeight: style.fontWeightThin1x.fontWeight, textDecorationLine: "underline" }}>
                    {`Resend code`}
                  </Text>
                </Text>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={hadleResendOtp} disabled={resendButtonDisabled}>
                <Text style={{ color: colors.blackColor, marginHorizontal: spacings.small }}>
                  OTP not Received?
                  <Text style={{ color: resendButtonDisabled ? colors.grayColor : colors.blackColor, fontWeight: style.fontWeightThin1x.fontWeight, textDecorationLine: "underline" }}>
                    {resendButtonDisabled ? ` Resend code in ${timer}s` : ' Resend code'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                alignItemsCenter,
                borderRadius5,
                { backgroundColor: isOtpComplete ? colors.redColor : colors.mediumGray }
              ]}
              onPress={isOtpComplete ? VerifyOTP : null}
              disabled={!isOtpComplete}
            >
              <Text style={[styles.buttonText, { color: colors.blackColor }]}>{"Verify & Continue"}</Text>
            </TouchableOpacity>
            <View style={[alignJustifyCenter, { height: hp(13), marginTop: spacings.xxxxLarge }]}>
              <View style={[flexDirectionRow, alignJustifyCenter, { width: "100%", marginTop: spacings.large }]}>
                <View style={{ height: 1, backgroundColor: colors.grayColor, width: "46%" }}></View>
                <Text style={[{ color: colors.blackColor, marginVertical: spacings.xxxxLarge, marginHorizontal: spacings.small }, textAlign]}>{"Or"}</Text>
                <View style={{ height: 1, backgroundColor: colors.grayColor, width: "46%" }}></View>
              </View>
              <View style={[styles.socialAuthBox, alignJustifyCenter, flexDirectionRow]}>
                <TouchableOpacity style={[styles.socialButton, alignJustifyCenter]} onPress={googleSignUp}>
                  <Image source={GOOGLE_LOGO_IMAGE} style={[{ width: wp(6), height: hp(4) }, resizeModeContain]} />
                </TouchableOpacity>
                {/* <TouchableOpacity style={[styles.socialButton, alignJustifyCenter]} onPress={() => setSocialLogin(true)}>
                  <Image source={MORE_DOTS_IMAGE} style={[{ width: wp(6), height: hp(4) }, resizeModeContain]} />
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={[styles.socialButton, alignJustifyCenter]} onPress={onFacebookButtonPress}>
                  <Image source={FACEBOOK_LOGO_IMAGE} style={[{ width: wp(6), height: hp(4) }, resizeModeContain]} />
                </TouchableOpacity> */}
                {Platform.OS === 'ios' && <TouchableOpacity style={[styles.socialButton, alignJustifyCenter]} >
                  <Image source={APPLE_LOGO_IMAGE} style={[{ width: wp(6), height: hp(4) }, resizeModeContain]} />
                </TouchableOpacity>}
              </View>
            </View>
          </>
          :
          <>
            <TouchableOpacity style={[positionAbsolute, styles.backIcon]} onPress={() => { logEvent(`Back Button Pressed from Register`), navigation.goBack() }}>
              <Ionicons name={"arrow-back"} size={33} color={colors.blackColor} />
            </TouchableOpacity>
            <View style={[styles.logoBox, alignJustifyCenter]}>
              <Text style={[styles.text, { color: colors.blackColor }]}>Get Started With</Text>
              <Text style={[styles.text, { color: redColor }]}>{APP_NAME}</Text>
            </View>
            <View style={[styles.textInputBox]}>
              <View style={[flexDirectionRow]}>
                <View style={{ width: "48%", marginRight: spacings.large, }}>
                  <Text style={[styles.textInputHeading, { color: colors.blackColor }]}>{FIRST_NAME}</Text>
                  <View style={[styles.halfInput, borderRadius5, borderWidth1, flexDirectionRow, alignItemsCenter, { borderColor: colors.grayColor }]}>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        placeholder={FIRST_NAME}
                        placeholderTextColor={colors.grayColor}
                        onChangeText={setFirstName}
                        value={firstName}
                        style={{ color: colors.blackColor }}
                      />
                    </View>
                  </View>
                </View>
                <View style={{ width: "48%", marginRight: spacings.large, }}>
                  <Text style={[styles.textInputHeading, { color: colors.blackColor }]}>{LAST_NAME}</Text>
                  <View style={[styles.halfInput, borderRadius5, borderWidth1, flexDirectionRow, alignItemsCenter, { borderColor: colors.grayColor }]}>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        placeholder={LAST_NAME}
                        placeholderTextColor={colors.grayColor}
                        onChangeText={setLastName}
                        value={lastName}
                        style={{ color: colors.blackColor }}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <Text style={[styles.textInputHeading, { color: colors.blackColor }]}>{"Phone Number"}</Text>
              <View style={[styles.input, borderRadius5, borderWidth1, flexDirectionRow, alignItemsCenter, { borderColor: colors.grayColor }]}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor={colors.grayColor}
                    onChangeText={setPhone}
                    value={phone}
                    keyboardType="phone-pad"
                    style={{ color: colors.blackColor }}
                    maxLength={10}
                  />
                </View>
              </View>
              <Text style={[styles.textInputHeading, { color: colors.blackColor }]}>{EMAIL}</Text>
              <View style={[styles.input, borderRadius5, borderWidth1, flexDirectionRow, alignItemsCenter, { borderColor: colors.grayColor }]}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    placeholder={EMAIL}
                    placeholderTextColor={colors.grayColor}
                    onChangeText={setEmail}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ color: colors.blackColor }}
                  />
                </View>
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              <View style={[flexDirectionRow]}>
                <View style={{ width: "48%", marginRight: spacings.large, }}>
                  <Text style={[styles.textInputHeading, { color: colors.blackColor }]}>{PASSWORD}</Text>
                  <View style={[styles.halfInput, borderRadius5, borderWidth1, flexDirectionRow, alignItemsCenter, { borderColor: colors.grayColor }]}>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        placeholder={PASSWORD}
                        placeholderTextColor={colors.grayColor}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry={!showPassword}
                        style={{ color: colors.blackColor }}
                      />
                    </View>
                    <TouchableOpacity onPress={toggleShowPassword}>
                      <MaterialCommunityIcons name={showPassword ? "eye" : "eye-off"} size={20} color={grayColor} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ width: "48%", marginRight: spacings.large, }}>
                  <Text style={[styles.textInputHeading, { color: colors.blackColor }]}>{CONFIRM_PASSWORD}</Text>
                  <View style={[styles.halfInput, borderRadius5, borderWidth1, flexDirectionRow, alignItemsCenter, { borderColor: colors.grayColor }]}>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        placeholder={CONFIRM_PASSWORD}
                        placeholderTextColor={colors.grayColor}
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        style={{ color: colors.blackColor }}
                      />
                    </View>
                    <TouchableOpacity onPress={toggleShowConfirmPassword}>
                      <MaterialCommunityIcons name={showConfirmPassword ? "eye" : "eye-off"} size={20} color={colors.grayColor} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {confirmPasswordError || error || passwordError ? <Text style={styles.errorText}>{confirmPasswordError || error || passwordError}</Text> : null}
              <Pressable style={[styles.button, alignItemsCenter, borderRadius5]} onPress={handleSendOtp}>
                <Text style={styles.buttonText}>{"Register"}</Text>
              </Pressable>
              <Pressable style={[{ width: "100%", height: hp(6) }, alignJustifyCenter]} onPress={() => { logEvent('SignUp Button clicked From Login Screen'), navigation.navigate("Login") }}>
                <Text style={[{ marginTop: spacings.Large1x, color: colors.blackColor }]}>{ALREADY_HAVE_AN_ACCOUNT}<Text style={[{ color: colors.redColor }]}>{LOGIN}</Text></Text>
              </Pressable>
              <View style={[alignJustifyCenter, { height: hp(9) }]}>
                <View style={[flexDirectionRow, alignJustifyCenter, { width: "100%", marginTop: spacings.large }]}>
                  <View style={{ height: 1, backgroundColor: colors.grayColor, width: "46%" }}></View>
                  <Text style={[{ color: colors.blackColor, margin: spacings.small }, textAlign]}>{"Or"}</Text>
                  <View style={{ height: 1, backgroundColor: colors.grayColor, width: "46%" }}></View>
                </View>
                <View style={[styles.socialAuthBox, alignJustifyCenter, flexDirectionRow]}>
                  <TouchableOpacity style={[styles.socialButton, alignJustifyCenter]} onPress={googleSignUp}>
                    <Image source={GOOGLE_LOGO_IMAGE} style={[{ width: wp(6), height: hp(4) }, resizeModeContain]} />
                  </TouchableOpacity>
                  {/* <TouchableOpacity style={[styles.socialButton, alignJustifyCenter]} onPress={onFacebookButtonPress}>
                    <Image source={FACEBOOK_LOGO_IMAGE} style={[{ width: wp(6), height: hp(4) }, resizeModeContain]} />
                  </TouchableOpacity> */}
                  {Platform.OS === 'ios' && <TouchableOpacity style={[styles.socialButton, alignJustifyCenter]} onPress={appleSignIn} >
                    <Image source={APPLE_LOGO_IMAGE} style={[{ width: wp(6), height: hp(4) }, resizeModeContain]} />
                  </TouchableOpacity>}
                </View>
              </View>
              <Text style={[{ marginTop: spacings.Large1x, color: colors.blackColor }, textAlign]}>{BY_CONTINUING_YOU_AGREE}</Text>
              <View style={[flexDirectionRow, { marginTop: spacings.large, width: "100%" }, alignJustifyCenter]}>
                {/* <TouchableOpacity onPress={() => { setShowWebView(true), setWebViewURL(TERM_OF_SERVICES_URL) }}> */}
                <TouchableOpacity onPress={() => {
                  navigation.navigate('WebViewScreen', {
                    headerText: TERM_OF_SERVICES
                  })
                }}>
                  <Text style={[{ color: colors.blackColor, margin: 4 }, textDecorationUnderline]}>{TERM_OF_SERVICES}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => { setShowWebView(true), setWebViewURL(PRIVACY_POLICY_URL) }}> */}
                <TouchableOpacity onPress={() => {
                  navigation.navigate('WebViewScreen', {
                    headerText: PRIVACY_POLICY
                  })
                }}>
                  <Text style={[{ color: colors.blackColor, margin: 4 }, textDecorationUnderline]}>{PRIVACY_POLICY}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => { setShowWebView(true), setWebViewURL(CONTENT_POLICY_URL) }}>
                  <Text style={[{ color: blackColor, margin: 4 }, textDecorationUnderline]}>{CONTENT_POLICY}</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </>}

        {loading &&
          <LoadingModal visible={loading} />
        }
        {socialLogin &&
          <AuthModal
            modalVisible={socialLogin} setModalVisible={setSocialLogin} onPressFacebook={onFacebookButtonPress} navigation={navigation}
          />}
        {successModalVisible && <SuccessModal
          visible={successModalVisible}
          onClose={() => setSuccessModalVisible(false)}
          onPressContinue={handleSignUp}
        />}
        {
          showWebView && (
            <WebViewModal
              modalVisible={showWebView}
              onClose={() => setShowWebView(false)}
              url={webViewURL}
            />
          )
        }
      </ImageBackground>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    // backgroundColor: whiteColor,
    width: wp(100),
    height: hp(100)
  },
  logoBox: {
    width: "100%",
    height: hp(11),
    marginVertical: spacings.xxxLarge
  },
  text: {
    fontSize: style.fontSizeLarge2x.fontSize,
    fontWeight: style.fontWeightMedium1x.fontWeight,
    color: blackColor,
    fontFamily: 'GeneralSans-Variable'
  },
  title: {
    fontSize: style.fontSizeLarge1x.fontSize,
    fontWeight: style.fontWeightMedium1x.fontWeight,
    marginBottom: spacings.Large2x,
    color: blackColor
  },
  input: {
    width: '100%',
    height: hp(5.5),
    // borderColor: grayColor,
    paddingHorizontal: spacings.xLarge,
    marginVertical: spacings.medium,
  },
  halfInput: {
    width: '100%',
    height: hp(5.5),
    // borderColor: grayColor,
    paddingHorizontal: spacings.large,
    marginVertical: spacings.medium,
    // marginRight: spacings.large,
  },
  button: {
    width: '100%',
    backgroundColor: redColor,
    paddingVertical: spacings.xLarge,
    marginTop: spacings.xxxxLarge
  },
  buttonText: {
    color: whiteColor,
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
  },
  textInputBox: {
    width: "100%",
    height: hp(85)
  },

  errorText: {
    color: redColor
  },
  backIcon: {
    top: -15,
    left: -10,
    // backgroundColor: "red",
    width: wp(10),
    height: hp(5)
  },
  socialAuthBox: {
    width: '100%',
    // marginTop: spacings.ExtraLarge1x
  },
  socialButton: {
    width: wp(12),
    height: wp(12),
    borderRadius: 50,
    borderWidth: .5,
    borderColor: grayColor,
    marginHorizontal: spacings.large
  },
  textInputHeading: {
    fontSize: style.fontSizeNormal1x.fontSize,
    fontWeight: style.fontWeightThin.fontWeight,
    color: blackColor
  },
  image: {
    width: wp(70),
    height: hp(25)
  },
  otpContainer: {
    marginVertical: spacings.xLarge,
    width: "100%"
  },
  otpInput: {
    borderWidth: 1,
    fontSize: 20,
    // color: '#000',
    borderRadius: 5,
    width: "14%"
  },
});

export default RegisterScreen;
