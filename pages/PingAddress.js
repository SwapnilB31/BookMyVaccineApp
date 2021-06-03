import React from 'react'
import {View,Button} from 'react-native'
import {headers} from '../data/headers'

export default function PingAddress() {

    function ping() {
        fetch('http://192.168.43.2/echo',{
            method : "GET",
            headers : headers
        }).then(res => {/*res.json()*/})/*.then(data => console.log(data))*/.catch(err => console.error(err))
    }

    return (
        <View style={{
            flex: 1,
            justifyContent : "center",
            alignItems : "center"
        }}>
            <Button
                title="Ping Echo Server"
                onPress={ping}
            />
        </View>
    )
}
