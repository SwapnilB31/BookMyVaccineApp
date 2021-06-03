import React, {useState, useEffect} from 'react'
import {View,Text,StyleSheet} from 'react-native'
import * as ReadSms from 'react-native-read-sms/ReadSms'

const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent : "center",
        alignItems : "center"
    },
    texth4 : {
        color : "blue",
        fontWeight: "400",
        fontSize : 16
    }
})

export default function ReadSMS() {
    const [sms,setSms] = useState(null)
    const [status,setStatus] = useState(null)

    useEffect(() => {
        getSMS(setSms,setStatus)
    },[])

    return (
        <View style={styles.container}>
            <Text style={styles.texth4}>
            {sms === null ? "Waiting for SMS" : typeof sms === "Object" ? JSON.stringify(sms) : sms.toString()}
            </Text>
            <Text style={styles.texth4}>
            {status === null ? "Pending" : typeof status === "Object" ? JSON.stringify(status) : status.toString()}
            </Text>
        </View>
    )
}

function readSmsPromiseWrapper() {
    return new Promise((resolve,reject) => {
        ReadSms.startReadSMS((status,sms,error) => {
            ReadSms.stopReadSMS()
            if(error)
                resolve(null)
            else
                resolve({status,sms})
        })
    })
}

async function getSMS(setSms, setStatus) {
    const hasPermission = await ReadSms.requestReadSMSPermission()
    if(hasPermission) {
        const smsResp = await readSmsPromiseWrapper()
        if(smsResp !== null) {
            const {status,sms} = smsResp
            setStatus(status)
            setSms(sms)
        }
        else {
            setStatus("400")
            setSms("Something went wrong!")
        }
    }
    else {
        setStatus("400")
        setSms("Something went wrong!")
    }
}
