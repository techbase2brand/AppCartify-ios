import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderSummary = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.row,{marginBottom:2}]}>
        <View style={styles.iconTextContainer}>
          <Image source={require('../assests/homeaddress.png')} style={{width:20, height:20}}/>
          <Text style={styles.label}>Delivery at Home</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#000" />
      </TouchableOpacity>
      <Text style={styles.address}>49 Featherstone Street...</Text>
      <Text style={styles.instructions}>Add Instructions for delivery partner</Text>
      
      
      <View style={styles.dashedSeparator} />
      
      <View style={styles.iconTextContainer}>
        <Image source={require('../assests/phone-call.png')} style={{width:20, height:20}}/>

        <Text style={styles.contact}>Elmer Roberts, +51-128 258 3698</Text>
      </View>
      
      <View style={styles.dashedSeparator} />
      
      <TouchableOpacity style={styles.row}>
        <View style={styles.iconTextContainer}>
          <View style={styles.billContainer}>
        
        <Image source={require('../assests/invoice.png')} style={{width:20, height:20}}/>

        <View style={{flexDirection:"column"}}>

        <View style={{ flexDirection:"row"}}>
            <Text style={[styles.label,{fontSize:16}]}>Total Bill</Text>
            <Text style={styles.bill}>
              <Text style={styles.strikethrough}>$642.09</Text> $501.68
            </Text>
            </View>
            <Text style={[styles.taxInfo,{marginLeft: 8}]}>Incl. Taxes and charges</Text>
            </View>
            </View>
            </View>
        
       

        <Icon name="chevron-right" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf:"center",
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderWidth:1,
    width:"95%",
    borderColor:"#E6E6E6",
    paddingVertical:10,
    borderRadius:10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    // borderBottomWidth:1,
  
    // borderStyle:"dashed"
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical:10
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    marginLeft: 28,  // Adjust to align with the icon
  },
  instructions: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 28,  // Adjust to align with the icon
  },
  contact: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  dashedSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E6E6',
    // borderStyle: 'dotted',
    marginBottom: 8,
    // marginLeft: 28,
    // marginTop:10  // Adjust to align with the icon
  },
  billContainer: {
    flexDirection:"row",
    // marginLeft: 8,
  },
  bill: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: 8,
  },
  taxInfo: {
    fontSize: 12,
    color: '#999',
  },
});

export default OrderSummary;
