import React from 'react';
import { Linking, ImageBackground, StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from 'react-native';
import bg from '../assets/WFbg.jpg'
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

function Homepage({ navigation }) {

    const sendMail = () => {
        Linking.openURL("mailto:ryandhingra@gmail.com?subject=TennoTrader Bug Report");
    }

    const sendDonation = () => {
        Linking.openURL("https://paypal.me/RyanDhingra?country.x=CA&locale.x=en_US");
    }

    const [fontsLoaded] = useFonts({
        Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
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
            <View style={styles.moreOptions}>
                <TouchableOpacity onPress={() => sendDonation()} style={styles.donate}>
                        <Text style={styles.buttonText}>
                            Donate
                        </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => sendMail()} style={styles.bugs}>
                        <Text style={styles.buttonText}>
                            Feedback
                        </Text>
                </TouchableOpacity>
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
        bottom: 140,
        justifyContent: 'center',
        alignItems: 'center'
    },
    donate: {
        backgroundColor: 'rgba(0, 0, 0, .5)',
        height: 100,
        width: '50%',
        bottom: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bugs: {
        backgroundColor: 'rgba(0, 0, 0, .5)',
        height: 100,
        width: '50%',
        bottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreOptions: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flex: 1,
        flexDirection: "row"
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
        height: 40,
        width: '100%',
        bottom: 0,
    },
    top: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: 40,
        width: '100%',
        bottom: 240,
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100
    }
})

export default Homepage;