import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    errorAlert : {
        display : "flex",
        backgroundColor: "#f5a4a4",
        paddingHorizontal: "5%",
        paddingVertical: 7,
        borderLeftColor : "rgb(138, 3, 3)",
        borderLeftWidth : 4,
        width : "100%",
        marginVertical: 7,
        borderRadius : 3
    },
    errorText : {
        color: "rgb(138, 3, 3)",
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
