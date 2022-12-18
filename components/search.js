import React, { useEffect } from 'react';
import bg from '../assets/WFwallpaper.jpg'
import ArrowLeft from '../assets/ArrowLeft.png';
import ArrowRight from '../assets/ArrowRight.png';
import { FlatList, StyleSheet, ImageBackground, SafeAreaView, Text, Alert, TouchableOpacity, View, Image, TextInput } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { useState } from 'react';
import { AsyncStorage } from 'react-native';

const saveCookie = async (items) => {
    return AsyncStorage.setItem('ITEMS', JSON.stringify(items))
      .then(json => console.log('Success'))
      .catch(error => console.log('Error: ' + error));
};

export const getCookie = async () => {
    return AsyncStorage.getItem('ITEMS')
};


function Search({ route, navigation }) {

    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]);
    const [itemNames, setItemNames] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [itemClicked, setItemClicked] = useState(false);
    const [item, setItem] = useState(false);
    const [plat, setPlat] = useState(1);

    useEffect(() => {
        const { clear } = route.params;
        if (clear === 1) {
            setWatchlist([])
        }
    }, [route])

    useEffect(() => {
        getCookie().then(req => setWatchlist(JSON.parse(req) ? JSON.parse(req): []))
    }, [])

    const capitalizeNames = (items) => {
        const capitalizedNames = []

        for (let x = 0; x < items.length; x++) {
            const currName = items[x].name;
            const seperateWords =  currName.split(" ")
            var newName = ""

            for (let word = 0; word < seperateWords.length; word++) {
                const firstLetter = seperateWords[word].charAt(0)
                
                if (firstLetter.match(/[a-z]/i)) {
                    const newWord = firstLetter.toUpperCase() + seperateWords[word].substring(1, seperateWords[word].length)
                    newName += newWord + " "
                } else {
                    const secondLetter = seperateWords[word].charAt(1)
                    const newWord = seperateWords[word].substring(0, 1) + secondLetter.toUpperCase() + seperateWords[word].substring(2, seperateWords[word].length)
                    newName += newWord + " "
                }
            }

            capitalizedNames.push(newName)
        }
        setItemNames(capitalizedNames)
    }

    const sortData = () => {
        if (data != []) {
            if (searchTerm != "") {
                const curr_data = []
                for (let x = 0; x < data.payload.items.length; x++) {
                    const curr_name = data?.payload.items[x].item_name.toLowerCase()
                    if (curr_name.includes(searchTerm.toLowerCase())) {
                        let newItem = {
                            name: curr_name,
                            urlName: data.payload.items[x].url_name,
                        }
                        curr_data.push(newItem)
                    }
                }
                capitalizeNames(curr_data)
            }
        } else {
            getItems()
            sortData()
        }
    }

    const getItems = async () => {
        try {
            const res = await fetch('https://api.warframe.market/v1/items', 
            {
                mode: 'no-cors'
            }
            );
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getItems()
    }, [])

    const updateSearch = ( searchTerm ) => {
        setSearchTerm(searchTerm)
    }

    useEffect(() => {
        saveCookie(watchlist)
    }, [watchlist])

    const setCurrItem = (newItem) => {
        setItemClicked(true)
        setItem(newItem)
    }

    const addToWatchlist = () => {

        const names = []

        for (const currItem of watchlist) {
            names.push(currItem.itemName)
        }

        if (watchlist.length < 5) {
            if (names.includes(item)) {
                Alert.alert("Item Already Being Watched", "This item has already been added to your watchlist.", [
                    {text: "Ok"}
                ])
                setItemClicked(false)
            } else {
                const newWatchlist = []
                for (let x = 0; x < watchlist.length; x++) {
                    newWatchlist.push(watchlist[x])
                }

                let itemInfo = null;
                let itemUrl = null;
                for (let i = 0; i < data.payload.items.length; i++) {
                    const tempItem = data.payload.items[i].item_name
                    const cleanTempItem = tempItem.replace(/ /g, "");
                    if (cleanTempItem === item.replace(/ /g, "")) {
                        itemUrl = data.payload.items[i].url_name;
                    }
                }

                if (plat >= 1) {
                    itemInfo = {
                        itemName: item,
                        itemPrice: plat,
                        queryStr: itemUrl,
                    }
                } else {
                    itemInfo = {
                        itemName: item,
                        itemPrice: 1,
                        queryStr: itemUrl,
                    }
                }
                newWatchlist.push(itemInfo)
                setWatchlist(newWatchlist)
                setItemClicked(false);
                setItem(null);
            }
        } else {
            Alert.alert("Watchlist Full", "You may only have up to 5 items at a time in your watchlist.", [
                {text: "Ok"}
            ])
        }
    }

    const incPlat = () => {
        if (plat < 9999) {
            setPlat(plat + 1)
        }
    }

    const decPlat = () => {
        if (plat >= 2) {
            setPlat(plat - 1)
        } else {
            setPlat(1)
        }
    }


    const changePlat = (newNum) => {
        setPlat(Number(parseInt(newNum)))
    }

    const cancel = () => {
        setPlat(1)
        setItemClicked(false)
    }

    return (
        <ImageBackground source={bg} style={styles.bg}>
            <SafeAreaView alignItems='center' width='100%' height='100%' style={itemClicked ? {backgroundColor: 'rgba(0, 0, 0, 0.5)'}:null}>
                <View style={styles.searchBar}>
                    <SearchBar 
                        value={searchTerm}
                        onChangeText={updateSearch}
                        placeholder="Search items here"
                        inputContainerStyle={{backgroundColor: 'rgba(0, 0, 0, 0)', color:'white'}}
                        containerStyle={itemClicked ? {backgroundColor: 'rgba(102, 208, 232, 0.2)', borderWidth: 1, borderRadius: 100, width: '350%', color:'white', marginBottom: 50}:{backgroundColor: '#66D0E8', borderWidth: 1, borderRadius: 100, width: '350%', color:'white', marginBottom: 50}}
                        inputStyle={itemClicked ? {color: 'rgba(255, 255, 255, 0.2)', margin: 0, fontSize: 25, fontFamily: 'WFfont'}:{color: 'white', margin: 0, color:'white', fontSize: 25, fontFamily: 'WFfont'}}
                        searchIcon={itemClicked ? {color:'rgba(255, 255, 255, 0.2)', size: 30}:{color:'white', size: 30}}
                        clearIcon={itemClicked ? {color:'rgba(255, 255, 255, 0.2)', size: 30}:{color:'white', size: 30}}
                        placeholderTextColor={itemClicked ? 'rgba(255, 255, 255, 0.2)':'white'}
                        onSubmitEditing={sortData}
                    />
                </View>
                <View height="65%" width="70%">
                    <FlatList
                        backgroundColor={itemClicked ? 'rgba(102, 208, 232, 0.2)':'#66D0E8'}
                        borderRadius='50'
                        borderTopLeftRadius='0'
                        borderTopRightRadius='0'
                        borderWidth='1'
                        borderTopWidth='0'
                        borderColor='black'
                        data={itemNames}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                        <View style={styles.flatview}>
                            <TouchableOpacity onPress={() => setCurrItem(item)}>
                                <Text style={itemClicked ? styles.nameBlurr: styles.name}>{item}</Text>
                            </TouchableOpacity>
                        </View>
                        }
                        keyExtractor={item => itemNames.indexOf(item)}
                    />
                </View>
            </SafeAreaView>
            <View style={styles.top}></View>
            <TouchableOpacity onPress={() => navigation.navigate('Watchlist')} style={styles.watchlist}>
                    <Text style={itemClicked ? styles.buttonTextBlurr:styles.buttonText}>
                        Start Watching
                    </Text>
            </TouchableOpacity>
            <View style={styles.bottom}></View>
            <View style={itemClicked ? styles.popup: null}>
                <Text style={{fontSize: 25, color: 'white', marginBottom: 10,}}>
                    Set Watch Price:
                </Text>
                <View style={{display: 'flex', flexDirection: 'row', marginBottom: 15}}>
                    <TouchableOpacity onPress={() => decPlat()}>
                        <Image source={ArrowLeft} style={{width: 30, height: 30}}/>
                    </TouchableOpacity>
                    <TextInput keyboardType='numeric' placeholder='1' placeholderTextColor='white' onChangeText={num => changePlat(num)} maxLength={4} style={{width: 150, textAlign: 'center', color: 'white', fontSize: 25,}} >
                        {(plat > 1) ? plat: ""}
                    </TextInput>
                    <TouchableOpacity onPress={() => incPlat()}>
                        <Image source={ArrowRight} style={{width: 30, height: 30}}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => addToWatchlist()} style={{borderBottomColor: 'black', borderBottomWidth: 1, borderTopColor: 'black', borderTopWidth: 1, width: '100%', alignItems: 'center'}}>
                    <Text style={{fontSize: 25, color: 'white'}}>
                        Add To Watchlist
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cancel()}>
                    <Text style={{fontSize: 25, color: 'white'}}>
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

export default Search;

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
        fontSize: 50
    },
    watchlist: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        height: 100,
        width: '100%',
        bottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        position: 'relative',
        color: 'white',
        fontFamily: 'WFfont',
        fontSize: 40,
    },
    buttonTextBlurr: {
        position: 'relative',
        color: 'rgba(255, 255, 255, 0.2)',
        fontFamily: 'WFfont',
        fontSize: 40,
    },
    searchBar: {
        width: 100,
        top: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBarBlurr: {
        width: 100,
        top: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    flatview: {
        justifyContent: 'center',
        borderRadius: 0,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'black',
    },
    name: {
        fontFamily: 'Verdana',
        fontSize: 20,
        color: 'white',
        fontFamily: 'WFfont',
    },
    nameBlurr: {
        fontFamily: 'Verdana',
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.2)',
        fontFamily: 'WFfont',
    },
    container: {
        height: 20
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
        bottom: 140,
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100
    },
    popup: {
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        top: '40%',
        width: 300,
        height: 150,
        backgroundColor: '#66D0E8',
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 25,
    }
})