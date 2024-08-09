import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions, ScrollView, Image, Text, ActivityIndicator } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import VideoItem from './VideoItem'; // Adjust the import path as necessary
import { Images } from '../constants/Constants';
import VipAddSection from './VipAddSection';
import { VIP_LOGO } from '../assests/images';
import { grayColor, redColor } from '../constants/Color';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';


const { height } = Dimensions.get('window');

const VideoList = ({ cachedFiles, currentIndex, onViewableItemsChanged, viewabilityConfig, navigation }) => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [bestDealInventoryQuantities, setBestDealInventoryQuantities] = useState('');
  const [bestDealoptions, setBestDealOptions] = useState([]);

  const videosPerPage = 10;

  const productMedia = cachedFiles?.map(productEdge =>
    productEdge?.node?.media?.edges?.map(mediaEdge => mediaEdge?.node?.sources[0])
  );
  productVideosUrl = productMedia.reduce((acc, val) => acc.concat(val), []);
  // const inventoryQuantities = cachedFiles?.data?.collection?.products?.nodes?.map((productEdge) => {
  //   return productEdge?.variants?.nodes?.map((variants) => variants?.inventoryQuantity);
  // });
  // setBestDealInventoryQuantities(inventoryQuantities)
  // const fetchedOptions = cachedFiles?.data?.collection?.products?.nodes?.map((product) => product?.options);
  // setBestDealOptions(fetchedOptions);
  
  useEffect(() => {
    // console.log("cachedFiles?.data?.collection?.products?.nodes",cachedFiles);
    
    // const inventoryQuantities = cachedFiles?.node?.map((productEdge) => {
    //     return productEdge?.variants?.node?.map((variants) => variants?.inventoryQuantity);
    //   });
    //   console.log("inventoryQuantities",inventoryQuantities);
    //   setBestDealInventoryQuantities(inventoryQuantities)
    //   const fetchedOptions = cachedFiles?.data?.collection?.products?.nodes?.map((product) => product?.options);
    //   setBestDealOptions(fetchedOptions);
   // Function to extract inventory quantities from cachedFiles
  //  cachedFiles.forEach((productWrapper, index) => {
  //   const product = productWrapper?.node;
  //   console.log(`Product ${index}:`, product);
  //   console.log(`Variants for Product ${index}:`, product?.variants);
  // });
  // Function to extract inventory quantities from cachedFiles
const extractInventoryQuantities = () => {
  if (!cachedFiles || !Array.isArray(cachedFiles)) {
    console.error("Invalid data format for cachedFiles");
    return;
  }

  // Extract inventory quantities
  const inventoryQuantities = cachedFiles.map((productWrapper) => {
    const product = productWrapper?.node;

    // Check if product and variants are defined and variants.edges is an array
    if (product && product.variants?.edges && Array.isArray(product.variants.edges)) {
      return product.variants.edges.map((edge) => {
        // Extract inventoryQuantity from each variant node
        return edge?.node?.inventoryQuantity || null; // Use null if inventoryQuantity is missing
      });
    } else {
      // Log the structure if variants.edges is not an array
      console.warn("Variants edges not found or not an array:", product?.variants?.edges);
      return [];
    }
  });

  console.log("inventoryQuantities", inventoryQuantities);
  setBestDealInventoryQuantities(inventoryQuantities);

  // Extract options (if needed)
  // const fetchedOptions = cachedFiles.map((productWrapper) => productWrapper?.node?.options || []);
  // setBestDealOptions(fetchedOptions);
};

// Call the function when needed
extractInventoryQuantities();

  }, [cachedFiles]);
  useEffect(() => {
    loadMoreVideos();
  }, []);
  // console.log("videosvideos..", videos?.length);
  // const loadMoreVideos = () => {
  //   if (loading) return;

  //   setLoading(true);

  //   // Simulate an API call or data fetching
  //   setTimeout(() => {
  //     const start = (page - 1) * videosPerPage;
  //     const end = start + videosPerPage;
  //     setVideos(prevVideos => [...prevVideos, ...cachedFiles.slice(start, end)]);
  //     setPage(prevPage => prevPage + 1);
  //     setLoading(false);
  //   }, 1000); // Simulated delay
  // };
  // const loadMoreVideos = () => {
  //   if (loading) return;

  //   setLoading(true);
  //   setTimeout(() => {
  //     const start = (page - 1) * videosPerPage;
  //     const end = start + videosPerPage;
  //     const newVideos = cachedFiles.slice(start, end);
  //     const videosWithAds = insertAds([...videos, ...newVideos]);
  //     setVideos(videosWithAds);
  //     setPage(prevPage => prevPage + 1);
  //     setLoading(false);
  //   }, 1000); 
  // };

  const insertAds = (videoArray) => {
    let result = [];
    videoArray.forEach((video, index) => {
      result.push(video);
      if ((index + 1) % 10 === 0) {
        result.push({ isAd: true, id: `ad-${index}` });
      }
    });
    return result;
  };

  const loadMoreVideos = () => {
    if (loading || allLoaded) return;

    setLoading(true);

    // Simulate an API call or data fetching
    setTimeout(() => {
      const start = (page - 1) * videosPerPage;
      const end = start + videosPerPage;
      const newVideos = productVideosUrl.slice(start, end);

      if (newVideos.length === 0) {
        setAllLoaded(true); // Set flag if no more videos to load
      } else {
        setVideos(prevVideos => [...prevVideos, ...newVideos]);
        setPage(prevPage => prevPage + 1);
      }
      setLoading(false);
    }, 800); // Simulated delay
  };

  const handleEndReached = () => {
    if (!loading && !allLoaded) {
      loadMoreVideos();
    }
  };
  // const handleEndReached = () => {
  //   if (!loading && !allLoaded && videos.length < cachedFiles.length) {
  //     loadMoreVideos();
  //   }
  // };
  const handlePressItem = item => {
    // console.log('Video pressed:', item);
    // Handle video play logic here
  };
  const getVariant = (product: ShopifyProduct) => {
    if (product.variants?.edges?.length > 0) {
      return product?.variants?.edges[0]?.node;
    } else if (product?.variants?.nodes?.length > 0) {
      return product?.variants?.nodes[0];
    } else {
      return null;
    }
  };
  const renderItem = ({ item, index }) => {
    if (item.isAd) {
      return <View>
        <View style={{ height: 4, backgroundColor: grayColor }} />
        <View style={{ marginVertical: 20, marginLeft: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp(95),
            }}>
            <View style={{ flexDirection: 'row', gap: 5, marginBottom: 10 }}>
              <Image source={VIP_LOGO} style={{
                width: 40,
                height: 40,
              }} />
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: redColor,
                  }}>
                  VIP Number Shop
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#999999',
                  }}>
                  Sponsored
                </Text>
              </View>
            </View>
            <Entypo name="cross" size={25} color="gray" />
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            showsHorizontalScrollIndicator={false}>
            {Images.map(item => (
              <View key={item}>
                <VipAddSection item={item} onPress={handlePressItem} />
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={{ height: 4, backgroundColor: grayColor }} />
      </View>;
    }
    return <VideoItem key={index}
      item={item}
      index={index}
      currentIndex={currentIndex}
      isPlaying={index === currentIndex}
      navigation={navigation} />;
  };
  return (
    <View style={{}}>
      <FlatList
        data={productVideosUrl}
        // renderItem={renderItem}
        renderItem={({ item, index }) => (
          <VideoItem
            key={index}
            item={item}
            index={index}
            currentIndex={currentIndex}
            isPlaying={index === currentIndex}
            navigation={navigation}
            onPress={() => {
              navigation.navigate('ProductDetails', {
                product: item,
                variant: getVariant(item),
                inventoryQuantity: bestDealInventoryQuantities[index],
                // tags: bestDealTags[index],
                option: bestDealoptions[index],
                // ids: bestDealProductVariantsIDS[index]
              });
            }}
          />
        )}
        keyExtractor={(item, index) => index}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        snapToInterval={height}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        decelerationRate="fast"
        pagingEnabled
        ListFooterComponent={loading && !allLoaded ? <ActivityIndicator /> : null}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
      />

    </View>
  );
};

export default VideoList;
