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
    globalWatchlist = newWatchlist;
}

TaskManager.defineTask('checkItemOffers', async () => {
    for (let item of globalWatchlist) {
        const urlName = item.queryStr;
        try {
            const res = await fetch('https://api.warframe.market/v1/items/' + urlName + '/orders', 
            {
                mode: 'no-cors'
            }
            );
            const json = await res.json();
            setCurrItem(item)
            setOrders(json)
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
    const [wtchlst, setWatchlist] = useState([]);
    const [ordersData, setOrders] = useState({});
    const [currItem, setCurrItem] = useState(null);
    const [orderFound, setOrderFound] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const setSellers = (newItem) => {
        sellerString = "";
        for (let x = 0; x < newItem.seller.length; x++) {
            sellerString += newItem.seller[x] + ", "
        }
        Alert.alert("Sellers:", sellerString, [
            {text: "Ok"}
        ])
    }

    useEffect(() => {
        registerForPushNotificationsAsync();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {console.log(response);});

        return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Order found: " + currItem.itemName,
            body: 'There is an order available for ' + currItem.itemName + 'for ' + currItem.itemPrice + ' platinum on warframe.market.',
            data: { data: 'No data' },
          },
          trigger: { seconds: 1 },
        });
        setOrderFound(false);
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
    } else {
        alert('Must use physical device for Push Notifications');
    }
    
    return token;
    }

    useEffect(() => {
        if (wtchlst) {
            changeWatchlist(wtchlst)
            runTask()
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

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const sendNoti = async () => {
        await schedulePushNotification();
        await delay(60000)
        runTask()
    }

    useEffect(() => {
        if (orderFound) {
            sendNoti()
        }
    }, [orderFound])

    useEffect(() => {
        if (currItem) {
            let sellers = []
            for (let i = 0; i < ordersData.payload?.orders.length; i++) {
                const currOrder = ordersData.payload?.orders[i];
                if ((currOrder.platinum === currItem.itemPrice) && (currOrder.user.status === "ingame") && (currOrder.order_type === "sell")) {
                    setOrderFound(!orderFound);
                    console.log(currOrder)
                    console.log(currItem)
                    sellers.push(currOrder.user.ingame_name)
                }
            }
            currItem.seller = sellers;
            console.log(currItem.seller)
        }
    }, [ordersData])
    
    const runTask = async () => {
        for (let x = 0; x < wtchlst.length; x++) {
            const urlName = wtchlst[x].queryStr;
            try {
                const res = await fetch('https://api.warframe.market/v1/items/' + urlName +'/orders', 
                {
                    mode: 'no-cors'
                }
                );
                const json = await res.json();
                setCurrItem(wtchlst[x])
                setOrders(json)
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getCookie().then(req => setWatchlist(JSON.parse(req)))
        toggleFetchTask()
        Alert.alert("Tracking has begun!", "Keep the watchlist open for tracking every minute, or leave the watchlist open in the background for tracking every 15 minutes.", [
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
                        style={styles.innerFlatlist}
                        borderWidth='1'
                        contentContainerStyle={{paddingBottom: '100%'}}
                        borderColor='black'
                        data={wtchlst}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                        <View style={styles.flatview}>
                            <TouchableOpacity disabled={(item.seller.length != 0) ? false:true} onPress={() => setSellers(item)}>
                                <Text style={styles.name}>{(item.itemName).substring(0, (item.itemName).length - 1)}</Text>
                                <Text style={styles.price}>{item.itemPrice + " P"}</Text>
                                <Text style={(item.seller.length != 0) ? styles.orderFound: styles.noOrder}>{(item.seller.length != 0) ? "Click to view sellers":"No orders found"}</Text>
                            </TouchableOpacity>
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
        borderRadius: 0,
        borderBottomWidth: 1,
        borderColor: 'black',
        paddingTop: 5,
    },
    name: {
        fontFamily: 'WFfont',
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    price: {
        fontFamily: 'WFfont',
        fontSize: 30,
        color: 'white',
        textAlign: 'center',
        marginTop: 10
    },
    orderFound: {
        fontFamily: 'WFfont',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'green',
        margin: 10,
        padding: 15,
        borderRadius: 15,
        overflow: 'hidden'
    },
    noOrder: {
        fontFamily: 'WFfont',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'red',
        margin: 10,
        padding: 15,
        borderRadius: 15,
        overflow: 'hidden'
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
    },
    innerFlatlist: {
        paddingTop: 20,
    }
})

export default Watchlist;