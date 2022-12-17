import React from 'react';
import { ImageBackground, StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from 'react-native';
import bg from '../assets/WFwallpaper.jpg'
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

function Homepage({ navigation }) {
//ad unit: ca-app-pub-4794441298662299~2958174592 banner ios
    const [fontsLoaded] = useFonts({
        MaterialIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
        'Material Icons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
        'WFfont': require('../assets/fonts/WarframeFont.ttf')
    });
    
    if (!fontsLoaded) {
        return (
            <AppLoading/>
        )
    }

    return (
        <ImageBackground source={bg} style={styles.bg}>
            <SafeAreaView>
                <Text style={styles.logo}>
                    Tenno Trader
                </Text>
            </SafeAreaView>
            <View style={styles.top}></View>
            <TouchableOpacity onPress={() => navigation.navigate('Search', {
                clear: 0
            })} style={styles.start}>
                    <Text style={styles.buttonText}>
                        Start Trading
                    </Text>
            </TouchableOpacity>
            <View>
               <BannerAd 
                unitId='ca-app-pub-4794441298662299~2958174592'
                size={BannerAdSize.LARGE_BANNER}
                requestOptions={{
                    requestNonPersonalzedAdsOnly: true
                }}
               /> 
            </View>
            <View style={styles.bottom}></View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        color: 'black',
        position: 'relative',
        top: '180%',
        fontFamily: 'WFfont',
        fontSize: '50px'
    },
    start: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        height: 100,
        width: '100%',
        bottom: 90,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        position: 'relative',
        color: 'white',
        fontFamily: 'WFfont',
        fontSize: 40,
    },
    bottom: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: 90,
        width: '100%',
        bottom: 0,
    },
    top: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: 40,
        width: '100%',
        bottom: 190,
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100
    }
})

export default Homepage;