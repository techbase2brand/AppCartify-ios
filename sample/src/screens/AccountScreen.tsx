import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Header from '../components/Header';
import { CART_ICON } from '../assests/images';

import { blackColor, redColor, whiteColor, lightShadeBlue, mediumGray, grayColor } from '../constants/Color'



const AccountScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* {/ Header /} */}
      {/* <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="black" onPress={()=> navigation.goBack()}/>
        </TouchableOpacity>
        <Text style={styles.title}>Account</Text>
        <TouchableOpacity>
          <Icon name="notifications" size={24} color="black" />
        </TouchableOpacity>
      </View> */}
      <Header
        backIcon={true}
        navigation={navigation}
        text={"Account"} />

      {/* {/ User Profile /} */}
      <View style={{ paddingHorizontal: 16 }}>
        <View style={styles.profileContainer}>
          <Image
            // source={{ uri: 'https://via.placeholder.com/100' }} // Replace with your image
            source={require('../assests/notificationimage.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Aman Kumar</Text>
            <TouchableOpacity>
              <Text style={styles.viewActivity}>View activity</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* {/ Shortcuts /} */}
        <View style={styles.shortcutContainer}>
          <TouchableOpacity style={styles.shortcut}>
            <View style={{ backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E6E6E6", borderRadius: 100, height: 35, width: 35, alignItems: 'center', alignContent: "center", paddingTop: 7 }}>
              <AntDesign
                name="hearto"
                size={20}
                color="black"
              />

            </View>
            <Text style={styles.shortcutText}>Favourites</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shortcut}>
            <View style={{ backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E6E6E6", borderRadius: 100, height: 35, width: 35, alignItems: 'center', alignContent: "center", paddingTop: 6 }}>
              <Icon name="attach-money" size={20} color="black" />
            </View>
            <Text style={styles.shortcutText}>Money <Text style={styles.moneyAmount}>$0</Text></Text>
          </TouchableOpacity>
        </View>
        <View style={styles.shortcutContainer}>
          <TouchableOpacity style={styles.shortcut}>
            <View style={{ backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E6E6E6", borderRadius: 100, height: 35, width: 35, alignItems: 'center', alignContent: "center", paddingTop: 6 }}>
              <Image
                source={require('../assests/AccountScreen/profileCart.png')}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
            <Text style={styles.shortcutText}>Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortcut}>
            <View style={{ backgroundColor: "#FFF", borderWidth: 1, borderColor: "#E6E6E6", borderRadius: 100, height: 35, width: 35, alignItems: 'center', alignContent: "center", paddingTop: 6 }}>

              <Image
                source={require('../assests/AccountScreen/order.png')}
                style={{ width: 20, height: 20, resizeMode: "contain" }}
              />
            </View>
            <Text style={styles.shortcutText}>Order</Text>
          </TouchableOpacity>
        </View>

        {/* {/ Sections /} */}
        <TouchableOpacity style={[styles.section, {
          borderWidth: 1,
          borderColor: "#E6E6E6",
          borderRadius: 10,
        }]}>
          <View style={styles.sectionRow}>
            <Image
              source={require('../assests/AccountScreen/mydetails.png')}
              style={{ width: 25, height: 25 }}
            />
            <Text style={styles.sectionText}>My Details</Text>
          </View>
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>

        <View style={[styles.sectionContainer, {
          borderWidth: 1,
          borderColor: "#E6E6E6",
          borderRadius: 10,
          marginTop: 20,

        }]}>

          <View style={{
            marginTop: 10, borderLeftWidth: 5,
            borderLeftColor: redColor,
          }}>
            <Text style={[styles.sectionHeader, {
              paddingLeft: 10,
            }]}>Orders</Text>
          </View>
          <TouchableOpacity style={styles.section}>
            <View style={styles.sectionRow}>
              <Image source={require('../assests/homeaddress.png')} style={{ width: 20, height: 20 }} />
              <Text style={styles.sectionText}>Address Book</Text>
            </View>
            <Icon name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* <View style={styles.sectionDivider} /> */}

        <View style={[styles.sectionContainer, {
          borderWidth: 1,
          borderColor: "#E6E6E6",
          borderRadius: 10,
          marginTop: 20}]}>
          <View style={{
            marginTop: 10,
             borderLeftWidth: 5,
            borderLeftColor: redColor,
          }}>
            <Text style={[styles.sectionHeader, {
              paddingLeft: 10,
            }]}>Events</Text>
          </View>
          <TouchableOpacity style={styles.section}>
            <View style={styles.sectionRow}>
              <Icon name="event-available" size={20} color="black" />
              <Text style={styles.sectionText}>Event Help</Text>
            </View>
            <Icon name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.sectionDivider} />
          <TouchableOpacity style={styles.section}>
            <View style={styles.sectionRow}>
              <Icon name="help-outline" size={20} color="black" />
              <Text style={styles.sectionText}>Frequently asked questions</Text>
            </View>
            <Icon name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* <View style={styles.sectionDivider} /> */}
        
        <View style={[styles.sectionContainer, {
          borderWidth: 1,
          borderColor: "#E6E6E6",
          borderRadius: 10,
          marginTop: 20}]}>
            <View style={{
            marginTop: 10,
             borderLeftWidth: 5,
            borderLeftColor: redColor,
          }}>
        <Text style={[styles.sectionHeader, {
              paddingLeft: 10,
            }]}>More</Text>
            </View>
        <TouchableOpacity style={styles.section}>
          <View style={styles.sectionRow}>
          <Image source={require('../assests/AccountScreen/about.png')} style={{ width: 20, height: 20 }} />
            <Text style={styles.sectionText}>About</Text>
          </View>
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.sectionDivider} />
        <TouchableOpacity style={styles.section}>
          <View style={styles.sectionRow}>
          <Image source={require('../assests/AccountScreen/feedback.png')} style={{ width: 20, height: 20 }} />

            <Text style={styles.sectionText}>Send Feedback</Text>
          </View>
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.sectionDivider} />
        <TouchableOpacity style={styles.section}>
          <View style={styles.sectionRow}>
            <AntDesign name="exclamationcircleo" size={20} color="black" />
            <Text style={styles.sectionText}>Report a Issue</Text>
          </View>
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.sectionDivider} />
        <TouchableOpacity style={styles.section}>
          <View style={styles.sectionRow}>
          <Image source={require('../assests/AccountScreen/help.png')} style={{ width: 24, height: 24 ,resizeMode:"contain" }} />

            <Text style={styles.sectionText}>Help Center</Text>
          </View>
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.sectionDivider} />
        <TouchableOpacity style={styles.section}>
          <View style={styles.sectionRow}>
            <AntDesign name="setting" size={20} color="black" />
            <Text style={styles.sectionText}>Settings</Text>
          </View>
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.sectionDivider} />
        <TouchableOpacity style={styles.section}>
          <View style={styles.sectionRow}>
          <Image source={require('../assests/AccountScreen/product-return.png')} style={{ width: 24, height: 24 ,resizeMode:"contain" }} />
            <Text style={styles.sectionText}>Return & Refunds Policy</Text>
          </View>
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.sectionDivider} />
        <TouchableOpacity style={styles.section}>
          <View style={styles.sectionRow}>
            <Icon name="power-settings-new" size={20} color={redColor} />
            <Text style={[styles.sectionText, { color: redColor }]}>Logout</Text>
          </View>
          <Icon name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 20,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E6E6E6"
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '500',
  },
  viewActivity: {
    color: redColor,
    marginTop: 4,
  },
  shortcutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "flex-start",
    marginBottom: 16,
  },
  shortcut: {
    width: '48%',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E6E6"
  },
  shortcutText: {
    marginTop: 8,
    fontSize: 14,
    // textAlign: 'center',
  },
  moneyAmount: {
    backgroundColor: "#D1FFD0",
    borderRadius: 10,
    color: 'green',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '500',
    // marginBottom: 8,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,


  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionText: {
    marginLeft: 16,
    fontSize: 16,
  },
  sectionDivider: {
    height: 1,
    width: "95%",
    alignSelf: "center",
    backgroundColor: '#eee',
    // marginVertical: 16,
  },
});

export default AccountScreen;
