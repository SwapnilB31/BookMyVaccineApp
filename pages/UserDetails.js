import React, {useState, useReducer} from 'react'
import {View, ScrollView, Text, StyleSheet} from 'react-native'
import {Input, Button} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/FontAwesome5'
import CustomDatePicker from '../components/CustomDatePicker'

const styles = StyleSheet.create({
    container : {
        flex : 1,
        paddingHorizontal : '5%',
        paddingVertical : 7,
    },
    formContainer : {
        backgroundColor : "#fff",
        elevation : 2,
        paddingHorizontal : 4,
        paddingVertical : 15,
        borderRadius : 7,
    },
    dateInput : {
        width : '100%',
        paddingLeft : '2.5%',
        //paddingVertical : 4,
        borderBottomColor : "#aaa",
        borderBottomWidth: 1,
        paddingBottom : 9
    },
    dateBlock : {
        display: "flex",
        flexDirection : "column",
        width : '100%',
        marginBottom : 3,
        paddingHorizontal : '2%',
        paddingVertical : 7,
    }
})

export default function UserDetails() {

    const [date,setDate] = useState(null)

    return (
        <ScrollView style={styles.container} contentContainerStyle={{padding : 1}}>
            <View style={styles.formContainer}>
                <Input
                    label="Phone Number"
                    leftIcon={
                        <Icon
                            name="phone"
                            color="black"
                            size={15}
                        />
                    }
                    keyboardType="phone-pad"
                    placeholder="9876543210"
                    onChangeText={text => {}}
                />
                <Input
                    label="Age" 
                    leftIcon={
                        <Icon5
                            name="sort-numeric-up"
                            color="black"
                            size={15}
                        />
                    }
                    keyboardType="numeric"
                    placeholder="21"
                />
                <Input
                    label="Dose Number" 
                    leftIcon={
                        <Icon5
                            name="syringe"
                            color="black"
                            size={15}
                        />
                    }
                    keyboardType="numeric"
                    placeholder="1 or 2"
                />
                <View style={styles.dateBlock}>
                    <Text 
                        style={{
                            fontWeight: "bold", 
                            marginBottom : 4,
                            marginLeft : 8,
                            fontSize : 16,
                            color : "#999" 
                        }}
                    >Preferred Vaccination date</Text>
                    <CustomDatePicker 
                        style={styles.dateInput}
                        date={date}
                        onDateChange={setDate}
                        leftIcon
                    />
                </View>
                <View style={{
                    display : "flex",
                    width : '100%',
                    justifyContent : "center",
                    alignItems: "center"
                }}>
                    <Button
                        title="Submit"
                        containerStyle={{
                            width : "90%"
                        }}
                    />
                </View>
            </View>
        </ScrollView>
    )
}
