import React from 'react';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import bg from '../assets/WFwallpaper.jpg'
import { useEffect } from 'react';
import { StyleSheet, Alert, SafeAreaView, FlatList, ImageBackground, View, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import { useState, useRef } from 'react';
import { getCookie } from '../components/search'
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


var globalWatchlist = []

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

function changeWatchlist(newWatchlist) {
    globalWatchlist = newWatchlist
    //console.log("Global List: " + globalWatchlist)
}

TaskManager.defineTask('checkItemOffers', async () => {
    var urlName = ""
    for (let item of globalWatchlist) {
        urlName = item.queryStr
        try {
            const res = await fetch('https://api.warframe.market/v1/items/' + urlName + '/orders', 
            {
                mode: 'no-cors'
            }
            );
            const json = await res.json();
            //console.log(json)
            return json ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
        } catch (error) {
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }
    }
})

async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync('checkItemOffers')
}

async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync('checkItemOffers');
}

function Watchlist({ navigation }) {

    const [isRegistered, setIsRegistered] = useState(false);
    const [wtchlst, setWatchlist] = useState([])
    const [ordersData, setOrders] = useState({})
    const [currItem, setCurrItem] = useState(null)
    //const [expoPushToken, setExpoPushToken] = useState('');
    //const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync();//.then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        //setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
        });

        return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "You've got mail! 📬",
            body: 'Here is the notification body',
            data: { data: 'goes here' },
          },
          trigger: { seconds: 1 },
        });
      }
      
    async function registerForPushNotificationsAsync() {
    let token;
    
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        }
        if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }
    
    return token;
    }

    useEffect(() => {
        if (wtchlst) {
            changeWatchlist(wtchlst)
            runFirstTask()
        }
    }, [wtchlst])

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
        console.log(currItem)
        console.log(ordersData?.payload?.orders[0])
        for (let i = 0; i < ordersData?.payload?.orders.length; i++) {
            //console.log(ordersData?.payload?.orders[i].platinum)
            let x = i + 1
        }
    }, [ordersData])

    const runFirstTask = async () => {
        for (let x = 0; x < wtchlst.length; x++) {
            const urlName = wtchlst[x].queryStr;
            const currName = wtchlst[x].itemName;
            console.log(currName)
            try {
                const res = await fetch('https://api.warframe.market/v1/items/' + urlName +'/orders', 
                {
                    mode: 'no-cors'
                }
                );
                const json = await res.json();
                setOrders(json)
                setCurrItem(currName)
                //console.log('NEW ITEM HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')
            } catch (error) {
                console.log(error)
            }
        }
        //await schedulePushNotification();
    }

    useEffect(() => {
        getCookie().then(req => setWatchlist(JSON.parse(req)))
        toggleFetchTask()
        Alert.alert("Tracking has begun!", "Your items are now being tracked. NOTE: Your phone must be unlocked for tracking, and the app must only be running in the BACKGROUND. Good luck Tenno!", [
            {text: "Ok"}
        ])
        console.log('task toggled')
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
                        data={wtchlst}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                        <View style={styles.flatview}>
                            <Text style={styles.name}>{item.itemName}</Text>
                            <Text style={styles.name}>{item.itemPrice}</Text>
                            <Text style={styles.name}>{item.queryStr}</Text>
                        </View>
                        }
                        keyExtractor={item => item.itemName}
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
        paddingTop: 5,
        paddingLeft: 25,
        paddingRight: 25,
        alignItems: "center",
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