import React, {useState, useEffect} from 'react'
import {View, StyleSheet, Text, Dimensions} from 'react-native'
import {ListItem} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
    container : {
        flex : 1,
        flexDirection : 'column',
        alignItems: 'flex-start',
        justifyContent : 'flex-start',
        width: '60%',
        elevation: 2,
        backgroundColor: '#fff',
        marginTop: 0
    },
    text: {
        color: 'black'
    },
    items : {
        width : '100%'
    }
    
})

const menuItems = [
    {
        title: 'Home',
        iconName: 'home'
    },
    {
        title: 'Contact',
        iconName: 'phone'
    },
    {
        title: 'About',
        iconName: 'info-circle'
    }
]

function SideBar() {
    return (
        <View style={styles.container}>
        {
            menuItems.map( (val,ind) => (
                <ListItem key={ind} bottomDivider containerStyle={styles.items}>
                    <Icon
                        name={val.iconName}
                        size={18}
                        color='indigo'
                    />
                    <ListItem.Content>
                        <ListItem.Title >{val.title}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            ))
        }
        </View>
    )
}

export default SideBar
