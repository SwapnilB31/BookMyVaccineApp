import React, {useState} from 'react'
import {View, Text, StyleSheet, Button,TextInput} from 'react-native'
import NotificationManager from '../notifications/NotificationManager'

const manager = new NotificationManager()

export default function TestNotification() {

    const [title,setTitle] = useState('')
    const [message,setMessage] = useState('')

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInp} 
                placeholder="Title"
                keyboardType="default"
                onChangeText={text => setTitle(text)}
            />
            <TextInput
                style={styles.textInp}
                placeholder="Message"
                keyboardType="default"
                onChangeText={text => setMessage(text)}
            />
            <Button
                title="Show Notification"
                onPress={() => {
                    manager.scheduledNotification(title,message)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center"
    },
    textInp : {
        paddingVertical : 5,
        borderBottomColor : "#444",
        borderBottomWidth : 1,
        width : '80%',
        marginBottom : 10
    }
})
