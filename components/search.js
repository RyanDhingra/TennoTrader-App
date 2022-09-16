import React, { useEffect } from 'react';
import bg from '../assets/WFwallpaper.jpg'
import { FlatList, StyleSheet, ImageBackground, SafeAreaView, Text, Alert, TouchableOpacity, View } from 'react-native';
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

    useEffect(() => {
        const { clear } = route.params;
        if (clear === 1) {
            setWatchlist([])
        }
    }, [route])

    useEffect(() => {
        getCookie().then(req => setWatchlist(JSON.parse(req)))
    }, [])

    const capitalizeNames = (items) => {
        const capitalizedNames = []

        for (let x = 0; x < items.length; x++) {
            const currName = items[x]
            const seperateWords =  currName.split(" ")
            const newName = ""

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
                        curr_data.push(curr_name)
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
        setItemClicked(true);

        if (watchlist.length < 5) {
            if (watchlist.includes(item)) {
                Alert.alert("Item Already Being Watched", "This item has already been added to your watchlist.", [
                    {text: "Ok"}
                ])
            } else {
                const newWatchlist = []
                for (let x = 0; x < watchlist.length; x++) {
                    newWatchlist.push(watchlist[x])
                }
                newWatchlist.push(item)
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

    return (
        <ImageBackground source={bg} style={styles.bg}>
            <SafeAreaView alignItems= 'center' width='100%' height='100%'>
                <View style={styles.searchBar}>
                    <SearchBar 
                        value={searchTerm}
                        onChangeText={updateSearch}
                        placeholder="Search for an item..."
                        inputContainerStyle={{backgroundColor: 'rgba(0, 0, 0, 0)', color:'white'}}
                        containerStyle={{backgroundColor: '#66D0E8', borderWidth: 1, borderRadius: 100, width: '350%', color:'white', marginBottom: 50}}
                        inputStyle={{color: 'white', margin: 0, color:'white', fontSize: 25, fontFamily: 'WFfont'}}
                        searchIcon={{color:'white', size: 25}}
                        clearIcon={{color:'white', size: 20}}
                        placeholderTextColor='white'
                        onSubmitEditing={sortData}
                    />
                </View>
                <View height="65%" width="70%">
                    <FlatList
                        backgroundColor='#66D0E8'
                        borderRadius='50'
                        borderTopLeftRadius='0'
                        borderTopRightRadius='0'
                        borderWidth='1'
                        borderColor='black'
                        data={itemNames}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                        <View style={styles.flatview}>
                            <TouchableOpacity onPress={() => setCurrItem(item)}>
                                <Text style={styles.name}>{item}</Text>
                            </TouchableOpacity>
                        </View>
                        }
                        keyExtractor={item => itemNames.indexOf(item)}
                    />
                </View>
            </SafeAreaView>
            <View style={styles.top}></View>
            <TouchableOpacity onPress={() => navigation.navigate('Watchlist')} style={styles.watchlist}>
                    <Text style={styles.buttonText}>
                        Start Watching
                    </Text>
            </TouchableOpacity>
            <View style={styles.bottom}></View>
            <View style={itemClicked ? styles.box: null}>
                <Text>
                    Set Watch Price
                </Text>
                <TouchableOpacity onPress={() => setItemClicked(false)}>
                    <Text>
                        Cancel
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => addToWatchlist()}>
                    <Text>
                        Add To Watchlist
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
        fontSize: '50px'
    },
    watchlist: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, .5)',
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
    searchBar: {
        width: 100,
        top: 50,
        justifyContent: 'center',
        alignItems: 'center',
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
    box: {
        position: 'absolute',
        top: '40%',
        width: 300,
        height: 100,
        backgroundColor: 'green',
    }
})