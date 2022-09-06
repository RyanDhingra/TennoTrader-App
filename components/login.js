import React from 'react';
import { ImageBackground, StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from 'react-native';
import bg from '../assets/WFwallpaper.jpg'
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

function Login({ navigation }) {
    let [fontsLoaded] = useFonts({
        'WFfont': require('../assets/fonts/WarframeFont.ttf')
    });
    if (!fontsLoaded) {
        return (
            <AppLoading/>
        )
    }

    const handleLogin = () => {
        console.log('login')
    }

    const handleSettings = () => {
        console.log('settings')
    }

    return (
        <ImageBackground source={bg} style={styles.bg}>
            <SafeAreaView>
                <Text style={styles.logo}>
                    Tenno Trader
                </Text>
            </SafeAreaView>
            <View style={styles.top}></View>
            <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.login}>
                    <Text style={styles.buttonText}>
                        Login
                    </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSettings} style={styles.settings}>
                    <Text style={styles.buttonText}>
                        Settings
                    </Text>
            </TouchableOpacity>
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
    settings: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        height: 100,
        width: '100%',
        bottom: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    login: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        height: 100,
        width: '100%',
        bottom: 140,
        justifyContent: 'center',
        alignItems: 'center',
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

export default Login;