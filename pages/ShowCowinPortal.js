import React, {useState} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import WebView from 'react-native-webview'
import {LinearProgress} from 'react-native-elements'

export default function ShowCowinPortal() {
    const [progress,setProgress] = useState(0)
    const [title,setTitle] = useState('CoWIN Portal')
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text numberOfLines={1} style={styles.headerText}>{title}</Text>
            </View>
            {progress < 1 && <LinearProgress color="primary" style={{width : '100%'}} value={progress} variant="determinate"/>}
            <WebView 
                source={{uri : 'https://selfregistration.cowin.gov.in'}}
                onLoadProgress={({nativeEvent}) => {
                    //console.log(nativeEvent.progress)
                    setProgress(nativeEvent.progress)
                }}
                onLoadEnd={(syntheticEvent) => {
                    const {nativeEvent} = syntheticEvent
                    setTitle(nativeEvent.title)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    header: {
        backgroundColor : "#fff",
        elevation : 2,
        width : '100%',
        height : 40,
    },
    headerText : {
        fontSize : 18,
        fontWeight : "bold",
        paddingHorizontal : 20,
        paddingVertical: 7
    }
})