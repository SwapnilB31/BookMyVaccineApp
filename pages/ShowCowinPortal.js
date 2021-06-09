import React, {useState,useRef} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import WebView from 'react-native-webview'
import {LinearProgress} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'
import { Dimensions } from 'react-native'

export default function ShowCowinPortal({navigation}) {
    const [progress,setProgress] = useState(0)
    const [title,setTitle] = useState('CoWIN Portal') 
    const webRef = useRef(null)
    
    console.log(Dimensions.get("window").height)
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Appointments")}>
                    <Icon
                        name="arrow-back"
                        size={24}
                        color="#444"
                    />
                </TouchableOpacity>
                <Text numberOfLines={1} style={styles.headerText}>{title}</Text>
                <TouchableOpacity onPress={() => webRef.current.reload()}>
                    <Icon
                        name="reload"
                        size={24}
                        color="#444"
                    />
                </TouchableOpacity>
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
                onError={(syntheticEvent) => {
                    const {nativeEvent} = syntheticEvent
                    console.warn('Error: '+nativeEvent)
                }}
                ref={webRef}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        paddingTop : 30,
        //position : "relative"
        /*justifyContent : "center",
        alignItems : "center"*/
    },
    header: {
        backgroundColor : "#fff",
        elevation : 2,
        width : '100%',
        height : 40,
        display : "flex",
        flexDirection : "row",
        justifyContent : "space-around",
        alignItems : "center"
    },
    headerText : {
        fontSize : 18,
        fontWeight : "bold",
        paddingHorizontal : 20,
        paddingVertical: 7
    },
    webView : {
        height : Dimensions.get("window").height-70,
        width : Dimensions.get("window").width
    }
})