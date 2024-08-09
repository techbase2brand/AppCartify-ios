import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, KeyboardAvoidingView, FlatList, Keyboard, TouchableOpacity, Image, Pressable, ImageBackground, Platform, } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from './../utils';
import { blackColor, grayColor, whiteColor, lightGrayOpacityColor, mediumGray } from '../constants/Color'
import {
  BEST_DEALS_OF_THE_WEEK, SEARCH_FOR_CLOTHES, POPULAR, ELECTRONIC_BEST_DEALS_OF_THE_WEEK_COLLECTION_ID, ELECTRONIC_POPULAR_PRODUCT_COLLECTION_ID, POPULAR_LIQUOR
  , POPULAR_PRODUCT_COLLECTION_ID, AUTOMOTIVE_POPULAR_PRODUCT_COLLECTION_ID, BEST_DEALS_OF_THE_WEEK_COLLECTION_ID, DRINK_POPULAR_PRODUCT_COLLECTION_ID, DRINK_BEST_DEALS_OF_THE_WEEK_COLLECTION_ID
  // ,BEAUTY_POPULAR_PRODUCT_COLLECTION_ID,BEAUTY_BEST_DEALS_OF_THE_WEEK_COLLECTION_ID,CLOTHING_BEST_DEALS_OF_THE_WEEK_COLLECTION_ID,CLOTHING_POPULAR_PRODUCT_COLLECTION_ID
} from '../constants/Constants'
import type { ShopifyProduct } from '../../@types';
import { BaseStyle } from '../constants/Style';
import { spacings, style } from '../constants/Fonts';
import { logEvent } from '@amplitude/analytics-react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Feather from 'react-native-vector-icons/dist/Feather';
import Header from '../components/Header'
import { BACKGROUND_IMAGE } from '../assests/images';
import { useSelector } from 'react-redux';
import { useThemes } from '../context/ThemeContext';
import { lightColors, darkColors } from '../constants/Color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';



const { alignItemsCenter, alignJustifyCenter, flexDirectionRow, flex, positionRelative, positionAbsolute, resizeModeContain, borderRadius5, justifyContentSpaceBetween } = BaseStyle;
const SearchScreen = ({ navigation }: { navigation: any }) => {
  const selectedItem = useSelector((state) => state.menu.selectedItem);
  const { isDarkMode } = useThemes();
  const colors = isDarkMode ? darkColors : lightColors;
  // const STOREFRONT_DOMAIN = getStoreDomain(selectedItem)
  // const ADMINAPI_ACCESS_TOKEN = getAdminAccessToken(selectedItem)
  // const BEST_DEALS_OF_THE_WEEK_COLLECTION_ID = getBestDealOfWeek(selectedItem)
  // const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [suggestionClicked, setSuggestionClicked] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [inventoryQuantities, setInventoryQuantities] = useState('');
  const [tags, setTags] = useState<string[][]>([]);
  const [options, setOptions] = useState([]);
  const [productVariantsIDS, setProductVariantsIDS] = useState([]);

  useEffect(() => {
    logEvent('Search Screen Initialized');
  }, [])

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSearch = async () => {
    console.log(searchQuery)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Shopify-Access-Token", ADMINAPI_ACCESS_TOKEN);
    const graphql = JSON.stringify({
      query: `
        query SearchProducts($query: String!) {
          products(query: $query, first: 20) {
            edges {
              node {
                id
                title
                title
                status
                tags
                options(first:20){
                  id
                  name
                  values
                }
                variants(first: 20) {
                  edges {
                    node {
                      id
                      price
                      inventoryQuantity
                      title
                      image {
                        originalSrc
                      }
                    }
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      id
                      src
                    }
                  }
                }
              }
            }
          }
        }`,
      variables: {
        query: searchQuery
      }
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: graphql,
      redirect: "follow"
    };
    try {
      const response = await fetch(`https://${STOREFRONT_DOMAIN}/admin/api/2024-04/graphql.json`, requestOptions);
      const result = await response.json();
      const activeProducts = result?.data?.products?.edges?.filter(({ node }) => node.status === 'ACTIVE');
      // console.log("result.data.products.edges",result.data.products.edges)
      const suggestions = activeProducts?.map(({ node }) => {
        return {
          title: node?.title,
          imageSrc: node?.images?.edges[0]?.node?.src || null,
          price: node?.variants?.edges[0]?.node?.price
        };
      });
      setSearchSuggestions(suggestions);
      setSearchResults(activeProducts);
      const inventoryQuantities = activeProducts?.map((productEdge) => {
        const variantEdges = productEdge?.node?.variants?.edges;
        const inventoryQuantitiesForProduct = variantEdges.map((edge) => edge?.node?.inventoryQuantity);
        return inventoryQuantitiesForProduct;
      });
      setInventoryQuantities(inventoryQuantities);
      const tags = activeProducts?.map((productEdge) => productEdge?.node?.tags);
      setTags(tags);

      const options = activeProducts?.map((productEdge) => productEdge?.node?.options);
      setOptions(options);

      const productVariantData = activeProducts?.map((productEdge) =>
        productEdge?.node?.variants?.edges.map((variant) => ({
          id: variant?.node?.id,
          title: variant?.node?.title,
          inventoryQty: variant?.node?.inventoryQuantity,
          image: variant?.node?.image,
          price: variant?.node?.price
        }))
      );
      console.log(productVariantData)
      setProductVariantsIDS(productVariantData)
    } catch (error) {
      console.log(error);
    }
  };

  function getVariant(node: ShopifyProduct) {
    return node?.variants?.edges[0]?.node;
  }

  const fillTextInputWithHint = (hint: string, id?: string) => {
    logEvent(`Selected Popular Hint ${hint}`);
    setSearchQuery(hint);
    setShowSuggestions(false);
    setSuggestionClicked(true);
    navigation.navigate('SearchResultScreen', {
      title: hint,
      id: id
    })
    setSearchQuery('')
  };
  const handleSearchSubmit = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      setRecentSearches((prev) => {
        // Avoid duplicate entries
        if (!prev.includes(trimmedQuery)) {
          return [trimmedQuery, ...prev];
        }
        return prev;
      });
      // setSearchQuexry('');
      Keyboard.dismiss(); // Dismiss the keyboard after search
    }
  };

  const handleRemoveSearch = (item) => {
    setRecentSearches((prev) => prev.filter((search) => search !== item));
  };

  const handleClearAll = () => {
    setRecentSearches([]);
  };
  return (
    <KeyboardAvoidingView
      style={[flex, { height: hp(100) }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* <ImageBackground style={[styles.Container, flex]} source={BACKGROUND_IMAGE}> */}
      <ImageBackground style={[styles.container, flex, { backgroundColor: colors.whiteColor }]} source={isDarkMode ? '' : BACKGROUND_IMAGE}>
        <Header backIcon={true} text={"Search"} navigation={navigation} />
        <View style={{ paddingHorizontal: spacings.large }}>
          <View style={[positionRelative]}>
            <View style={[styles.input, flexDirectionRow, alignItemsCenter, { backgroundColor: isDarkMode ? colors.grayColor : whiteColor, shadowColor: colors.grayColor }]}>
              <Ionicons name="search" size={25} color={isDarkMode ? whiteColor : colors.grayColor} />
              <View style={[flex]}>
                <TextInput
                  placeholder={SEARCH_FOR_CLOTHES}
                  placeholderTextColor={isDarkMode ? whiteColor : grayColor}
                  style={{ color: colors.blackColor }}
                  value={searchQuery}
                  onChangeText={async (text) => {
                    setSearchQuery(text);
                    if (text === '') {
                      setShowSuggestions(false);
                      if (!suggestionClicked) {
                        dismissKeyboard();
                      }
                    } else {
                      setShowSuggestions(searchSuggestions.length > 0);
                      if (searchSuggestions.length > 0) {
                        if (!suggestionClicked) {
                          dismissKeyboard();
                        }
                      }
                      await handleSearch();
                    }
                  }}
                  onSubmitEditing={handleSearchSubmit}
                />
              </View>
            </View>

            {recentSearches?.length > 0 && <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={styles.clearAllText}>Clear all</Text>
              </TouchableOpacity>
            </View>}
            <FlatList
              data={recentSearches}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.recentItem}>
                  <Text>{item}</Text>
                  <TouchableOpacity onPress={() => handleRemoveSearch(item)}>
                    <AntDesign name="closecircleo" size={20} color="#888" />
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<View style={{ marginTop: 100 }}>
                <Ionicons name="search" size={45} color={isDarkMode ? whiteColor : colors.grayColor} style={{ alignSelf: "center" }} />
                <Text style={[styles.recentTitle, { alignSelf: "center", marginVertical: 5, }]}>No Results Found!</Text>
                <Text style={[styles.emptyText, { width: wp(60), alignSelf: "center" }]}>Try a similar word or something more general.</Text>
              </View>}
            />
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  Container: {
    // padding: spacings.large,
    // backgroundColor: whiteColor
    height: hp(100)
  },
  text: {
    fontSize: style.fontSizeLarge.fontSize,
    fontWeight: style.fontWeightThin1x.fontWeight,
    color: blackColor,
  },
  hintText: {
    padding: spacings.large,
    color: grayColor,
    fontSize: style.fontSizeNormal2x.fontSize,
  },
  input: {
    width: "100%",
    height: hp(6),
    borderColor: 'transparent',
    // backgroundColor: whiteColor,
    borderWidth: .1,
    borderRadius: 10,
    paddingHorizontal: spacings.large,
    marginTop: spacings.large,
    // shadowColor: grayColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 1.5,
  },
  suggestionBox: {
    top: hp(7.5),
    left: 0,
    right: 0,
    // backgroundColor: whiteColor,
    zIndex: 1,
    width: wp(95),
    height: hp(83),
    borderRadius: 2
  },

  suggestionItem: {
    padding: spacings.large,
    width: wp(100),
    height: hp(10),
    zIndex: 1,
  },
  // container: {
  //   flex: 1,
  //   paddingHorizontal: 16,
  //   backgroundColor: '#fff',
  // },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginVertical: 16,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearAllText: {
    color: 'red',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 0,
  },

});

export default SearchScreen;
