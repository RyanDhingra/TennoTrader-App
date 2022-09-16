import React from 'react';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import bg from '../assets/WFwallpaper.jpg'
import { useEffect } from 'react';
import { StyleSheet, Alert, SafeAreaView, FlatList, ImageBackground, View, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import { useState } from 'react';
import { getCookie } from '../components/search'

TaskManager.defineTask('checkItemOffers', async () => {
    try {
        const res = await fetch('https://api.warframe.market/v1/items/chroma_prime_systems/orders', 
        {
            mode: 'no-cors'
        }
        );
        const json = await res.json();
        return json ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (error) {
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
})

async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync('checkItemOffers')
}

async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync('checkItemOffers');
}

function Watchlist({ navigation }) {

    const [isRegistered, setIsRegistered] = React.useState(false);
    const [watchlist, setWatchlist] = useState([])

    useEffect(() => {
        checkStatusAsync();
    }, []);

    const checkStatusAsync = async () => {
        const isRegistered = await TaskManager.isTaskRegisteredAsync('checkItemOffers');
        setIsRegistered(isRegistered);
    };

    const toggleFetchTask = async () => {
        if (isRegistered) {
            await unregisterBackgroundFetchAsync();
        } else {
        await registerBackgroundFetchAsync();
        }
        checkStatusAsync();
    };

    useEffect(() => {
        getCookie().then(req => setWatchlist(JSON.parse(req)))
        toggleFetchTask()
        Alert.alert("Tracking has begun!", "Your items are now being tracked. NOTE: Your phone must be unlocked for tracking, and the app must only be running in the BACKGROUND. Good luck Tenno!", [
            {text: "Ok"}
        ])
    }, [])

    const resetStorage = () => {
        AsyncStorage.clear()
        navigation.navigate('Search', {
            clear: 1
        })
    }

    return (
        <ImageBackground source={bg} style={styles.bg}>
            <SafeAreaView alignItems= 'center' width='100%' height='100%'>
                <View>
                    <Text style={styles.logo}>
                        My Watchlist
                    </Text>
                </View>
                <View height="50%" width="70%" style={styles.flatlist}>
                    <FlatList
                        backgroundColor='#66D0E8'
                        borderRadius='50'
                        borderWidth='1'
                        borderColor='black'
                        data={watchlist}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                        <View style={styles.flatview}>
                                <Text style={styles.name}>{item}</Text>
                        </View>
                        }
                        keyExtractor={item => item}
                    />
                </View>
            </SafeAreaView>
            <View style={styles.top}></View>
            <TouchableOpacity onPress={() => resetStorage()} style={styles.clearWatchlist}>
                    <Text style={styles.buttonText}>
                        Clear Watchlist
                    </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Search', {
                clear: 0
            })} style={styles.back}>
                    <Text style={styles.buttonText}>
                        Back To Search
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
    back: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        height: 100,
        width: '100%',
        bottom: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    clearWatchlist: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        height: 100,
        width: '100%',
        bottom: 140,
        justifyContent: 'center',
        alignItems: 'center'
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
    },
    buttonText: {
        position: 'relative',
        color: 'white',
        fontFamily: 'WFfont',
        fontSize: 40,
    },
    flatview: {
        justifyContent: 'center',
        borderRadius: 0,
    },
    name: {
        fontFamily: 'Verdana',
        fontSize: 18,
        color: 'white'
    },
    logo: {
        color: 'black',
        position: 'relative',
        top: '180%',
        fontFamily: 'WFfont',
        fontSize: '50px'
    },
    flatlist: {
        top: 100,
    }
})

export default Watchlist;