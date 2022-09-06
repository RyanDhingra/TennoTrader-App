import React from 'react';
import bg from '../assets/WFwallpaper.jpg'
import { FlatList, StyleSheet, ImageBackground, SafeAreaView, Text, TouchableOpacity, ItemSeparatorview, View, TextInput } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { useState, useEffect } from 'react';

function Search({ navigation }) {
    const [searchTerm, setSearchTerm] = useState("");
    let testData = [
        {
            "name": "Proxima Midnight",
            "email": "proxima@appdividend.com"
        },
        {
            "name": "Ebony Maw",
            "email": "ebony@appdividend.com"
        },
        {
            "name": "Black Dwarf",
            "email": "dwarf@appdividend.com"
        },
        {
            "name": "Mad Titan",
            "email": "thanos@appdividend.com"
        },
        {
            "name": "Supergiant",
            "email": "supergiant@appdividend.com"
        },
        {
            "name": "Loki",
            "email": "loki@appdividend.com"
        },
        {
            "name": "corvus",
            "email": "corvus@appdividend.com"
        },
        {
            "name": "Proxima Midnight",
            "email": "proxima1@appdividend.com"
        },
        {
            "name": "Ebony Maw",
            "email": "ebony1@appdividend.com"
        },
        {
            "name": "Black Dwarf",
            "email": "dwarf1@appdividend.com"
        },
        {
            "name": "Mad Titan",
            "email": "thanos1@appdividend.com"
        },
        {
            "name": "Supergiant",
            "email": "supergiant1@appdividend.com"
        },
        {
            "name": "Loki",
            "email": "loki1@appdividend.com"
        },
        {
            "name": "corvus",
            "email": "corvus1@appdividend.com"
        },
    ]

    const updateSearch = ( searchTerm ) => {
        setSearchTerm(searchTerm)
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
                    />
                </View>
                <View height="70%" width="70%">
                    <FlatList
                        backgroundColor='white'
                        data={testData}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item}) =>
                        <View style={styles.flatview}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                        </View>
                        }
                        keyExtractor={item => item.email}
                    />
                </View>
            </SafeAreaView>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.settings}>
                    <Text style={styles.buttonText}>
                        Back
                    </Text>
            </TouchableOpacity>
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
    settings: {
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
    },
    name: {
        fontFamily: 'Verdana',
        fontSize: 18
    },
    email: {
        color: 'red'
    },
    container: {
        height: 20
    },
})