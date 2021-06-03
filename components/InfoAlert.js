import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    errorAlert : {
        display : "flex",
        backgroundColor: "#aed9e6",
        paddingHorizontal: "5%",
        paddingVertical: 7,
        borderLeftColor : "#095269",
        borderLeftWidth : 4,
        width : "90%",
        marginVertical: 7,
        borderRadius : 3
    },
    errorText : {
        color: "#095269",
        fontSize : 14
    }
})


export default function ErrorAlert({message}) {
    return (
        <View style={styles.errorAlert}>
            <Text style={styles.errorText}>{message}</Text>
        </View>
    )
}
