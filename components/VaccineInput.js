import React, {useEffect, useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import {Overlay,Button,Switch} from 'react-native-elements'
import CustomDatePicker from './CustomDatePicker'
import {actions} from '../stores/VaccineInputStore'
import stateList from '../data/stateList.js'
import districtList from '../data/districtList.js'
import Icon from 'react-native-vector-icons/Ionicons'
import uuid from 'react-native-uuid'

/**
 * 
 * @param {Object} param
 * @param {any} param.state
 * @param {React.Dispatch<{type: string;payload: any;}>} param.dispatch
 * @param {StyleSheet} param.style
 */
export default function VaccineInput({style,state,dispatch}) {
    const [stateName,setStateName] = useState('Not Selected')
    const [districtName,setDistrictName] = useState('Not Selected')
    const [visible,setVisible] = useState(false)
    const {date, districtId, stateId, pinCodeMode, pinCode, _18PlusMode, _45PlusMode} = state 

    useEffect(() => {
        if(stateId === 0)
            return
        //setDistrictId(0)
        dispatch({type : actions.setDistrictId, payload : 0})
        setDistrictName('Not Selected')
    },[stateId])

    return (
        <View style={style}>
            <View style={styles.btn}>
                <TouchableOpacity 
                    style={styles.inputButton}
                    onPress={() => setVisible(true)}
                >
                    <Text numberOfLines={1} style={[styles.btnText,styles.stdSmallerText]}>
                        {dateToStr(date)} | {pinCodeMode ? `${pinCode}` : `${stateName.slice(0,16)} | ${districtName.slice(0,16)}`}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setVisible(true)}
                >
                    <Icon name="settings" color="black" size={16}/>
                </TouchableOpacity>
            </View>
            <Overlay overlayStyle={styles.overlay} visible={visible} onBackdropPress={() => setVisible(false)}>
                <CustomDatePicker
                    date={date}
                    onDateChange={(date) => dispatch({type : actions.setDate, payload : date})}
                    style={styles.datePicker}
                />
                <View style={styles.switchBox}>
                    <Text style={styles.stdText}>Search By PinCode</Text>
                    <Switch
                        value={pinCodeMode}
                        onValueChange={() => {
                            //setPinCodeMode(prev => !prev)
                            dispatch({type : actions.togglePinCodeMode})
                        }}
                    />    
                </View>
                {
                    true && (
                        <StatePicker 
                            dispatch={dispatch}
                            setStateName={setStateName}
                            stateName={stateName}
                            stateId={stateId}
                            enabled={!pinCodeMode}
                        />
                    ) 
                }
                {
                    true && 
                    (
                        <DistrictPicker 
                            dispatch={dispatch}
                            setDistrictName={setDistrictName}
                            stateId={stateId}
                            districtId={districtId}
                            districtName={districtName}
                            enabled={!pinCodeMode}
                        />
                    )
                }
                {
                    true && (
                        <TextInput
                            style={[styles.datePicker,styles.stdText]}
                            placeholder="Pincode"
                            value={pinCode}
                            onChangeText={text => {text.length <= 6 && dispatch({type : actions.setPinCode, payload : text})}}
                            keyboardType="numeric"
                            editable={pinCodeMode}
                        />
                    )
                }
                <View style={styles.switchBox}>
                    <Text style={styles.stdText}>18+</Text>
                    <Switch
                        value={_18PlusMode}
                        onValueChange={() => dispatch({type : actions.toggle18PlusMode, payload : false})}
                    />    
                </View> 
                <View style={styles.switchBox}>
                    <Text style={styles.stdText}>45+</Text>
                    <Switch
                        value={_45PlusMode}
                        onValueChange={() => dispatch({type : actions.toggle45PlusMode, payload : false})}
                    />    
                </View>
                <View style={styles.modalActionBar}>
                    <Button
                        containerStyle={{width : 70}}
                        type="outline"
                        icon={<Icon name="search" color="#0ca0f0" size={18}/>}
                    />
                </View>
            </Overlay>
        </View>
    )
}

function StatePicker({dispatch,setStateName,stateId,stateName,enabled}) {
    return (
        <View style={styles.picker}>
            <Picker
                enabled={enabled}
                onValueChange={(itemValue, itemIndex) => {
                    const itemObj = JSON.parse(itemValue)
                    //setStateId(itemObj.value)
                    dispatch({type : actions.setStateId, payload : itemObj.value})
                    setStateName(itemObj.label)
                }}
                selectedValue={JSON.stringify({value : stateId, label : stateId === 0 ? 'Pick a State' : stateName})}
            >
                <Picker.Item value={JSON.stringify({value : 0, label : "Pick a State"})} label="Pick a State"/>
                {
                    stateList.map(val => (
                        <Picker.Item value={JSON.stringify({value : val.state_id, label : val.state_name})} label={val.state_name} key={uuid.v4()}/>
                    ))
                }
            </Picker>
        </View>
    )
}

function DistrictPicker({dispatch,setDistrictName,stateId,districtId,districtName,enabled}) {
    if(stateId == 0)
        return (
            <View style={styles.picker}>
                <Picker
                    enabled={enabled}
                >
                    <Picker.Item value={0} label="Select a state first"/>
                </Picker>
            </View>
        )
    else
    return (
        <View style={styles.picker}>
            <Picker
                enabled={enabled}
                onValueChange={(itemValue,itemIndex) => {
                    const itemObj = JSON.parse(itemValue)
                    //setDistrictId(itemObj.value)
                    dispatch({type : actions.setDistrictId, payload : itemObj.value})
                    setDistrictName(itemObj.label)
                }}
                selectedValue={JSON.stringify({value : districtId, label : districtId === 0 ? 'Select District' : districtName})}
            >
                <Picker.Item value={0} label="Select District"/>
                {
                    districtList[stateId].map(val => (
                        <Picker.Item value={JSON.stringify({value : val.district_id, label : val.district_name})} label={val.district_name} key={uuid.v4()}/>
                    ))
                }
            </Picker>
        </View>
    )
}

const styles = StyleSheet.create({
    btn : {
        width :'100%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems : "center",
        paddingVertical : 5
    },
    btnText : {
        fontSize : 10
    },
    picker: {
        backgroundColor: "#fff",
        width : "90%",
        elevation: 2,
        borderRadius : 5,
        marginBottom : 4,
        marginHorizontal : "5%"
    },
    datePicker : {
        paddingVertical : 12,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        width : "90%",
        elevation: 2,
        borderRadius : 5,
        marginBottom : 4,
        marginHorizontal : "5%",
        marginTop : 10
    },
    closeButton : {
        color: "orangered"
    },
    addMarginBottom : {
        marginBottom : 7
    },
    inputButton : {
        flexGrow : 1
    },
    overlay : {
        width : Dimensions.get("window").width * 0.9,
        maxHeight : Dimensions.get("window").height * 0.7
    },
    switchBox : {
        display : "flex",
        width : '90%',
        justifyContent : "space-between",
        alignItems : "center",
        flexDirection : "row",
        marginHorizontal : "5%",
        marginVertical : 5,
        paddingVertical : 12,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        elevation : 2,
        borderRadius : 5,
    },
    modalActionBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop : 7,
        width : '90%',
        marginHorizontal : '5%'
        /*borderTopColor : "lightgray",
        borderTopWidth : 1,*/
    },
    stdText : {
        textAlign : "left",
        fontSize: 16
    },
    stdSmallerText : {
        textAlign : "left",
        fontSize: 14
    }
})

function dateToStr(date) {
    if(date === null) 
        return `---Pick a Date---`
    let day = date.getDate()
    day = day > 10 ? day : `0${day}`
    let month = date.getMonth() + 1
    month = month > 10 ? month : `0${month}`
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
}
