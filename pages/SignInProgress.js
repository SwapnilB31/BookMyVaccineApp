import React, {useState, useEffect, useContext} from 'react'
import {ActivityIndicator,View,Text,StyleSheet, Dimensions} from 'react-native'
import {Overlay, Divider, Button} from 'react-native-elements'
import {AuthContext} from '../contexts/AuthProvider'

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center"
    },
    loadingContainer : {
        display:"flex",
        width : Dimensions.get("window").width * 0.75,
        height : Dimensions.get("window").height * 0.22,
        justifyContent : "center",
        alignItems : "center"
    },
    messageText : {
        fontSize : 18,
        fontWeight : "bold",
        color: "#00008b",
    },
    headerText : {
        fontSize : 16,
        fontWeight : "bold"
    }
})


export default function SignInProgress({route, navigation}) {
    const [visible,setVisible] = useState(true)
    const {state : {accessToken,loginAttempt,loginError,smsWaiting,otpSubmitting}, login,isTokenValid} = useContext(AuthContext)

   //console.log({params : route.params}) 

    const forceSignIn = route && route.params && route.params.forceSignIn || false
    const inputMobileNumber = route && route.params && route.params.inputMobileNumber || null 
    const destScreen = route.params.destScreen

    useEffect(() => {
        //console.log({destScreen}) 
        if(isTokenValid() && !forceSignIn)
            navigation.navigate(destScreen)
        else {
            //console.log({inputMobileNumber})
            if(inputMobileNumber)
                login({inputMobileNumber})
            else
                login({inputMobileNumber : null})
        }
    },[])

    useEffect(() => {
        //console.log({destScreen})
        if(!isTokenValid())
            return
        navigation.navigate(destScreen)
    },[accessToken])

    return (
        <View style={styles.container}>
            <Overlay visible={true}>
                <Text style={styles.headerText}>Signing In...</Text>
                <Divider style={{height : 1, backgroundColor : "#aaa"}}/>
                <View style={styles.loadingContainer}>
                    {loginAttempt && !smsWaiting && !otpSubmitting && (
                        <Text style={styles.messageText}>Requesting OTP...</Text>
                    )}
                    {loginAttempt && smsWaiting && (
                        <Text style={styles.messageText}>Waiting for SMS...</Text>
                    )}
                    {loginAttempt && otpSubmitting && !smsWaiting && (
                        <Text style={styles.messageText}>Submitting OTP...</Text>
                    )}
                    {loginError && (
                        <Text style={styles.messageText}>Something Went wrong...</Text>
                    )}
                    {loginError && 
                        <Button
                            title="RETRY"
                            type="outline"
                            onPress={() => login()}
                        />
                    }
                    {!loginError && <ActivityIndicator color="#0398fc" size="large"/>}
                </View>
            </Overlay>
        </View>
    )
}
