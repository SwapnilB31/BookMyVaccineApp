import React, { useContext , useEffect, useState} from 'react'
import {View,Text,StyleSheet} from 'react-native'
import {Divider} from 'react-native-elements'
import {UserContext} from '../contexts/UserProvider'
import {AuthContext} from '../contexts/AuthProvider'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Button} from 'react-native-elements'

import { TouchableOpacity } from 'react-native'

const styles = StyleSheet.create({
    container : {
        flex : 1,
        paddingTop : 10,
        width : '100%'
    },
    card : {
        position: "relative",
        display : "flex",
        flexDirection: "column",
        width : '95%',
        backgroundColor : "#fff",
        elevation : 2,
        borderRadius: 7,
        padding: 15,
        marginBottom : 7,
        marginTop : 20,
        marginHorizontal: '2.5%',
        borderColor : "#aaa",
        borderWidth : 1
    },
    nameText : {
        fontSize : 18,
        fontWeight : "bold",
        color: "#00008b",
    },
    h3Text : {
        fontSize : 14,
        fontWeight : "300",
        color: "#444",
    },
    mutedText : {
        fontSize : 14,
        fontWeight : "300",
        color: "#999",
    },
    addTextMargin : {
        marginTop : 3,
        marginBottom : 7
    },
    updateView : {
        display : "flex",
        width : '100%',
        paddingVertical : 4,
        justifyContent : "space-between",
        alignItems : "center",
        flexDirection : "row"
    },
    addLeftMargin : {
        marginLeft : 5
    },
    iconButtonStyle : {
        borderColor : "#00008b",
        borderWidth : 1,
        borderRadius : 4,
        paddingHorizontal : 4,
        paddingVertical : 3,
    }
})

export default function AccountDetails({navigation}) {

    const {state : {mobileNumber,age,benificiaryId,benificiaryName,dose,yearOfBirth,idType,idNumber}} = useContext(UserContext)
    const {logout} = useContext(AuthContext)
    const [lIdNum,setLIdNum] = useState('        ')

    useEffect(() => {
        //logout()
        if(idNumber !== null)
        setLIdNum(idNumber)
    },[idNumber])

    return (
        <View style={styles.container}>
        {
            benificiaryId !== null ?
            (
                <View style={styles.card}>
                    <View style={styles.updateView}>
                        <Text style={[styles.nameText,styles.addTextMargin]}>{benificiaryName}</Text>
                        <View style={{flexDirection : "row"}}>
                            <TouchableOpacity
                                style={styles.iconButtonStyle}
                                onPress={() => {navigation.navigate("Benificiary List",{addHomeButton : false})}}
                            >
                                <Icon name="refresh" size={18} color="#00008b"/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.addLeftMargin,styles.iconButtonStyle]}
                                onPress={() => logout()}
                            >
                                <Icon name="sign-out" size={18} color="#00008b"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[styles.h3Text,styles.addTextMargin]}>REF ID: {benificiaryId}</Text>
                    <Divider style={{height : 1, backgroundColor : "#aaa"}}/>
                    <View style={styles.updateView}>
                        <Text style={[styles.nameText,styles.addTextMargin]}>Mobile : {mobileNumber}</Text>
                        <TouchableOpacity
                            onPress={() => {navigation.navigate("Set/Update Mobile Number")}}
                            style={styles.iconButtonStyle}
                        >
                            <Icon name="edit" size={18} color="#00008b"/>
                        </TouchableOpacity>
                    </View>
                    <Divider style={{height : 1, backgroundColor : "#aaa"}}/>

                    <Text style={[styles.mutedText,styles.addTextMargin,{marginTop : 8}]}>Age : {age}</Text>
                    <Text style={styles.mutedText}>Doses Taken : {dose - 1}</Text>
                    <Text style={styles.mutedText}>Year Of Birth: {yearOfBirth}</Text>
                    <Text style={styles.mutedText}>Photo ID: {idType}</Text>
                    <Text style={[styles.mutedText,{marginBottom : 5}]}>ID Number: XXXX-{lIdNum.slice(-4)}</Text>
                </View>
            ) :
            (
                <View style={styles.card}>
                    <Text style={{
                        fontSize : 16,
                        fontWeight :"900",
                        color : "#00008b",
                        marginBottom : 10
                    }}>
                        You aren't logged into your account. To use advanced features of this app, please log in.
                    </Text>
                    <Button
                        title="Log In"
                        type="solid"
                        icon={
                            <Icon
                                name="sign-in"
                                size={16}
                                color="#fff"
                            />
                        }
                        iconRight={true}
                        titleStyle={{
                            marginRight : 10
                        }}
                        onPress={() => navigation.navigate("Set/Update Mobile Number")}
                    />
                </View>
            )
        }

        </View>
    )
}
