import React, { useState, useEffect,useRef, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Text, Image, Pressable, ActivityIndicator, TouchableOpacity, FlatList, Alert, ImageBackground, Linking } from 'react-native';
import { Colors, useTheme } from '../context/Theme';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import { useCart } from '../context/Cart';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { REEL_PLAY_WHITE } from '../assests/images';

import { currency } from '../utils';
import FeatureIcons from '../components/FeatureIcons'
import Toast from 'react-native-simple-toast';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Share from 'react-native-share';
import axios from 'axios';
import { blackColor, redColor, whiteColor, lightGrayOpacityColor, goldColor, lightPink, grayColor } from '../constants/Color';
import { spacings, style } from '../constants/Fonts';
import { BaseStyle } from '../constants/Style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import {Videos, QUNATITY, getStoreDomain, getAdminAccessToken, YOU_MIGHT_LIKE, RATING_REVIEWS, getStoreFrontAccessToken, STOREFRONT_DOMAIN, ADMINAPI_ACCESS_TOKEN, STOREFRONT_ACCESS_TOKEN } from '../constants/Constants';
import { logEvent } from '@amplitude/analytics-react-native';
import { ShopifyProduct } from '../../@types';
import RecommendedVideo from '../components/RecommendedVideo';

import { BACKGROUND_IMAGE, LADY_DONALD_RICE } from '../assests/images';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/actions/wishListActions';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';

import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Header from '../components/Header';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import LoadingModal from '../components/Modal/LoadingModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemes } from '../context/ThemeContext';
import { lightColors, darkColors } from '../constants/Color';
const { alignJustifyCenter, flexDirectionRow, resizeModeCover, justifyContentSpaceBetween, borderRadius10, borderRadius5, textAlign, positionAbsolute,
  alignItemsCenter, resizeModeContain, textDecorationUnderline } = BaseStyle;

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

function ProductDetailsScreen({ navigation, route }: Props) {
  const selectedItem = useSelector((state) => state.menu.selectedItem);
  // const STOREFRONT_DOMAIN = getStoreDomain(selectedItem)
  // const ADMINAPI_ACCESS_TOKEN = getAdminAccessToken(selectedItem)
  const { colors } = useTheme();
  const { addToCart, addingToCart } = useCart();
  const styles = createStyles(colors);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const { tags, option, ids, product } = route?.params;
  console.log("product...",product);
  
  const [selectedOptions, setSelectedOptions] = useState({});
  const dispatch = useDispatch();
  const { isDarkMode } = useThemes();
  const themecolors = isDarkMode ? darkColors : lightColors;
  if (!route?.params) {
    return null;
  }

  useEffect(() => {
    logEvent('Product Details Screen Initialized');
  }, [])

  // useEffect(() => {
  //   const fetchRelatedProducts = async () => {
  //     try {
  //       // Constructing the tags string from array

  //       const tagsString = tags.join(',');
  //       const excludedProductTitle = route?.params?.product.title;
  //       const response = await axios.get(`https://${STOREFRONT_DOMAIN}/admin/api/2024-04/products.json?tags=${tagsString}`, {
  //         headers: {
  //           'X-Shopify-Access-Token': ADMINAPI_ACCESS_TOKEN,
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       if (response.data.products) {
  //         console.log("Response data:", response?.data);

  //         // Logging each product's tags for verification
  //         // response.data.products.forEach((product, index) => {
  //         //   console.log(`Product ${index + 1} tags:`, product.tags);
  //         // });

  //         // Filtering products based on tags
  //         const filteredProducts = response?.data?.products?.filter(product => {
  //           const excludeProduct = tags.includes(product?.title) || product?.title === excludedProductTitle;
  //           const includeProduct = tags.some(tag => product?.tags?.includes(tag) || product?.title?.includes(tag));
  //           if (!excludeProduct && includeProduct) {
  //             // console.log(`Included Product: ${product.title}`);
  //             return true;
  //           } else {
  //             // console.log(`Excluded Product: ${product.title}`);
  //             return false;
  //           }
  //         });
  //         // const filteredProducts = response.data.products.filter(product =>
  //         //   tags.some(tag => product.tags.includes(tag))
  //         // );

  //         console.log("Filtered Products:", filteredProducts);

  //         // Update state with filtered products
  //         setRelatedProducts(filteredProducts);
  //       }
  //     } catch (error) {
  //       console.log('Error fetching related products:', error);
  //     }
  //   };

  //   if (tags.length > 0) {
  //     fetchRelatedProducts();
  //   } else {
  //     // Clear related products when tags are empty
  //     setRelatedProducts([]);
  //   }

  // }, [tags]);
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Constructing the tags string from the array
        const tagsString = tags?.join(',');
        const excludedProductTitle = route?.params?.product?.title;

        const response = await axios.get(`https://${STOREFRONT_DOMAIN}/admin/api/2024-04/products.json?tags=${tagsString}`, {
          headers: {
            'X-Shopify-Access-Token': ADMINAPI_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
        });

        if (response.data.products) {
          // Filtering products based on tags and ensuring they are active
          const filteredProducts = response.data.products.filter(product => {
            const isActive = product.status === 'active';
            const isExcluded = product.title === excludedProductTitle || tags?.includes(product.title);
            const hasMatchingTag = tags?.some(tag => product.tags?.includes(tag));

            return isActive && !isExcluded && hasMatchingTag;
          });

          // Update state with filtered products
          setRelatedProducts(filteredProducts);
        }
      } catch (error) {
        console.log('Error fetching related products:', error);
      }
    };

    if (tags?.length > 0) {
      fetchRelatedProducts();
    } else {
      // Clear related products when tags are empty
      setRelatedProducts([]);
    }
  }, [tags, route?.params?.product?.title]);
  const handleSelectOption = (optionName, value) => {
    logEvent(`Selected Product  variant Name:${optionName} Value:${value}`);
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [optionName]: value,
    }));
  };

  const onAddtoCartProduct = async (id: any, quantity: number) => {
    logEvent(`Add To Cart  Product variantId:${id} Qty:${quantity}`);
    console.log("addto cart id", id, quantity)
    await addToCart(id, quantity);
    navigation.navigate('CartModal');
    Toast.show(`${quantity} item${quantity !== 1 ? 's' : ''} added to cart`);
  };

  return (
    <ImageBackground style={[styles.container, { backgroundColor: themecolors.whiteColor }]} source={isDarkMode ? '' : BACKGROUND_IMAGE}>
      <Header
        backIcon={true} text={route?.params?.product.title}
        shoppingCart={true} navigation={navigation} />
      <ProductDetails
        product={route?.params?.product}
        onAddToCart={(variantId: string, quantity: number) => onAddtoCartProduct(variantId, quantity)}
        loading={
          route?.params.variant
            ? addingToCart.has(route?.params?.variant?.id)
            : false
        }
        inventoryQuantity={route?.params?.inventoryQuantity}
        relatedProducts={relatedProducts}
        options={option}
        selectedOptions={selectedOptions}
        handleSelectOption={handleSelectOption}
        ids={route?.params?.ids}
        navigation={navigation}
      />
    </ImageBackground>
  );
}

const getVariant = (product: ShopifyProduct) => {
  if (product.variants?.edges?.length > 0) {
    return product?.variants?.edges[0]?.node;
  } else if (product?.variants?.nodes?.length > 0) {
    return product?.variants?.nodes[0];
  } else {
    return null;
  }
};

function ProductDetails({
  product,
  onAddToCart,
  loading = false,
  inventoryQuantity,
  relatedProducts,
  options,
  selectedOptions,
  handleSelectOption,
  ids,
  navigation
}: {
  product: ShopifyProduct;
  loading?: boolean;
  onAddToCart: (variantId: string, quantity: number) => void;
  inventoryQuantity?: Boolean,
  relatedProducts?: ShopifyProduct[],
  options?: any[];
  selectedOptions: any;
  handleSelectOption: (optionName: string, value: string) => void;
  ids?: string,
}) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const image = (product?.images?.nodes) ? (product?.images?.nodes[0]?.src) : (product?.images?.edges) ? (product?.images?.edges[0]?.node) : (product?.image?.src);
  const variant = getVariant(product);
  const [quantity, setQuantity] = useState(1);
  const outOfStock = inventoryQuantity && inventoryQuantity[0] <= 0;
  const variantSelected = Object.keys(selectedOptions).length > 0;
  const dispatch = useDispatch();
  const wishList = useSelector(state => state.wishlist.wishlist);
  const isSelected = wishList.some(item => item.id === product.id);
  const [expanded, setExpanded] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [shareProductloading, setShareProductLoading] = useState(false);
  const [shopCurrency, setShopCurrency] = useState('');
  const selectedItem = useSelector((state) => state.menu.selectedItem);
  // const STOREFRONT_ACCESS_TOKEN = getStoreFrontAccessToken(selectedItem)
  // const STOREFRONT_DOMAIN = getStoreDomain(selectedItem)
  // const ADMINAPI_ACCESS_TOKEN = getAdminAccessToken(selectedItem)
  const { isDarkMode } = useThemes();
  const themecolors = isDarkMode ? darkColors : lightColors;

  useEffect(() => {
    // Check if no option is selected
    if (!variantSelected && options?.length > 0) {
      // Loop through each option and select the first value
      options?.forEach(option => {
        handleSelectOption(option.name, option.values[0]);
      });
    }
  }, [variantSelected, options]);
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const shopCurrency = await AsyncStorage.getItem('shopCurrency');
        if (shopCurrency) {
          setShopCurrency(shopCurrency);
        }
      } catch (error) {
        console.error('Error fetching shop currency:', error);
      }
    };
    fetchCurrency();
  }, []);

  const getIsFavSelected = (productId) => {
    const isFav = wishList.some(item => item.admin_graphql_api_id === productId);
    return isFav;
  }

  const incrementQuantity = () => {
    logEvent('Increase Product Quantity');
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    logEvent('Decrease Product Quantity');
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getSelectedVariantId = () => {
    const selectedOptionString = Object.values(selectedOptions).join(' / ');
    const selectedVariant = ids?.find(variant => variant.title === selectedOptionString);
    return selectedVariant ? selectedVariant.id : null;
  }

  const getInventoryQuantity = () => {
    const selectedVariantId = getSelectedVariantId();
    console.log("selectedVariantId", selectedVariantId)
    if (selectedVariantId) {
      const selectedVariant = ids?.find(variant => variant.id === selectedVariantId);
      return selectedVariant ? selectedVariant.inventoryQty : 0;
    }
    return 0;
  }

  const getProductHandleById = async (id: string) => {
    const query = `
      query($id: ID!) {
        product(id: $id) {
          handle
        }
      }
    `;
    const variables = {
      id: id
    };
    const response = await fetch(`https://${STOREFRONT_DOMAIN}/api/2023-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables })
    });
    const responseData = await response.json();
    console.log(responseData)
    if (responseData.errors) {
      console.error('Error fetching product handle:', responseData.errors);
      return null;
    }
    return responseData.data.product.handle;
  };

  const generateLink = async (id: string) => {
    try {
      const link = await dynamicLinks().buildShortLink({
        link: `https://checkoutkitreactnative.page.link/Zi7X?productId=${id}`,
        domainUriPrefix: 'https://checkoutkitreactnative.page.link',
        android: {
          packageName: 'com.shopify.checkoutkitreactnative',
        },
        // ios: {
        //   appStoreId: '123456789',
        //   bundleId: 'com.deepLinkingProjectBundleId',
        // },
      }, dynamicLinks.ShortLinkType.DEFAULT)
      console.log('link:', link)
      return link
    } catch (error) {
      console.log('Generating Link Error:', error)
    }
  }

  const shareProduct = async (id: string) => {
    setShareProductLoading(true)
    logEvent('Share Product Button Clicked');
    const getLink = await generateLink(id)
    try {
      const handle = await getProductHandleById(id);

      if (!handle) {
        throw new Error('Product handle not found');
      }

      const shareUrl = getLink;
      const shareOptions = {
        title: 'Share Product',
        // message: `Check out this product: ${product.title}\nhttps://${STOREFRONT_DOMAIN}/products/${handle}`,
        message: `Check out this product: ${shareUrl}`,
      };
      setShareProductLoading(false)
      await Share.open(shareOptions);

      logEvent(`Share Product Name: ${product.title}`);

    } catch (error) {
      console.log('Error => ', error);
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const onPressFavButton = () => {
    // setIsSelected(!isSelected);
    if (!isSelected) {
      logEvent(`Product Add to wishlish ProductId: ${product.id}`);
      dispatch(addToWishlist(product));
    } else {
      logEvent(`Product remove from wishlist ProductId: ${product.id}`);
      dispatch(removeFromWishlist(product));
    }
  };

  const handlePress = (item) => {
    console.log("handelePress", item)
    if (!getIsFavSelected(item.admin_graphql_api_id)) {
      logEvent(`Product Add to wishlish ProductId: ${item.admin_graphql_api_id}`);
      dispatch(addToWishlist(item));
    } else {
      logEvent(`Product remove from wishlist ProductId: ${item.admin_graphql_api_id}`);
      dispatch(removeFromWishlist(item.admin_graphql_api_id));
    }
  };

  //Add to Cart Product
  const onAddToCartRelatedProduct = (variantId, qty) => {
    setLoadingProductId(variantId);
    onAddToCart(variantId, qty).then(() => {
      setLoadingProductId(null);
    });
  };

  const VIDEO_DURATION = 5000;
  const [visibleVideoIndices, setVisibleVideoIndices] = useState([]);
  const [playingIndex, setPlayingIndex] = useState(0);
  const timerRef = useRef(null);

  const viewabilityConfig1 = useRef({
    viewAreaCoveragePercentThreshold: 50, // Determines what percentage of the item is visible
  }).current;

  const clearAllTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlayingVideo = () => {
    setPlayingIndex((prevIndex) => (prevIndex + 1) % visibleVideoIndices.length);
  };

  useEffect(() => {
    clearAllTimers();
    if (visibleVideoIndices.length > 0) {
      setPlayingIndex(0);
      timerRef.current = setInterval(togglePlayingVideo, VIDEO_DURATION);
    }

    return () => clearAllTimers();
  }, [visibleVideoIndices]);

  const onViewableItemsChanged1 = useRef(({ viewableItems }) => {
    const newVisibleIndices = viewableItems.map(item => item.index);
    if (newVisibleIndices.join() !== visibleVideoIndices.join()) {
      setVisibleVideoIndices(newVisibleIndices);
    }
  }).current;

  const renderItem1 = useCallback(
    ({ item, index }) => (
      <View style={styles.videoContainer}>
        <RecommendedVideo
          item={item}
          isPlaying={visibleVideoIndices[playingIndex] === index}
        />
      </View>
    ),
    [visibleVideoIndices, playingIndex]
  );
  const staticWishList = [
    {
      id: '1',
      title: 'Lorem ipsum dolor sit amet consectetur',
      images: {
        edges: [{ node: { url: 'https://d9h69f5ndiadk.cloudfront.net/storage/2024/June/week2/150_862716cb7c14fbfe75dfd3a7d7a9b053.mp4' } }]
      },
      variants: {
        edges: [{ node: { price: { amount: '$25.00', currencyCode: 'USD' }, id: 'variant1', inventoryQuantity: 10 } }]
      }
    },
    {
      id: '2',
      title: 'Lorem ipsum dolor sit amet consectetur',
      images: {
        edges: [{ node: { url: 'https://d9h69f5ndiadk.cloudfront.net/storage/2024/June/week2/168_c3b95aad0ae7e748b84c2dd6fb027560.mp4' } }]
      },
      variants: {
        edges: [{ node: { price: { amount: '$30.00', currencyCode: 'USD' }, id: 'variant2', inventoryQuantity: 0 } }]
      }
    },
    // {
    //   id: '3',
    //   title: 'Lorem ipsum dolor sit amet consectetur',
    //   images: {
    //     edges: [{ node: { url: 'https://d9h69f5ndiadk.cloudfront.net/storage/2024/June/week2/150_862716cb7c14fbfe75dfd3a7d7a9b053.mp4' } }]
    //   },
    //   variants: {
    //     edges: [{ node: { price: { amount: '$25.00', currencyCode: 'USD' }, id: 'variant1', inventoryQuantity: 10 } }]
    //   }
    // },
    // {
    //   id: '4',
    //   title: 'Lorem ipsum dolor sit amet consectetur',
    //   images: {
    //     edges: [{ node: { url: 'https://d9h69f5ndiadk.cloudfront.net/storage/2024/June/week2/168_c3b95aad0ae7e748b84c2dd6fb027560.mp4' } }]
    //   },
    //   variants: {
    //     edges: [{ node: { price: { amount: '$30.00', currencyCode: 'USD' }, id: 'variant2', inventoryQuantity: 0 } }]
    //   }
    // }
  ];
  return (
    <View>
      <ScrollView
        style={{ width: "100%", height: "93.8%", paddingBottom: spacings.large }}
        showsVerticalScrollIndicator={false}
      >
        <View key={product?.id} style={[styles.productItem, borderRadius10, { width: "100%", paddingBottom: hp(12)}]}>
          {/* <Image
            resizeMethod="resize"
            style={[styles.productImage, resizeModeCover, borderRadius10]}
            alt={image?.altText}
            source={{ uri: (image?.src) ? (image?.src) : (image?.url) ? (image?.url) : image }}
          /> */}
          <View style={{width:wp(95), height:hp(40),overflow:"hidden", borderRadius:10}}>
          <Video
          bufferConfig={{
            minBufferMs: 2000,
            maxBufferMs: 5000,
            bufferForPlaybackMs: 1000,
            bufferForPlaybackAfterRebufferMs: 1500,
          }}
          // poster={item?.thumb_url}
          // posterResizeMode={'cover'}
          source={{ uri: convertToProxyURL(product?.url) }}
          style={{width:"100%", height:"100%"}}
          resizeMode="cover"
          repeat={true}
          muted
          maxBitRate={2000000}
          hideShutterView={true}
          onBuffer={e => {
            console.log('e.isBuffering', e.isBuffering);
            if (e.isBuffering == true) {
              // setLoading(true);
                
            } else {
              // setLoading(false);
            }
          }}

        />
        </View>
          <TouchableOpacity style={[positionAbsolute, alignJustifyCenter, styles.favButton]} onPress={onPressFavButton}>
            <AntDesign
              name={isSelected ? "heart" : "hearto"}
              size={18}
              color={redColor}
            />
          </TouchableOpacity>
          <View style={[styles.productText, justifyContentSpaceBetween]}>
            <View>
              <View style={[flexDirectionRow, { width: "100%" }]}>
                <View style={{ width: "90%" }}>
                  <Text style={[styles.productTitle, { color: themecolors.blackColor }]}>Regular Fit Slogen</Text>
                </View>
                <TouchableOpacity style={[alignJustifyCenter, styles.shareButton]} onPress={() => shareProduct(product.id)}>
                <Image
            source={require('../assests/shareRed.png') }
            style={{
              width: 24,
              height: 24,
              marginVertical: 10,
              objectFit: 'contain',
            }}
          />
                  {/* <FontAwesome name="share" size={20} color={isDarkMode ? themecolors.lightPink : "#B5A2A2"} /> */}
                </TouchableOpacity>
              </View>
              <View style={[flexDirectionRow, { width: "100%" ,marginVertical:10}]}>
                {/* <Text style={[styles.productPrice, { color: themecolors.blackColor }]}>{(variant?.price?.amount) ? (variant?.price?.amount) : (variant?.price)} {(variant?.price?.currencyCode) ? (variant?.price?.currencyCode) : shopCurrency}</Text> */}
                
                <Text style={[styles.productPrice, { color: themecolors.blackColor }]}>$ 620</Text>
                <Pressable style={[flexDirectionRow, alignItemsCenter, { marginLeft: spacings.large }]}>
                  <FontAwesome name="star" size={15} color={goldColor} />
                  <Text style={[styles.productDescription, { color: themecolors.blackColor }]}>  <Text style={[styles.productDescription, textDecorationUnderline, { fontWeight: style.fontWeightMedium1x.fontWeight, color: themecolors.blackColor }]}>4.0/5</Text> (45 reviews)</Text>
                </Pressable>
              </View>
              {/* {product.description && */}
               <Pressable onPress={toggleExpanded} style={{ marginVertical: spacings.large }}>
                <Text style={[styles.productDescription, { color: "#808080" }]} numberOfLines={expanded ? null : 3}
                  ellipsizeMode="tail">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat  </Text>
              </Pressable>
              {/* }mar  */}
            </View>
            <View style={{ marginBottom: spacings.large }}>
              {/* <Text style={styles.relatedProductsTitle}>{SELECT_VARIANTS}</Text> */}
              <View>
                {/* {options?.map((option, index) => (
                  <View key={index} style={styles.optionContainer}>
                    <Text style={styles.relatedProductsTitle}>Choose {option?.name}</Text>
                    <View style={[flexDirectionRow, { marginTop: spacings.large }]}>
                      <ScrollView horizontal>
                        {option?.values.map((value, idx) => (
                          <TouchableOpacity key={idx} onPress={() => handleSelectOption(option?.name, value)} style={[styles.optionValueContainer, flexDirectionRow, borderRadius5, alignJustifyCenter, selectedOptions[option.name] === value ? { backgroundColor: redColor, borderWidth: 0 } : { backgroundColor: whiteColor }]}>
                            <Text style={[styles.optionValue, selectedOptions[option?.name] === value && { color: whiteColor }]}>{value}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                ))} */}
                {options?.map((option, index) => {
                  if (option.name === "Title" && option.values.includes("Default Title")) {
                    return null; // Skip rendering this option
                  }

                  return (
                    <View key={index} style={styles.optionContainer}>
                      <Text style={[styles.relatedProductsTitle, { color: themecolors.blackColor }]}>Choose {option?.name}</Text>
                      <View style={[flexDirectionRow, { marginTop: spacings.large }]}>
                        <ScrollView horizontal>
                          {option?.values.map((value, idx) => (
                            <TouchableOpacity
                              key={idx}
                              onPress={() => handleSelectOption(option?.name, value)}
                              style={[
                                styles.optionValueContainer,
                                flexDirectionRow,
                                borderRadius5,
                                alignJustifyCenter,
                                selectedOptions[option.name] === value
                                  ? { backgroundColor: themecolors.redColor, borderWidth: 0 }
                                  : { backgroundColor: themecolors.whiteColor }
                              ]}
                            >
                              <Text style={[styles.optionValue, selectedOptions[option?.name] === value && { color: themecolors.whiteColor }]}>
                                {value}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  );
                })}
              </View>

            </View>
            <FeatureIcons/>
            <View style={{ marginBottom: spacings.large }}>
              <Text style={[styles.relatedProductsTitle, { color: themecolors.blackColor }]}>{RATING_REVIEWS}</Text>
              <View style={[styles.reviewSection, flexDirectionRow, alignItemsCenter]}>
                <View style={[{ width: wp(30) }, justifyContentSpaceBetween, flexDirectionRow]}>
                  <FontAwesome name="star" size={17} color={themecolors.goldColor} />
                  <FontAwesome name="star" size={17} color={themecolors.goldColor} />
                  <FontAwesome name="star" size={17} color={themecolors.goldColor} />
                  <FontAwesome name="star" size={17} color={themecolors.goldColor} />
                  <FontAwesome name="star-o" size={17} color={themecolors.goldColor} />
                </View>
                <Text style={[styles.optionValue, { marginLeft: spacings.large, backgroundColor: lightGrayOpacityColor, paddingHorizontal: spacings.large, borderRadius: 5 }]}>4/5</Text>
              </View>
              <View style={[flexDirectionRow, alignItemsCenter]}>
                <View style={[{ width: wp(20), height: hp(10) }, alignItemsCenter]}>
                  <Image source={LADY_DONALD_RICE} style={[resizeModeContain, { width: wp(13), height: wp(13) }]} />
                </View>
                <View style={{ width: "75%" }}>
                  <Text style={[styles.productPrice, { padding: spacings.small, color: themecolors.blackColor }]}>Donald Rice</Text>
                  <View style={[{ width: wp(30), height: hp(3), paddingLeft: spacings.large }, justifyContentSpaceBetween, flexDirectionRow]}>
                    <FontAwesome name="star" size={17} color={themecolors.goldColor} />
                    <FontAwesome name="star" size={17} color={themecolors.goldColor} />
                    <FontAwesome name="star" size={17} color={themecolors.goldColor} />
                    <FontAwesome name="star" size={17} color={themecolors.goldColor} />
                    <FontAwesome name="star-o" size={17} color={themecolors.goldColor} />
                  </View>
                  <Text style={[styles.productDescription, { fontSize: style.fontSizeSmall1x.fontSize, color: themecolors.blackColor }]}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed ...</Text>
                </View>
               
              </View>
              <Pressable style={[styles.outOfStockButton, borderRadius10, {marginVertical:20}]} onPress={()=> navigation.navigate("ReviewScreen")}>
              <Text style={[styles.addToCartButtonText, textAlign]}>
                View All Reviews
              </Text>
            </Pressable>
            <Text style={[styles.relatedProductsTitle, { color: themecolors.blackColor , marginBottom:20}]}>Seller</Text>

            <View style={[flexDirectionRow, alignItemsCenter]}>
                <View style={[{ width: wp(20), height: hp(10) }, alignItemsCenter]}>
                  <Image source={LADY_DONALD_RICE} style={[resizeModeContain, { width: wp(13), height: wp(13) }]} />
                </View>
                <View style={{ width: "75%" }}>
                  <Text style={[styles.productPrice, { padding: spacings.small, color: themecolors.blackColor }]}>David Smith</Text>
                  
                  <Text style={[styles.productDescription, { fontSize: style.fontSizeSmall1x.fontSize, color: themecolors.blackColor }]}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed ...</Text>
                </View>
               
              </View>
              <Pressable style={[styles.outOfStockButton, borderRadius10, {marginVertical:20}]}>
                <View style={{flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                <Text style={[styles.addToCartButtonText, textAlign]}>
                View Profile  
              </Text>
              <EvilIcons name="external-link" size={27} color={whiteColor} style={{marginTop:0}} />

                </View>
              
            </Pressable>

            {/* Recommended videos section */}
            <View style={{ marginVertical: 10, marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent:"space-between", marginBottom: 10 }}>
                {/* <Image source={REEL_PLAY_BLACK} style={styles.reelIcon} /> */}
                <Text
                  style={{
                    fontSize: 18,
                    marginTop: 5,
                    fontWeight: '600',
                    color: blackColor,
                  }}>
                  Recommended
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 5,
                    fontWeight: '500',
                    color: redColor,
                  }}>
                  See All
                </Text>
              </View>
              {/* </View> */}
              <FlatList
                data={Videos}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem1}
                keyExtractor={item => item.video_id}
                // onViewableItemsChanged={onViewableItemsChanged1}
                // viewabilityConfig={viewabilityConfig1}
                // getItemLayout={(data, index) => (
                //   { length: width, offset: width * index, index }
                // )}
              />
              
            </View>


            {/* //You Might Like Section */}
            <Text style={[styles.relatedProductsTitle, { color: themecolors.blackColor , marginVertical:14}]}>You Might Like </Text>

            <View style={[styles.detailsBox]}>
            <FlatList
              data={staticWishList}
              keyExtractor={(item) => item?.id?.toString()}
              numColumns={2}
              renderItem={({ item, index }) => {
                const imageUrl = item?.images?.edges?.[0]?.node?.url ?? item?.images?.nodes?.[0]?.url ?? item?.images?.[0]?.src;
                const itemPrice = item?.variants?.edges?.[0]?.node?.price?.amount ?? item?.variants?.nodes?.[0]?.price ?? item?.variants?.[0]?.price;
                const itemCurrencyCode = item?.variants?.edges?.[0]?.node?.price?.currencyCode ?? null;
                const inventoryQuantity = item?.variants?.nodes ? item?.variants?.nodes[0]?.inventoryQuantity : (item?.variants?.[0]?.inventory_quantity ? item?.variants?.[0]?.inventory_quantity : (Array.isArray(item?.inventoryQuantity) ? item?.inventoryQuantity[0] : item?.inventoryQuantity));
                const variantId = item?.variants?.edges ? item?.variants.edges[0]?.node.id : item.variants.nodes ? item.variants.nodes[0].id : item.variants[0].admin_graphql_api_id;
                return (
                  <View style={[styles.itemContainer,
                    // { backgroundColor: isDarkMode ? grayColor : whiteColor }
                  ]}>
                    <Pressable style={[positionAbsolute, alignJustifyCenter, styles.favButton, { backgroundColor: "white", borderRadius: 100, padding: 4 }]} onPress={() => handlePress(item)}>
                      <AntDesign
                        name={"heart"}
                        size={18}
                        color={redColor}
                      />
                    </Pressable>

                    <Pressable style={[positionAbsolute, alignJustifyCenter, styles.favButton1]} onPress={() => handlePress(item)}>
                      <Image source={REEL_PLAY_WHITE}
                        style={{
                          width: 25,
                          height: 25,
                        }} />
                    </Pressable>
                    {/* <Image
                        source={{ uri: imageUrl }}
                        style={[styles.productImage ]}
                      /> */}


                    {/* <View style={{ width: 150, borderRadius: 10 }}> */}
                    <TouchableOpacity style={{width:170,height: hp(20), borderRadius:10,overflow:"hidden" }}  >
                      <Video
                        bufferConfig={{
                          minBufferMs: 2000,
                          maxBufferMs: 5000,
                          bufferForPlaybackMs: 1000,
                          bufferForPlaybackAfterRebufferMs: 1500,
                        }}
                        // poster={item?.thumb_url}
                        // posterResizeMode={'cover'}
                        source={{ uri: convertToProxyURL(imageUrl) }}
                        style={{ width: "100%",
                        height: "100%",
                        }}
                        resizeMode="cover"
                        repeat={true}
                        maxBitRate={2000000}
                        hideShutterView={true}
                        onBuffer={e => {
                          console.log('e.isBuffering', e.isBuffering);
                          if (e.isBuffering == true) {
                            // setLoading(true);

                          } else {
                            // setLoading(false);
                          }
                        }}

                      />
                    </TouchableOpacity>
                    {/* </View> */}

                    <View style={{ width: "100%", height: hp(7), alignItems: "center", justifyContent: "center" }}>
                      <Text style={[styles.wishListItemName, { color: blackColor }]}>{item?.title}</Text>
                      {/* <Text style={[styles.wishListItemPrice]}>{itemCurrencyCode}</Text> */}

                    </View>
                    <View style={[{ width: "100%", flexDirection: "row", paddingTop: 1, justifyContent: "space-between" }]}>
                      {itemPrice && <View style={{ paddingTop: 8 }}>
                        <Text style={[styles.wishListItemPrice, { color: blackColor }]}>{itemPrice} </Text>
                      </View>
                      }
                      <TouchableOpacity style={styles.buyButton}>
                        <Text style={{ color: '#fff', alignSelf: 'center' }}>Buy Now</Text>
                      </TouchableOpacity>
                      {/* {inventoryQuantity <= 0 ? <Pressable
                          style={[styles.addtocartButton, borderRadius10, alignJustifyCenter]}
                        >
                          <Text style={styles.addToCartButtonText}>Out of stock</Text>
                        </Pressable>
                          : <Pressable
                            style={[styles.addtocartButton, borderRadius10, alignJustifyCenter]}
                            onPress={() => addToCartProduct(item, 1)}
                          >
                            {loadingProductId === variantId ? <ActivityIndicator size="small" color={whiteColor} /> :
                              <Text style={styles.addToCartButtonText}>Add To Cart</Text>}
                          </Pressable>} */}
                    </View>
                  </View>
                );
              }}
            />
          </View>
              {/* <TouchableOpacity style={[styles.button, alignItemsCenter, borderRadius5]} onPress={onPreesViewReviewAll}>
                <Text style={styles.buttonText}>{VIEW_ALL_REVIEWS}</Text>
              </TouchableOpacity> */}
            </View>
            {/* <View style={[{ width: wp(95), height: hp(8), marginVertical: spacings.normal }, flexDirectionRow, justifyContentSpaceBetween, alignItemsCenter]}>
              <View>
                <Text style={{ paddingVertical: spacings.small, color: redColor, fontSize: style.fontSizeLarge.fontSize }}>{PRICE}:</Text>
                <Text style={styles.productPrice}>{(variant?.price?.amount) ? (variant?.price?.amount) : (variant?.price)} {variant?.price?.currencyCode}</Text>
              </View>
              <TouchableOpacity style={[alignJustifyCenter, styles.shareButton]} onPress={shareProduct}>
                <FontAwesome name="share" size={25} color={blackColor} />
              </TouchableOpacity>
            </View> */}
          </View>
          {relatedProducts?.length != 0 && <View style={styles.relatedProductsContainer}>
            <Text style={[styles.relatedProductsTitle, { color: themecolors.blackColor }]}>{YOU_MIGHT_LIKE}</Text>
            <FlatList
              data={relatedProducts}
              renderItem={({ item }) => {
                const inventoryQuantity = item?.variants[0]?.inventory_quantity ?? 0;
                const isFavSelected = getIsFavSelected(item.admin_graphql_api_id);
                return (
                  <View
                    style={[styles.relatedProductItem, alignJustifyCenter, { backgroundColor: isDarkMode ? grayColor : "transparnet" }]}
                  >
                    <View style={{ width: "100%", borderWidth: .5, borderColor: themecolors.lightGrayOpacityColor, marginBottom: spacings.small, borderRadius: 10, alignItems: "center" }}>
                      <Image
                        source={{ uri: item?.image?.src }}
                        style={[styles.relatedProductImage, borderRadius10, resizeModeContain]}
                      />
                    </View>
                    <View style={[{ width: "100%", height: hp(10) }]}>
                      <Text style={[styles.relatedproductName, { color: themecolors.blackColor }]}>{item.title}</Text>
                      <Text style={[styles.relatedproductPrice, { paddingHorizontal: spacings.small, color: themecolors.blackColor }]}>{item?.variants[0]?.price}{shopCurrency}
                      </Text>
                    </View>
                     <View style={[{ width: "100%", flexDirection: "row" }, justifyContentSpaceBetween, alignItemsCenter]}>
                      {inventoryQuantity === 0 ? <Pressable
                        style={[styles.relatedAddtocartButton, borderRadius10, alignJustifyCenter]}
                      >
                        <Text style={styles.addToCartButtonText}>Out of stock</Text>
                      </Pressable>
                        : <Pressable
                          style={[styles.relatedAddtocartButton, borderRadius10, alignJustifyCenter]}
                          onPress={() => onAddToCartRelatedProduct(item.variants[0].admin_graphql_api_id, 1)}
                          disabled={loadingProductId === item.variants[0].admin_graphql_api_id}
                        >
                          {loadingProductId === item.variants[0].admin_graphql_api_id ? (
                            <ActivityIndicator color={whiteColor} />
                          ) : (
                            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                          )}

                        </Pressable>}
                      <TouchableOpacity style={[alignJustifyCenter, styles.relatedProductfavButton, { backgroundColor: whiteColor, borderColor: themecolors.redColor }]} onPress={() => handlePress(item)}>
                        <AntDesign
                          name={isFavSelected ? "heart" : "hearto"}
                          size={18}
                          color={redColor}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }}
              horizontal
              // numColumns={2}
              keyExtractor={(index) => index?.toString()}
              showsHorizontalScrollIndicator={false}
            />

          </View>}
          {shareProductloading && <LoadingModal visible={shareProductloading} />}
        </View>
      </ScrollView>
      <View style={[flexDirectionRow, justifyContentSpaceBetween, positionAbsolute, alignItemsCenter, { bottom: 0, width: wp(100), height: hp(10), zIndex: 1, backgroundColor: themecolors.whiteColor }]}>
        {getInventoryQuantity() > 0 && <View>
          <Text style={{ padding: spacings.large, color: themecolors.redColor, fontSize: style.fontSizeLarge.fontSize }}>{QUNATITY}:</Text>
          <View style={[styles.quantityContainer, flexDirectionRow, alignJustifyCenter]}>
            <TouchableOpacity onPress={decrementQuantity}>
              <Text style={[styles.quantityButton, borderRadius5, textAlign, { color: themecolors.blackColor, borderColor: themecolors.blackColor }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.quantity, { color: themecolors.blackColor }]}>{quantity}</Text>
            <TouchableOpacity onPress={incrementQuantity} >
              <Text style={[styles.quantityButton, borderRadius5, textAlign, { color: themecolors.blackColor, borderColor: themecolors.blackColor }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>}
        <View style={styles.addToCartButtonContainer}>
          {/* {getInventoryQuantity() <= 0 ? (
            <Pressable style={[styles.outOfStockButton, borderRadius10]}>
              <Text style={[styles.addToCartButtonText, textAlign]}>
                Out of stock
              </Text>
            </Pressable>
          ) : ( */}
            <Pressable
              disabled={loading || !variantSelected}
              style={[styles.addToCartButton, borderRadius10,{width:wp(45),marginRight:20, backgroundColor:"#fff", borderColor:redColor, borderWidth:1}]}
              // onPress={() => variant?.id && onAddToCart(variant.id, quantity)}
              onPress={() => {
                const selectedVariantId = getSelectedVariantId();
                if (selectedVariantId) {
                  onAddToCart(selectedVariantId, quantity);
                } else {
                  Alert.alert('Please select a variant before adding to cart');
                }
              }}
            >
              {loading ? (
                <View style={[styles.addToCartButtonLoading, textAlign]}>
                  <ActivityIndicator size="small" color={redColor} />
                </View>
              ) : (
                <Text style={[styles.addToCartButtonLoading, textAlign, { color: redColor}]}>
                  Add to cart
                  {/* &bull;{' '} */}
                  {/* {currency(((variant?.price.amount) ? (variant?.price?.amount) : variant?.price), variant?.price?.currencyCode)} */}
                </Text>
              )}
            </Pressable>
            <Pressable
              disabled={loading || !variantSelected}
              style={[styles.addToCartButton, borderRadius10,{width:wp(45)}]}
              // onPress={() => variant?.id && onAddToCart(variant.id, quantity)}
              onPress={() => {
                const selectedVariantId = getSelectedVariantId();
                if (selectedVariantId) {
                  onAddToCart(selectedVariantId, quantity);
                } else {
                  Alert.alert('Please select a variant before adding to cart');
                }
              }}
            >
              {loading ? (
                <View style={[styles.addToCartButtonLoading, textAlign]}>
                  <ActivityIndicator size="small" color={whiteColor} />
                </View>
              ) : (
                <Text style={[styles.addToCartButtonLoading, textAlign, { color: whiteColor }]}>
                  Buy Now
                  {/* &bull;{' '} */}
                  {/* {currency(((variant?.price.amount) ? (variant?.price?.amount) : variant?.price), variant?.price?.currencyCode)} */}
                </Text>
              )}
            </Pressable>
          {/* )} */}
        </View>
      </View>
    </View>
  );
}

export default ProductDetailsScreen;

function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      maxHeight: hp(100),
      // backgroundColor: whiteColor
    },
    productItem: {
      padding: spacings.large,
    },
    productText: {
      paddingTop: spacings.large,
      flexShrink: 1,
      flexGrow: 1,
      color: colors.textSubdued,
    },
    productTitle: {
      fontSize: style.fontSizeLarge.fontSize,
      fontWeight: style.fontWeightThin1x.fontWeight,
      marginTop: spacings.large,
      marginBottom: spacings.normal,
      marginHorizontal: spacings.normal,
      lineHeight: 28,
      textAlign: 'left',
      color: blackColor,
      // fontFamily: 'GeneralSans-Variable'
    },
    productDescription: {
      fontSize: style.fontSizeNormal.fontSize,
      fontWeight: "400",
      // marginTop: spacings.normal,
      // marginBottom: spacings.large,
      marginHorizontal: spacings.normal,
      lineHeight: 15,
      textAlign: 'left',
      color: colors.text,
    },
    productPrice: {
      fontSize: style.fontSizeLarge.fontSize,
      color: blackColor,
      fontWeight: style.fontWeightThin1x.fontWeight,
      marginLeft: spacings.small,
      // fontFamily: 'GeneralSans-Variable'
    },
    productImage: {
      width: '100%',
      height: "100%",
      // marginTop: spacings.normal,
    },
    addToCartButtonContainer: {
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      margin: 10,
    },
    addToCartButton: {
      fontSize: style.fontSizeExtraExtraSmall.fontSize,
      backgroundColor: redColor,
      padding: spacings.xxLarge,
    },
    outOfStockButton: {
      width: wp(95),
      fontSize: style.fontSizeExtraExtraSmall.fontSize,
      backgroundColor: redColor,
      padding: spacings.xxLarge,
    },
    addToCartButtonText: {
      fontSize: style.fontSizeNormal.fontSize,
      lineHeight: 20,
      color: whiteColor,
      fontWeight: style.fontWeightThin1x.fontWeight,
    },
    quantityContainer: {
      marginBottom: spacings.large,
      paddingHorizontal: spacings.normal,
      width: wp(28)
    },
    quantityButton: {
      width: wp(7),
      color: blackColor,
      fontSize: style.fontSizeNormal2x.fontSize,
      fontWeight: style.fontWeightThin1x.fontWeight,
      borderWidth: 1,
    },
    quantity: {
      paddingHorizontal: spacings.xxLarge,
      paddingVertical: spacings.xSmall,
      fontSize: style.fontSizeNormal2x.fontSize,
      fontWeight: style.fontWeightThin1x.fontWeight,
      color: blackColor,
    },
    addToCartButtonLoading: {
      // width: wp(44)
    },
    shareButton: {
      width: wp(10),
      height: wp(10),
      zIndex: 10,
      // backgroundColor: lightPink,
      borderRadius: 100
    },
    relatedProductsContainer: {
      width: "100%",
      marginTop: spacings.xLarge,
      // backgroundColor: whiteColor,
    },
    relatedProductsTitle: {
      fontSize: style.fontSizeLarge.fontSize,
      fontWeight: style.fontWeightMedium.fontWeight,
      color: blackColor,
      // fontFamily: 'GeneralSans-Variable'
    },
    relatedProductItem: {
      width: wp(40),
      marginVertical: spacings.small,
      padding: spacings.large,
      borderRadius: 5
      // height: hp(30),
      // marginVertical: spacings.large
    },
    relatedProductImage: {
      width: wp(30),
      height: wp(30),
      marginVertical: spacings.large,
    },
    relatedProductTitle: {
      fontSize: style.fontSizeNormal.fontSize,
      // color: blackColor,
      fontWeight: style.fontWeightThin1x.fontWeight,
      // fontFamily: 'GeneralSans-Variable'
    },
    relatedAddtocartButton: {
      fontSize: style.fontSizeExtraExtraSmall.fontSize,
      // marginVertical: spacings.large,
      width: "68%",
      backgroundColor: redColor,
      padding: spacings.normal,
      // paddingHorizontal: spacings.large

    },
    optionContainer: {
      marginVertical: spacings.small,
    },
    optionName: {
      fontSize: style.fontSizeNormal.fontSize,
      color: blackColor,
      fontWeight: style.fontWeightThin1x.fontWeight,
      marginBottom: spacings.xsmall,
    },
    optionValueContainer: {
      marginHorizontal: spacings.large,
      padding: spacings.small,
      borderWidth: 1,
      borderColor: blackColor,
      width: wp(23)
    },
    optionValue: {
      fontSize: style.fontSizeNormal.fontSize,
      color: blackColor,
    },
    favButton: {
      width: wp(8),
      height: wp(8),
      left: 20,
      top: 20,
      zIndex: 10,
      backgroundColor: whiteColor,
      borderRadius: 100
    },
    reviewSection: {
      width: "100%",
      height: hp(6),
    },
    button: {
      width: '100%',
      backgroundColor: redColor,
      paddingVertical: spacings.large,
      marginTop: spacings.large
    },
    buttonText: {
      color: whiteColor,
      fontSize: style.fontSizeMedium.fontSize,
      fontWeight: style.fontWeightThin.fontWeight,
    },
    relatedProductfavButton: {
      width: wp(10),
      height: hp(3.8),
      right: 0,
      // bottom: 4,
      zIndex: 10,
      borderWidth: 1,
      // borderColor: redColor,
      // backgroundColor: whiteColor,
      borderRadius: 10,
    },
    relatedproductName: {
      // fontSize: style.fontSizeNormal.fontSize,
      // fontWeight: style.fontWeightThin1x.fontWeight,
      // color: blackColor,
      // fontFamily: 'GeneralSans-Variable'
      // color: blackColor,
      fontSize: style.fontSizeNormal.fontSize, fontWeight: style.fontWeightThin1x.fontWeight,
    },
    relatedproductPrice: {
      fontSize: style.fontSizeSmall1x.fontSize,
      fontWeight: style.fontWeightThin1x.fontWeight,
      // fontWeight: style.fontWeightMedium1x.fontWeight,
      // color: blackColor,
      fontFamily: 'GeneralSans-Variable'
      // marginLeft: spacings.small,
      // fontFamily: 'GeneralSans-Variable'
    },
    wishListItemName: {
      color: blackColor,
      fontSize: 14,
      // fontWeight: style.fontWeightThin1x.fontWeight,
    },
    wishListItemPrice: {
      fontSize: 18,
      fontWeight: style.fontWeightThin1x.fontWeight,
      // fontWeight: style.fontWeightMedium1x.fontWeight,
      color: blackColor,
      fontFamily: 'GeneralSans-Variable'
    },
    buyButton: {
      height: 30,
      width: 75,
      backgroundColor: redColor,
      alignItems: 'center',
      borderRadius: 6,
      justifyContent: 'center',
    },
    favButton1: {
      width: wp(8),
      height: wp(8),
      right: 15,
      top: 15,
      zIndex: 10,
      // backgroundColor:whiteColor,
      borderRadius: 5
    },
    itemContainer: {
      padding: spacings.large,
      width: wp(48),
      borderWidth: .1,
    },
    detailsBox: {
      width: wp(100),
      height: hp(87),
      // padding: spacings.large
    },
  });
}
