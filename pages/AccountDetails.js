import React, { useContext } from 'react'
import {View,Text,StyleSheet} from 'react-native'
import {Divider} from 'react-native-elements'
import {UserContext} from '../contexts/UserProvider'
import Icon from 'react-native-vector-icons/FontAwesome'
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
        flexDirection : "row"
    }
})

export default function AccountDetails({navigation}) {

    const {state : {mobileNumber,age,benificiaryId,benificiaryName,dose,yearOfBirth,idType,idNumber}} = useContext(UserContext)

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.updateView}>
                    <Text style={[styles.nameText,styles.addTextMargin]}>{benificiaryName}</Text>
                    <TouchableOpacity
                        onPress={() => {navigation.navigate("Benificiary List")}}
                    >
                        <Icon name="refresh" size={16} color="#999"/>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.h3Text,styles.addTextMargin]}>REF ID: {benificiaryId}</Text>
                <Divider style={{height : 1, backgroundColor : "#aaa"}}/>
                <View style={styles.updateView}>
                    <Text style={[styles.nameText,styles.addTextMargin]}>Mobile : {mobileNumber}</Text>
                    <TouchableOpacity
                        onPress={() => {navigation.navigate("Set/Update Mobile Number")}}
                    >
                        <Icon name="refresh" size={16} color="#999"/>
                    </TouchableOpacity>
                </View>
                <Divider style={{height : 1, backgroundColor : "#aaa"}}/>

                <Text style={[styles.mutedText,styles.addTextMargin,{marginTop : 8}]}>Age : {age}</Text>
                <Text style={styles.mutedText}>Doses Taken : {dose - 1}</Text>
                <Text style={styles.mutedText}>Year Of Birth: {yearOfBirth}</Text>
                <Text style={styles.mutedText}>Photo ID: {idType}</Text>
                <Text style={[styles.mutedText,{marginBottom : 5}]}>ID Number: XXXX-{idNumber.slice(-4)}</Text>
            </View>
        </View>
    )
}
