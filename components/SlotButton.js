import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

export default function SlotButton({title, active = false, onPress}) {
    let containerStyle = [styles.btn]
    if(active)
        containerStyle.push(styles.btnActive)

    return (
        <TouchableOpacity style={containerStyle} onPress={() => onPress()}>
            <Text style={styles.btnText}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn : {
        borderWidth : 2,
        borderColor : "#590491",
        paddingVertical : 5,
        paddingHorizontal : 20,
        marginVertical : 4,
        width : "100%",
        display : "flex",
        justifyContent : "center",
        alignItems : "center",
        borderRadius : 7,
    },
    btnText : {
        color : "#590491",
        fontSize : 16,
        fontWeight : "600",
        //fontVariant : "sans-serif-medium",
        textAlign : "center"
    },
    btnActive : {
        backgroundColor : "#e7d4fa"
    }

})
