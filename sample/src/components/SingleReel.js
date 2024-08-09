import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { heightPercentageToDP, widthPercentageToDP } from '../utils';

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

const SingleReel = ({item, index, currentIndex, navigation}) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const videoRef = useRef(null);
  const [mute, setMute] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [key, setKey] = useState(0); // Key to force component re-render
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleEnd = () => {
    setLoading(false);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setMute(!mute)}
      style={{
        flex: 1,
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(100),
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor:"black"
      }}>
      
        {loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        <Video
          bufferConfig={{
            minBufferMs: 2000,
            maxBufferMs: 5000,
            bufferForPlaybackMs: 1000,
            bufferForPlaybackAfterRebufferMs: 1500,
          }}
          // poster={item?.thumb_url}
          // posterResizeMode={'contain'}
          // source={require('../assests/video3.mp4')}
          source={{ uri: convertToProxyURL(item?.url) }}
          
        //   resizeMode="contain"
          repeat={true}
          muted
          maxBitRate={2000000}
          paused={currentIndex === index ? false : true}
          hideShutterView={true}
          onLoad={handleLoad}
          onEnd={handleEnd}
          onBuffer={e => {
            console.log('e.isBuffering', e.isBuffering);
            if (e.isBuffering == true) {
              setLoading(true);
                
            } else {
              setLoading(false);
            }
          }}
        //   fullscreen
          style={{
            width: widthPercentageToDP(100),
            height:heightPercentageToDP(100),
            resizeMode:"cover"
          }}
        />
      <View
        style={{
          position: 'absolute',
          bottom: 140,
          left: 0,
          right: 0,
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 1,
          padding: 10,
        }}>
       
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
            marginLeft: 10,
          }}>
          John Deo
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 140,
          left: 0,
          right: 10,
          alignItems: 'flex-end',
          zIndex: 1,
        }}>
        <AntDesign
          name="hearto"
          style={{fontSize: 25, color: 'white', marginVertical: 10}}
        />
        <Text style={{color: 'white'}}>20.5k</Text>
        <Icon
          name="comment-o"
          style={{fontSize: 25, color: 'white', marginVertical: 10}}
        />
        <Text style={{color: 'white'}}>200</Text>
        <Icon
          name="share"
          style={{fontSize: 25, color: 'white', marginVertical: 10}}
        />
        <Text style={{color: 'white'}}>10.5k</Text>
        <Entypo
          name="dots-three-vertical"
          style={{fontSize: 25, color: 'white', marginVertical: 20}}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
  },
});
export default SingleReel;