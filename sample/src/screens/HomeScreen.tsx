import { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  // ScrollView,
  Dimensions,
  SectionList,
  ScrollView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useSelector } from 'react-redux';
// import RNFetchBlob from 'rn-fetch-blob';
// import PagerView from 'react-native-pager-view';
import Header from '../components/Header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../utils';
import { REEL_PLAY_BLACK, SEARCH_RED, VIP_LOGO } from '../assests/images';
import ProductItem from '../components/ProductItem';
import { black, grayColor, redColor } from '../constants/Color';
import CarouselComponent from '../components/CarouselComponent';
import VideoItem from '../components/VideoItem';
import { Images, Videos } from '../constants/Constants';
import RecommendedVideo from '../components/RecommendedVideo';
import SellersComponent from '../components/SellersComponent';
import VipAddSection from '../components/VipAddSection';
import VideoList from '../components/VideoList';
const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { loading, videos, error } = useSelector(state => state?.videos);
  const cachedFiles = useSelector(state => state.cachedFiles?.cachedFiles);

  // console.log("cachedFilescachedFiles", videos);
  

  const topSellingProducts = [
    {
      id: '1',
      name: 'Manogyam',
      image: require('../assests/AllSellingProducts/image1.png'),
    },
    {
      id: '2',
      name: 'Znine',
      image: require('../assests/AllSellingProducts/image2.png'),
    },
    {
      id: '3',
      name: 'Anab Gl',
      image: require('../assests/AllSellingProducts/image3.png'),
    },
    {
      id: '4',
      name: 'Hivagi',
      image: require('../assests/AllSellingProducts/image4.png'),
    },
    {
      id: '5',
      name: 'Extension',
      image: require('../assests/AllSellingProducts/image5.png'),
    },
  ];
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [currentIndex, setCurrentIndex] = useState();
  const [videosWithAds, setVideosWithAds] = useState([]);
  const [videosWithoutAds, setVideosWithoutAds] = useState([]);
  const [loadVideos, setLoadVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [VideoLoading, setVideoLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // console.log("loadVideos", loadVideos);

  useEffect(() => {
    // if (productVideosUrl && productVideosUrl.length > 0) {
    //   setVideosWithAds(productVideosUrl.slice(0, 3));
    //   setVideosWithoutAds(productVideosUrl.slice(3));
    // }
  }, [videos]);

  // List of filters
  const filters = ['All', 'Beauty Appliances', 'Home Decor', 'Speakers'];

  // Handle filter button press
  const handleFilterPress = filter => {
    setSelectedFilter(filter);
  };

  // Render each filter button
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        item === selectedFilter && styles.selectedFilterButton,
      ]}
      onPress={() => handleFilterPress(item)}>
      <Text
        style={[
          styles.filterButtonText,
          item === selectedFilter && styles.selectedFilterButtonText,
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const handlePressItem = item => {
    // console.log('Video pressed:', item);
    // Handle video play logic here
  };


  // loadmore videos 
  // Track if there's more content to load



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



  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0];
      setCurrentIndex(visibleItem.index);
      console.log('Current Index:', visibleItem.index);
    }
  }, []);

  const sections = [
    {
      title: 'Top Selling Product',
      data: [{ type: 'header' }],
    },
    {
      title: 'Top Selling Product',
      data: [{ type: 'topSellingProducts' }],
    },
    {
      title: 'Carousel',
      data: [{ type: 'carousel' }],
    },
    {
      title: 'Filters',
      data: [{ type: 'filters' }],
    },
    {
      title: 'videosWithAds',
      data: [{ type: 'videosWithAds' }],
    },
    {
      title: 'Recommended Videos',
      data: [{ type: 'recommendedVideos' }],
    },
    {
      title: 'Most Popular Sellers',
      data: [{ type: 'mostPopularSellers' }],
    },
    {
      title: 'videosWithoutAds',
      data: [{ type: 'videosWithoutAds' }],
    },
    {
      title: 'VIP Number Shop',
      data: [{ type: 'vipNumberShop' }],
    },
  ];



  const renderSectionContent = ({ item }) => {
    if (item.type === 'videosWithoutAds') {
    }
    switch (item.type) {
      case 'header':
        return <Header
        navigation={navigation}
        textinput={true}
        image={true}
        menuImage={true}
        shoppingCart={true} />;
      case 'topSellingProducts':
        return (
          <>
            <View style={styles.sectionTitle}>
              <Text style={styles.titleText}>Top Selling Product</Text>
            </View>
            <FlatList
              data={topSellingProducts}
              renderItem={({ item }) => <ProductItem item={item} />}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productList}
            />
          </>
        );
      case 'carousel':
        return <CarouselComponent />;
      case 'filters':
        return (
          <FlatList
            data={filters}
            renderItem={renderItem}
            keyExtractor={item => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          />
        );
      case 'videosWithAds':
        return (
          <VideoList
          cachedFiles={videos}
            currentIndex={currentIndex}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            navigation={navigation}
          />
        );

      case 'recommendedVideos':
        return (
          <>
            <View style={{ height: 4, backgroundColor: grayColor }} />
            <View style={{ marginVertical: 10, marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', gap: 5, marginBottom: 10 }}>
                <Image source={REEL_PLAY_BLACK} style={styles.reelIcon} />
                <Text
                  style={{
                    fontSize: 18,
                    marginTop: 5,
                    fontWeight: '600',
                    color: black,
                  }}>
                  Recommended
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
              {/* <ScrollView
                horizontal
                contentContainerStyle={styles.listContainer}
                showsHorizontalScrollIndicator={false}>
                {Videos?.map(item => (
                  <View key={item.video_id}>
                    <RecommendedVideo item={item} onPress={handlePressItem} />
                  </View>
                ))}
              </ScrollView> */}
            </View>
          </>
        );
      case 'mostPopularSellers':
        return (
          <>
            <View style={{ height: 4, backgroundColor: 'gray' }} />
            <View style={{ marginVertical: 20, marginLeft: 10 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: black,
                  alignSelf: 'center',
                  marginBottom: 10,
                }}>
                Most Popular Sellers
              </Text>
              <ScrollView
                horizontal
                contentContainerStyle={styles.listContainer}
                showsHorizontalScrollIndicator={false}>
                {Images.map(item => (
                  <View key={item.video_id}>
                    <SellersComponent item={item} onPress={handlePressItem} />
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={{ height: 4, backgroundColor: grayColor }} />
          </>
        );
      // case 'videosWithoutAds':
      //   return (
      //     <VideoList
      //       videos={videosWithoutAds}
      //       currentIndex={currentIndex}
      //       onViewableItemsChanged={onViewableItemsChanged}
      //       viewabilityConfig={viewabilityConfig}
      //       navigation={navigation}
      //     />
      //   );

      case 'vipNumberShop':
        return (
          <>
            <View style={{ height: 4, backgroundColor: grayColor }} />
            <View style={{ marginVertical: 20, marginLeft: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: wp(95),
                }}>
                <View style={{ flexDirection: 'row', gap: 5, marginBottom: 10 }}>
                  <Image source={VIP_LOGO} style={styles.reelIcon} />
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
                contentContainerStyle={styles.listContainer}
                showsHorizontalScrollIndicator={false}>
                {Images.map(item => (
                  <View key={item.video_id}>
                    <VipAddSection item={item} onPress={handlePressItem} />
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item.type + index}
      renderItem={renderSectionContent}
      // renderSectionHeader={renderSectionHeader}
      contentContainerStyle={{ paddingBottom: 20, backgroundColor: '#fff' }}
    />
  );
}

//   return (
//       <ScrollView style={{ flex: 1 }}>
//       <Header />
//       {/* <ScrollView> */}
//       {/* <View style={styles.container}>
//         <Image
//           source={SEARCH_RED}
//           style={{width: wp(6), height: hp(5), resizeMode: 'contain'}}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Search for ..."
//           placeholderTextColor="#888"
//         />
//       </View> */}

//       <View style={styles.sectionTitle}>
//         <Text style={styles.titleText}>Top Selling Product</Text>
//       </View>
//       <View>
//         <FlatList
//           data={topSellingProducts}
//           renderItem={({item}) => <ProductItem item={item} />}
//           keyExtractor={item => item.id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.productList}
//         />
//       </View>
//       <CarouselComponent />
//       <View style={styles.filterContainer}>
//         <FlatList
//           data={filters}
//           renderItem={renderItem}
//           keyExtractor={item => item}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//         />
//       </View>
//       <VideoList
//         videos={videos}
//         currentIndex={currentIndex}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//       />
//       {/* <View>
//         <FlatList
//           data={videos}
//           renderItem={({item, index}) => (
//             <VideoItem
//               key={item.video_id.toString()}
//               item={item}
//               index={index}
//               currentIndex={currentIndex}
//               isPlaying={index === currentIndex}
//             />
//           )}
//           keyExtractor={item => item.video_id.toString()}
//           showsHorizontalScrollIndicator={false}
//           onViewableItemsChanged={onViewableItemsChanged}
//           viewabilityConfig={viewabilityConfig}
//           maxToRenderPerBatch={1}
//           initialNumToRender={1}
//           scrollEventThrottle={16}
//           snapToInterval={height}
//           decelerationRate="fast"
//           pagingEnabled
//         />
//       </View> */}
//       {/* <RecommendedVideo  /> */}
//       <View style={{height: 4, backgroundColor: grayColor}} />
//       <View style={{marginVertical: 20, marginLeft: 10}}>
//         <View style={{flexDirection: 'row', gap: 5, marginBottom: 10}}>
//           <Image source={REEL_PLAY_BLACK} style={styles.reelIcon} />
//           <Text
//             style={{
//               fontSize: 18,
//               marginTop: 5,
//               fontWeight: '500',
//               color: black,
//             }}>
//             Recommended
//           </Text>
//         </View>
//         {/* <FlatList
//           data={videos}
//           renderItem={({item}) => (
//             <RecommendedVideo item={item}  key={item.video_id} onPress={handlePressItem} />
//           )}
//           keyExtractor={item => item.video_id.toString()}
//           contentContainerStyle={styles.listContainer}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//         /> */}
//         <ScrollView
//           horizontal
//           contentContainerStyle={styles.listContainer}
//           showsHorizontalScrollIndicator={false}>
//           {videos?.map(item => (
//             <View key={item.video_id}>
//               <RecommendedVideo
//                 item={item}
//                 key={item.video_id}
//                 onPress={handlePressItem}
//               />
//             </View>
//           ))}
//         </ScrollView>
//       </View>
//       <View style={{height: 4, backgroundColor: 'gray'}} />
//       <View style={{marginVertical: 20, marginLeft: 10}}>
//         <Text
//           style={{
//             fontSize: 18,
//             fontWeight: '500',
//             color: black,
//             alignSelf: 'center',
//             marginBottom: 10,
//           }}>
//           Most Popular Sellers
//         </Text>
//         <ScrollView
//           horizontal
//           contentContainerStyle={styles.listContainer}
//           showsHorizontalScrollIndicator={false}>
//           {Images.map(item => (
//             <View key={item.video_id}>
//               <SellersComponent item={item} onPress={handlePressItem} />
//             </View>
//           ))}
//         </ScrollView>
//       </View>
//       <View style={{height: 4, backgroundColor: grayColor}} />

//       <View style={{marginVertical: 20, marginLeft: 10}}>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             width: wp(95),
//           }}>
//           <View style={{flexDirection: 'row', gap: 5, marginBottom: 10}}>
//             <Image source={VIP_LOGO} style={styles.reelIcon} />
//             <View>
//               <Text style={{fontSize: 16, fontWeight: '500', color: redColor}}>
//                 VIP Number Shop
//               </Text>
//               <Text style={{fontSize: 14, fontWeight: '500', color: '#999999'}}>
//                 Sponsored
//               </Text>
//             </View>
//           </View>
//           <Entypo name="cross" size={25} color="gray" />
//         </View>
//         <ScrollView
//           horizontal
//           contentContainerStyle={styles.listContainer}
//           showsHorizontalScrollIndicator={false}>
//           {Images.map(item => (
//             <View key={item.video_id}>
//               <VipAddSection item={item} onPress={handlePressItem} />
//             </View>
//           ))}
//         </ScrollView>
//       </View>
//       {/* </ScrollView> */}
//     </ScrollView>

//   );
// }

const styles = StyleSheet.create({
  sectionHeader: {
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: wp(90),
    marginVertical: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    height: 40,
  },
  sectionTitle: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignSelf: 'center',
  },
  titleText: {
    fontSize: 20,
    color: black,
    fontWeight: 'bold',
  },
  productList: {
    paddingLeft: 20,
    height: hp(12),
  },
  filterContainer: {
    marginVertical: 20,
    paddingLeft: 20,
  },
  filterButton: {
    // backgroundColor: ',
    borderRadius: 4,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 0.2,
  },
  // filterButtonText: {
  //   color: '#fff',
  // },
  selectedFilterButton: {
    backgroundColor: redColor,
    borderRadius: 8,
    borderWidth: 0,
  },
  filterButtonText: {
    fontSize: 13,
    color: '#333',
  },
  selectedFilterButtonText: {
    color: '#fff',
  },
  listContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelIcon: {
    width: 40,
    height: 40,
  },
});
