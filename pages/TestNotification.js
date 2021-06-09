import React, {useState} from 'react'
import {View, Text, StyleSheet, Button,TextInput} from 'react-native'
import NotificationManager from '../notifications/NotificationManager'
import BGServiceManager from '../BackgroundTasks/BGServiceManager'

const manager = new NotificationManager()
const bg = new BGServiceManager()

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
                style={styles.btnStyle}
                title="Show Notification"
                onPress={() => {
                    manager.scheduledNotification(title,message)
                }}
            />
            <Button
                style={styles.btnStyle}
                title="Start BG Service"
                onPress={() => {
                    bg.start()
                }}
            /> 
            <Button
                style={styles.btnStyle}
                title="Stop BG Service"
                onPress={() => {
                    bg.stop()
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
    },
    btnStyle : {
        width : '70%',
        marginVertical : 7
    }
})
